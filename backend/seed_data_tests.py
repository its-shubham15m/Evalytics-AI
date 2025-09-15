# backend/seed_data_tests.py
# python -m backend.seed_data_tests

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

# Coding tests with different programming languages
dummy_tests = [
    {
        "_id": ObjectId("689a1140c768c6bb7e731930"),
        "title": "Python Programming Assessment",
        "description": "Test your Python programming skills with algorithm problems",
        "duration_minutes": 60,
        "language": "python",
        "difficulty": "Intermediate",
        "tags": ["python", "algorithms", "data-structures"],
        "questions": [
            {
                "id": "py_easy_1",
                "question_type": "coding",
                "difficulty": "Easy",
                "text": "Write a function called 'reverse_string' that takes a string as input and returns the reversed string.",
                "starter_code": "def reverse_string(s):\n    # Your code here\n    pass",
                "test_cases": [
                    {"input": "'hello'", "output": "'olleh'", "hidden": False},
                    {"input": "'python'", "output": "'nohtyp'", "hidden": False},
                    {"input": "'a'", "output": "'a'", "hidden": True},
                    {"input": "''", "output": "''", "hidden": True}
                ]
            },
            {
                "id": "py_easy_2",
                "question_type": "coding",
                "difficulty": "Easy",
                "text": "Write a function called 'is_even' that takes an integer and returns True if it's even, False otherwise.",
                "starter_code": "def is_even(n):\n    # Your code here\n    pass",
                "test_cases": [
                    {"input": "4", "output": "True", "hidden": False},
                    {"input": "7", "output": "False", "hidden": False},
                    {"input": "0", "output": "True", "hidden": True},
                    {"input": "-2", "output": "True", "hidden": True}
                ]
            },
            {
                "id": "py_medium_1",
                "question_type": "coding",
                "difficulty": "Medium",
                "text": "Write a function called 'longest_substring' that finds the length of the longest substring without repeating characters.",
                "starter_code": "def longest_substring(s):\n    # Your code here\n    pass",
                "test_cases": [
                    {"input": "'abcabcbb'", "output": "3", "hidden": False},
                    {"input": "'bbbbb'", "output": "1", "hidden": False},
                    {"input": "'pwwkew'", "output": "3", "hidden": True},
                    {"input": "'dvdf'", "output": "3", "hidden": True}
                ]
            },
            {
                "id": "py_medium_2",
                "question_type": "coding",
                "difficulty": "Medium",
                "text": "Write a function called 'valid_parentheses' that checks if a string of parentheses is valid.",
                "starter_code": "def valid_parentheses(s):\n    # Your code here\n    pass",
                "test_cases": [
                    {"input": "'()'", "output": "True", "hidden": False},
                    {"input": "'()[]{}'", "output": "True", "hidden": False},
                    {"input": "'(]'", "output": "False", "hidden": True},
                    {"input": "'([)]'", "output": "False", "hidden": True}
                ]
            },
            {
                "id": "py_hard_1",
                "question_type": "coding",
                "difficulty": "Hard",
                "text": "Write a function called 'solve_n_queens' that returns the number of solutions for the N-Queens problem.",
                "starter_code": "def solve_n_queens(n):\n    # Your code here\n    pass",
                "test_cases": [
                    {"input": "4", "output": "2", "hidden": False},
                    {"input": "1", "output": "1", "hidden": False},
                    {"input": "8", "output": "92", "hidden": True},
                    {"input": "6", "output": "4", "hidden": True}
                ]
            }
        ]
    },
    {
        "_id": ObjectId("689a1140c768c6bb7e731931"),
        "title": "Java Programming Challenge",
        "description": "Test your Java programming skills with algorithm problems",
        "duration_minutes": 75,
        "language": "java",
        "difficulty": "Intermediate",
        "tags": ["java", "algorithms", "oop"],
        "questions": [
            {
                "id": "java_easy_1",
                "question_type": "coding",
                "difficulty": "Easy",
                "text": "Write a method called 'reverseString' that takes a String and returns the reversed String.",
                "starter_code": "public String reverseString(String s) {\n    // Your code here\n    return s;\n}",
                "test_cases": [
                    {"input": "\"hello\"", "output": "\"olleh\"", "hidden": False},
                    {"input": "\"java\"", "output": "\"avaj\"", "hidden": False}
                ]
            },
            {
                "id": "java_easy_2",
                "question_type": "coding",
                "difficulty": "Easy",
                "text": "Write a method called 'isPrime' that checks if a number is prime.",
                "starter_code": "public boolean isPrime(int n) {\n    // Your code here\n    return false;\n}",
                "test_cases": [
                    {"input": "7", "output": "true", "hidden": False},
                    {"input": "10", "output": "false", "hidden": False}
                ]
            }
        ]
    },
    {
        "_id": ObjectId("689a1140c768c6bb7e731932"),
        "title": "MySQL Database Test",
        "description": "Test your SQL query writing skills",
        "duration_minutes": 45,
        "language": "sql",
        "difficulty": "Beginner",
        "tags": ["mysql", "database", "queries"],
        "questions": [
            {
                "id": "sql_easy_1",
                "question_type": "coding",
                "difficulty": "Easy",
                "text": "Write a SQL query to select all users from the 'users' table where age is greater than 18.",
                "starter_code": "SELECT * FROM users WHERE age > 18;",
                "test_cases": []
            },
            {
                "id": "sql_medium_1",
                "question_type": "coding",
                "difficulty": "Medium",
                "text": "Write a SQL query to find the second highest salary from the 'employees' table.",
                "starter_code": "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
                "test_cases": []
            }
        ]
    }
]

async def seed_tests():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["evalytics-ai"]
    tests_collection = db["tests"]
    attempts_collection = db["attempts"]
    certifications_collection = db["certifications"]
    
    print("Deleting old test data...")
    await tests_collection.delete_many({})
    await attempts_collection.delete_many({})
    await certifications_collection.delete_many({})
    
    print("Seeding new tests...")
    await tests_collection.insert_many(dummy_tests)
    print("Test seeding complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_tests())