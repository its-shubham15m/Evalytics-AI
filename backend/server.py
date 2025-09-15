# backend/server.py
# uvicorn backend.server:app --reload --port 5000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, exams, practice, tests, interview
from backend.database import db

app = FastAPI(title="Evalytics-AI Backend")

# --------------------------
# CORS Middleware
# --------------------------
# Allow frontend at localhost:5173 and handle credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]  # ADD THIS LINE
)

# --------------------------
# Include Routers
# --------------------------
app.include_router(auth.router)
app.include_router(exams.router)
app.include_router(practice.router)
app.include_router(tests.router)
app.include_router(interview.router)

# --------------------------
# Startup / Shutdown Events
# --------------------------
@app.on_event("startup")
async def startup_db_client():
    print("FastAPI application starting up...")
    # Check if interviews collection exists, seed if empty
    if await db["interviews"].count_documents({}) == 0:
        print("Interviews collection is empty - consider seeding data")

@app.on_event("shutdown")
async def shutdown_db_client():
    print("FastAPI application shutting down...")

# --------------------------
# Root Endpoint
# --------------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to Evalytics-AI Backend"}