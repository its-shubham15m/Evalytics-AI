from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from backend import models, utils, database

router = APIRouter(prefix="/api/practice", tags=["Practice"])

@router.get("/", response_model=List[models.PracticeModel])
async def get_all_practice_questions(current_user: dict = Depends(utils.get_current_user)):
    practice_cursor = database.practice_collection.find()
    questions = await practice_cursor.to_list(100)
    return questions

@router.get("/{question_id}", response_model=models.PracticeModel)
async def get_practice_question(question_id: str, current_user: dict = Depends(utils.get_current_user)):
    if not ObjectId.is_valid(question_id):
        raise HTTPException(status_code=400, detail="Invalid question ID")
    question = await database.practice_collection.find_one({"_id": ObjectId(question_id)})
    if not question:
        raise HTTPException(status_code=404, detail="Practice question not found")
    return question