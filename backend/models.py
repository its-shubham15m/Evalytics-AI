# backend/models.py
from pydantic import BaseModel, EmailStr, Field, GetCoreSchemaHandler
from pydantic_core import core_schema
from datetime import datetime
from bson import ObjectId
from typing import List, Optional, Any, Dict

# ====================================================================
# Pydantic V2 Custom Type for BSON ObjectId (Corrected)
# ====================================================================
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        """
        Defines the validation and serialization logic for ObjectIds for Pydantic v2.
        - Validation: Tries to convert the input into an ObjectId.
        - Serialization: Converts the ObjectId to a string.
        """
        # Validator function
        def validate(value: Any) -> ObjectId:
            if isinstance(value, ObjectId):
                return value
            if ObjectId.is_valid(str(value)):
                return ObjectId(value)
            raise ValueError("Invalid ObjectId")

        # Define the schema for Python instances
        python_schema = core_schema.chain_schema([
            core_schema.no_info_plain_validator_function(validate),
            core_schema.is_instance_schema(ObjectId)
        ])

        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=python_schema,
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )
# ====================================================================

# --- Auth Models ---
class SignupModel(BaseModel):
    firstName: str = Field(min_length=2)
    lastName: str = Field(min_length=2)
    email: EmailStr
    phoneNumber: str
    username: str = Field(min_length=5, max_length=15, pattern="^[a-zA-Z0-9]+$")
    password: str

class LoginModel(BaseModel):
    username: str
    password: str

class UserInDBModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    firstName: str
    lastName: str
    email: EmailStr
    username: str
    phoneNumber: str
    createdAt: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- Test Case Model ---
class TestCaseModel(BaseModel):
    input: str
    output: str
    hidden: bool = False

# --- Question Models ---
class QuestionModel(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    question_type: str
    text: str
    options: Optional[List[str]] = []
    correct_answer: Optional[str] = None
    test_cases: Optional[List[TestCaseModel]] = []
    difficulty: Optional[str] = None
    starter_code: Optional[str] = ""

class CodingQuestionModel(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    question_type: str = "coding"
    text: str
    difficulty: str
    starter_code: str = ""
    test_cases: List[TestCaseModel] = []

class MCQQuestionModel(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    question_type: str = "mcq"
    text: str
    difficulty: str
    options: List[str]
    correct_answer: str

# --- Content Models (Exams, Practice, Tests) ---
class ContentModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    questions: List[QuestionModel]

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ExamModel(ContentModel):
    duration_minutes: int

class PracticeModel(ContentModel):
    difficulty: str

class TestModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    duration_minutes: int
    language: str
    difficulty: str
    tags: List[str]
    questions: List[QuestionModel]
    pass_criteria: Optional[int] = 80  # Make optional with default

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- Session & Proctoring Models ---
class ProctoringFlagModel(BaseModel):
    session_id: str
    flag_type: str
    details: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ExamSessionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId 
    exam_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    flags: List[dict] = []
    answers: dict = {}

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SubmissionModel(BaseModel):
    session_id: str
    answers: dict

# --- Test Attempt & Certification Models ---
class TestAttemptModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    test_id: str
    test_name: str
    score: float
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    answers: dict = {}

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CertificationModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    test_id: str
    test_name: str
    score: float
    awarded_at: datetime = Field(default_factory=datetime.utcnow)
    attempt_id: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- Code Execution Models ---
class CodeExecutionRequest(BaseModel):
    source_code: str  # base64 encoded string
    language_id: int
    test_cases: List[dict]

class CodeExecutionResponse(BaseModel):
    results: List[dict]

# --- API Response Models ---
class SuccessResponse(BaseModel):
    success: bool
    message: str

class TestSubmissionResponse(BaseModel):
    success: bool
    score: float
    passed: bool
    certification_awarded: bool

class CertificationResponse(BaseModel):
    id: str
    test_id: str
    test_name: str
    score: float
    awarded_at: datetime

class AttemptResponse(BaseModel):
    id: str
    test_id: str
    test_name: str
    score: float
    submitted_at: datetime
    test_title: Optional[str] = None
    total_questions: Optional[int] = None

# --- Utility Models ---
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class ErrorResponse(BaseModel):
    detail: str

# --- Interview Models ---

class InterviewQuestionModel(BaseModel):
    id: str
    text: str
    expected_answer: str
    time_limit: int

class InterviewModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    duration_minutes: int
    difficulty: str
    tags: List[str]
    questions: List[InterviewQuestionModel]

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class InterviewSessionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId 
    interview_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    current_question_index: int = 0
    answers: Dict[str, str] = {}
    evaluations: Dict[str, Dict] = {}
    proctoring_flags: List[dict] = []

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class InterviewResultModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    interview_id: str
    interview_title: str
    session_id: str
    final_score: float
    evaluations: Dict[str, Dict]
    answers: Dict[str, str]
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    type: str = "interview"

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}