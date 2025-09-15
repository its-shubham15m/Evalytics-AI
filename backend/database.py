# backend/database.py
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGODB_URI")

if not MONGO_URI:
    raise RuntimeError("MONGODB_URI not set in .env")

# MongoDB setup
client = AsyncIOMotorClient(MONGO_URI)
db = client["evalytics-ai"]

# Collections
users_collection = db["users"]
exams_collection = db["exams"]
practice_collection = db["practice_questions"]
tests_collection = db["tests"]
attempts_collection = db["attempts"]
certifications_collection = db["certifications"]
sessions_collection = db["exam_sessions"]
results_collection = db["results"]
interview_sessions_collection = db["interview_sessions"]
interview_results_collection = db["interview_results"]
interviews_collection = db["interviews"]

async def get_db():
    return db