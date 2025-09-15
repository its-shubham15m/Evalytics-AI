# backend/routers/interview.py
import httpx
import os
import base64
import json
import re
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Dict, Optional
from bson import ObjectId
from datetime import datetime

from pydantic import BaseModel
from backend import models, utils, database

router = APIRouter(prefix="/api/interview", tags=["Interview"], redirect_slashes=False)

# Google Generative AI setup
import google.generativeai as genai

# Configure Google AI
GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")
if GOOGLE_AI_API_KEY:
    genai.configure(api_key=GOOGLE_AI_API_KEY)

class InterviewEvaluationRequest(BaseModel):
    question_id: str
    user_answer: str
    audio_quality: float = 4.0
    video_quality: float = 4.0
    presence_score: float = 4.0

class InterviewSubmission(BaseModel):
    session_id: str
    answers: Dict[str, str]
    evaluations: Dict[str, Dict]

def extract_json_from_text(text):
    """Extract JSON from text that might contain other content"""
    try:
        # Try to find JSON pattern in the text
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            return json.loads(json_str)
        # If no JSON found, try to parse the whole text as JSON
        return json.loads(text)
    except:
        return None

async def evaluate_with_ai(question: str, correct_answer: str, user_answer: str) -> Dict:
    """Evaluate user's answer using Google Generative AI"""
    try:
        if not GOOGLE_AI_API_KEY:
            return {
                "score": 3.5, 
                "feedback": "AI evaluation not configured. Please check your API settings.", 
                "category": "average"
            }
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Evaluate this interview answer on a scale of 1-5 (1=worst, 5=excellent):
        
        Question: {question}
        Expected Answer Guidelines: {correct_answer}
        User's Answer: {user_answer}
        
        Provide evaluation in this exact JSON format only (no other text):
        {{
            "score": 3.8,
            "feedback": "Detailed feedback about the answer...",
            "category": "average|good|excellent"
        }}
        """
        
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        evaluation = extract_json_from_text(response.text)
        
        if not evaluation:
            # Fallback if JSON parsing fails
            return {
                "score": 3.5, 
                "feedback": f"Could not parse AI response: {response.text}", 
                "category": "average"
            }
            
        # Validate the evaluation structure
        if "score" not in evaluation:
            evaluation["score"] = 3.5
        if "feedback" not in evaluation:
            evaluation["feedback"] = "No feedback provided by AI"
        if "category" not in evaluation:
            evaluation["category"] = get_category_from_score(evaluation["score"])
            
        return evaluation
        
    except Exception as e:
        return {
            "score": 3.5, 
            "feedback": f"Evaluation error: {str(e)}", 
            "category": "average"
        }

@router.get("", response_model=List[dict])
async def get_all_interviews(current_user: dict = Depends(utils.get_current_user)):
    interviews = await database.interviews_collection.find().to_list(length=100)
    for interview in interviews:
        interview["_id"] = str(interview["_id"])
    return interviews

@router.get("/{interview_id}", response_model=dict)
async def get_interview_details(interview_id: str, current_user: dict = Depends(utils.get_current_user)):
    if not ObjectId.is_valid(interview_id):
        raise HTTPException(status_code=400, detail="Invalid interview ID")
    
    interview = await database.interviews_collection.find_one({"_id": ObjectId(interview_id)})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview["_id"] = str(interview["_id"])
    return interview

@router.post("/start/{interview_id}", response_model=dict)
async def start_interview_session(interview_id: str, current_user: dict = Depends(utils.get_current_user)):
    if not ObjectId.is_valid(interview_id):
        raise HTTPException(status_code=400, detail="Invalid interview ID")
    
    interview = await database.interviews_collection.find_one({"_id": ObjectId(interview_id)})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Create interview session
    session_data = {
        "user_id": str(current_user["_id"]),
        "interview_id": interview_id,
        "start_time": datetime.utcnow(),
        "end_time": None,
        "current_question_index": 0,
        "answers": {},
        "evaluations": {},
        "proctoring_flags": []
    }
    
    result = await database.interview_sessions_collection.insert_one(session_data)
    session_id = str(result.inserted_id)
    
    return {
        "session_id": session_id,
        "first_question": interview["questions"][0] if interview["questions"] else None
    }

@router.post("/evaluate-answer", response_model=dict)
async def evaluate_answer(
    question_id: str = Form(...),
    session_id: str = Form(...),
    user_answer: str = Form(...),
    audio: Optional[UploadFile] = File(None),
    current_user: dict = Depends(utils.get_current_user)
):
    if not ObjectId.is_valid(session_id):
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    # Get session
    session = await database.interview_sessions_collection.find_one({
        "_id": ObjectId(session_id),
        "user_id": str(current_user["_id"])
    })
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get interview question
    interview = await database.interviews_collection.find_one({"_id": ObjectId(session["interview_id"])})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    question = next((q for q in interview["questions"] if q["id"] == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Evaluate with AI
    evaluation = await evaluate_with_ai(
        question["text"],
        question.get("expected_answer", ""),
        user_answer
    )
    
    # Calculate overall score considering audio/video quality
    audio_quality = 4.0  # Default value
    video_quality = 4.0  # Default value
    presence_score = 4.0  # Default value
    
    # Use proper rounding to avoid floating point precision issues
    overall_score = round(
        evaluation["score"] * 0.6 +  # AI evaluation weight
        audio_quality * 0.2 +        # Audio quality weight
        video_quality * 0.2 +        # Video quality weight
        presence_score * 0.1,        # Presence score weight
        1  # Round to 1 decimal place
    )
    
    # Ensure score is within bounds
    overall_score = min(5.0, max(1.0, overall_score))
    
    # Update session with answer and evaluation
    await database.interview_sessions_collection.update_one(
        {"_id": ObjectId(session_id)},
        {
            "$set": {
                f"answers.{question_id}": user_answer,
                f"evaluations.{question_id}": {
                    "overall_score": overall_score,
                    "technical_score": evaluation["score"],
                    "feedback": evaluation["feedback"],
                    "category": evaluation["category"],
                    "audio_quality": audio_quality,
                    "video_quality": video_quality,
                    "presence_score": presence_score
                }
            }
        }
    )
    
    return {
        "overall_score": overall_score,
        "technical_score": evaluation["score"],
        "feedback": evaluation["feedback"],
        "category": evaluation["category"]
    }

@router.post("/submit", response_model=dict)
async def submit_interview(submission: InterviewSubmission, current_user: dict = Depends(utils.get_current_user)):
    session_id = submission.session_id
    if not session_id or not ObjectId.is_valid(session_id):
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    # Get session
    session = await database.interview_sessions_collection.find_one({
        "_id": ObjectId(session_id),
        "user_id": str(current_user["_id"])
    })
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Update session with answers and evaluations
    await database.interview_sessions_collection.update_one(
        {"_id": ObjectId(session_id)},
        {
            "$set": {
                "answers": submission.answers,
                "evaluations": submission.evaluations,
                "end_time": datetime.utcnow()
            }
        }
    )
    
    # Calculate final score
    evaluations = submission.evaluations
    scores = [eval_data.get("overall_score", 3.0) for eval_data in evaluations.values()]
    final_score = round(sum(scores) / len(scores), 1) if scores else 3.0
    
    # Get interview details
    interview = await database.interviews_collection.find_one({"_id": ObjectId(session["interview_id"])})
    
    # Save interview result
    result_data = {
        "user_id": str(current_user["_id"]),
        "interview_id": session["interview_id"],
        "interview_title": interview["title"] if interview else "Unknown Interview",
        "session_id": session_id,
        "final_score": final_score,
        "evaluations": evaluations,
        "answers": submission.answers,
        "submitted_at": datetime.utcnow(),
        "type": "interview"
    }
    
    await database.interview_results_collection.insert_one(result_data)
    
    return {
        "success": True,
        "final_score": final_score,
        "category": get_category_from_score(final_score)
    }

def get_category_from_score(score: float) -> str:
    if score >= 4.5:
        return "excellent"
    elif score >= 3.5:
        return "good"
    elif score >= 2.5:
        return "average"
    elif score >= 1.5:
        return "bad"
    else:
        return "worst"

@router.get("/user/results", response_model=List[dict])
async def get_user_interview_results(current_user: dict = Depends(utils.get_current_user)):
    results = await database.interview_results_collection.find(
        {"user_id": str(current_user["_id"])}
    ).to_list(length=50)
    
    for result in results:
        result["_id"] = str(result["_id"])
    
    return results