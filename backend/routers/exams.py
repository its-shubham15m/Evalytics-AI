# backend/routers/exams.py
import httpx
import os
import asyncio
import base64
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from bson import ObjectId
from datetime import datetime
from backend import models, utils, database

router = APIRouter(prefix="/api", tags=["Exams"])

# --- Pydantic Models ---
class CodeExecutionRequest(BaseModel):
    source_code: str  # base64 encoded string
    language_id: int
    test_cases: List[dict]

class SubmissionRequest(BaseModel):
    session_id: str
    answers: Dict[str, str]

# --- Helper Functions ---
async def get_exam_from_db(exam_id: str):
    if not ObjectId.is_valid(exam_id):
        raise HTTPException(status_code=400, detail="Invalid Exam ID format.")
    exam = await database.exams_collection.find_one({"_id": ObjectId(exam_id)})
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found.")
    return exam

# --- API Routes ---

@router.get("/exams", response_model=List[models.ExamModel])
async def get_all_exams(current_user: dict = Depends(utils.get_current_user)):
    return await database.exams_collection.find().to_list(length=100)

@router.get("/exams/{exam_id}", response_model=models.ExamModel)
async def get_exam_details(exam_id: str, current_user: dict = Depends(utils.get_current_user)):
    return await get_exam_from_db(exam_id)

@router.post("/exams/start/{exam_id}", response_model=dict)
async def start_exam_session(exam_id: str, current_user: dict = Depends(utils.get_current_user)):
    await get_exam_from_db(exam_id)
    
    # Create session with explicit fields
    session_data = {
        "user_id": str(current_user["_id"]),
        "exam_id": exam_id,
        "start_time": datetime.utcnow(),
        "end_time": None,
        "flags": [],
        "answers": {}
    }
    
    result = await database.sessions_collection.insert_one(session_data)
    session_id = str(result.inserted_id)
    
    return {"session_id": session_id}

@router.post("/exams/run-code", response_model=dict)
async def run_code(request: CodeExecutionRequest, current_user: dict = Depends(utils.get_current_user)):
    JUDGE0_API_KEY = os.getenv("VITE_JUDGE0_API_KEY")
    if not JUDGE0_API_KEY:
        raise HTTPException(status_code=500, detail="Judge0 API key not configured on the server.")

    submissions = [
        {
            "source_code": request.source_code,
            "language_id": request.language_id,
            "stdin": base64.b64encode(case.get("input", "").encode('utf-8')).decode('utf-8')
        } for case in request.test_cases
    ]
    headers = {"X-RapidAPI-Key": JUDGE0_API_KEY, "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=true",
                json={"submissions": submissions},
                headers=headers,
                timeout=20
            )
            response.raise_for_status()
            tokens = [sub['token'] for sub in response.json()]
            await asyncio.sleep(3)

            result_response = await client.get(
                f"https://judge0-ce.p.rapidapi.com/submissions/batch?tokens={','.join(tokens)}&base64_encoded=true&fields=stdout,stderr,status",
                headers=headers,
                timeout=20
            )
            result_response.raise_for_status()
            return {"results": result_response.json()["submissions"]}

        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Could not connect to code execution service: {e}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error from code execution service: {e.response.text}")

@router.post("/exams/submit", response_model=dict)
async def submit_exam_and_grade(submission: SubmissionRequest, current_user: dict = Depends(utils.get_current_user)):
    # Validate ObjectId
    try:
        session_obj_id = ObjectId(submission.session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Exam session ID format.")

    # Find the session
    session = await database.sessions_collection.find_one({
        "_id": session_obj_id,
        "user_id": str(current_user["_id"])
    })

    if not session:
        raise HTTPException(status_code=404, detail="Exam session not found.")
    if session.get("end_time"):
        raise HTTPException(status_code=400, detail="Exam already submitted.")

    exam = await get_exam_from_db(session["exam_id"])
    score = 0
    total_questions = len(exam["questions"])
    detailed_results = {}

    for question in exam["questions"]:
        q_id = question["id"]
        user_answer = submission.answers.get(q_id)
        is_correct = False

        if question["question_type"] == "mcq":
            is_correct = user_answer == question.get("correct_answer")
            if is_correct: score += 1
            detailed_results[q_id] = {
                "type": "mcq",
                "is_correct": is_correct,
                "user_answer": user_answer,
                "correct_answer": question.get("correct_answer")
            }

        elif question["question_type"] == "coding" and user_answer:
            hidden_cases = [tc for tc in question.get("test_cases", []) if tc.get("hidden")]
            if not hidden_cases:
                detailed_results[q_id] = {"type": "coding", "error": "No hidden test cases for grading.", "user_code": user_answer}
                continue

            try:
                encoded_code = base64.b64encode(user_answer.encode('utf-8')).decode('utf-8')
                run_result = await run_code(CodeExecutionRequest(
                    source_code=encoded_code,
                    language_id=71,  # Python
                    test_cases=hidden_cases
                ), current_user)

                passed_count = sum(1 for res in run_result["results"] if res["status"]["description"] == "Accepted")
                is_correct = passed_count == len(hidden_cases)
                if is_correct: score += 1
                detailed_results[q_id] = {
                    "type": "coding",
                    "passed_cases": passed_count,
                    "total_cases": len(hidden_cases),
                    "is_correct": is_correct
                }

            except HTTPException as e:
                detailed_results[q_id] = {"type": "coding", "error": f"Grading failed: {e.detail}", "is_correct": False}

    final_score_percentage = (score / total_questions) * 100 if total_questions > 0 else 0

    result_doc = {
        "user_id": str(current_user["_id"]),
        "session_id": submission.session_id,
        "exam_id": session["exam_id"],
        "exam_title": exam["title"],
        "submitted_at": datetime.utcnow(),
        "score": round(final_score_percentage, 2),
        "details": detailed_results
    }

    await database.db["results"].insert_one(result_doc)
    await database.sessions_collection.update_one(
        {"_id": session_obj_id}, 
        {"$set": {"end_time": datetime.utcnow()}}
    )

    return {"success": True, "message": "Exam submitted and graded successfully.", "score": result_doc["score"]}

@router.get("/user/results", response_model=List[dict])
async def get_user_exam_results(current_user: dict = Depends(utils.get_current_user)):
    results = await database.results_collection.find(
        {"user_id": str(current_user["_id"])}
    ).to_list(length=50)
    
    for result in results:
        result["_id"] = str(result["_id"])
        result["type"] = "exam"
    
    return results