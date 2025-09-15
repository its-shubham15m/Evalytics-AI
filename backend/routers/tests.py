# backend/routers/tests.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime
from backend import models, utils, database
import httpx
import base64
import os

router = APIRouter(prefix="/api/tests", tags=["Tests"])

JUDGE0_URL = os.getenv("JUDGE0_URL", "http://localhost:2358")  # your Judge0 API

async def run_code_against_testcases(source_code: str, language_id: int, test_cases: list):
    """Run user code against all test cases using Judge0."""
    results = []
    async with httpx.AsyncClient() as client:
        for tc in test_cases:
            payload = {
                "source_code": source_code,
                "language_id": language_id,
                "stdin": tc["input"],
                "expected_output": tc["output"]
            }
            resp = await client.post(f"{JUDGE0_URL}/submissions?wait=true", json=payload)
            data = resp.json()
            results.append(data)
    return results

@router.get("/", response_model=List[models.TestModel])
async def get_all_tests(current_user: dict = Depends(utils.get_current_user)):
    tests_cursor = database.tests_collection.find()
    tests = await tests_cursor.to_list(100)
    for test in tests:
        test["_id"] = str(test["_id"])
        if "pass_criteria" not in test:
            test["pass_criteria"] = 80
    return tests

@router.get("/{test_id}", response_model=models.TestModel)
async def get_test_details(test_id: str, current_user: dict = Depends(utils.get_current_user)):
    if not ObjectId.is_valid(test_id):
        raise HTTPException(status_code=400, detail="Invalid test ID")
    test = await database.tests_collection.find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    test["_id"] = str(test["_id"])
    if "pass_criteria" not in test:
        test["pass_criteria"] = 80
    return test

@router.post("/{test_id}/submit", response_model=dict)
async def submit_test(test_id: str, submission: dict, current_user: dict = Depends(utils.get_current_user)):
    if not ObjectId.is_valid(test_id):
        raise HTTPException(status_code=400, detail="Invalid test ID")
    test = await database.tests_collection.find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    total_questions = len(test["questions"])
    total_score = 0.0

    for question in test["questions"]:
        answer_code = submission.get("answers", {}).get(question["id"], "")
        if question["question_type"] == "coding":
            all_cases = question.get("test_cases", [])
            if not answer_code.strip() or not all_cases:
                continue
            encoded_code = base64.b64encode(answer_code.encode()).decode()
            results = await run_code_against_testcases(encoded_code, 71, all_cases)  # 71 = Python
            passed = sum(1 for r in results if r["status"]["description"] == "Accepted")
            total_score += passed / len(all_cases)
        elif question["question_type"] == "mcq":
            if answer_code and "correct_answer" in question and answer_code == question["correct_answer"]:
                total_score += 1

    final_score = (total_score / total_questions) * 100 if total_questions else 0
    passed = final_score >= test.get("pass_criteria", 80)

    attempt_data = {
        "user_id": str(current_user["_id"]),
        "test_id": test_id,
        "test_name": test["title"],
        "score": round(final_score, 2),
        "submitted_at": datetime.utcnow(),
        "answers": submission.get("answers", {})
    }
    result = await database.attempts_collection.insert_one(attempt_data)

    certification_awarded = False
    if passed:
        cert = {
            "user_id": str(current_user["_id"]),
            "test_id": test_id,
            "test_name": test["title"],
            "score": round(final_score, 2),
            "awarded_at": datetime.utcnow(),
            "attempt_id": str(result.inserted_id)
        }
        await database.certifications_collection.insert_one(cert)
        certification_awarded = True

    return {"success": True, "score": round(final_score, 2), "passed": passed, "certification_awarded": certification_awarded}

@router.get("/user/certifications", response_model=List[models.CertificationResponse])
async def get_user_certifications(current_user: dict = Depends(utils.get_current_user)):
    certs = await database.certifications_collection.find({"user_id": str(current_user["_id"])}).to_list(50)
    for cert in certs:
        cert["id"] = str(cert["_id"])
        cert["_id"] = str(cert["_id"])
    return certs

@router.get("/user/attempts", response_model=List[models.AttemptResponse])
async def get_user_attempts(current_user: dict = Depends(utils.get_current_user)):
    attempts = await database.attempts_collection.find({"user_id": str(current_user["_id"])}).to_list(50)
    for attempt in attempts:
        attempt["id"] = str(attempt["_id"])
        attempt["_id"] = str(attempt["_id"])
        test = await database.tests_collection.find_one({"_id": ObjectId(attempt["test_id"])})
        if test:
            attempt["test_title"] = test["title"]
            attempt["total_questions"] = len(test["questions"])
    return attempts
