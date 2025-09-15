# python -m backend.seed_data_exams

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

# --- NEW QUESTION SET WITH CORRECT ANSWERS ---
dummy_exams = [
    {
        "_id": ObjectId("689a1140c768c6bb7e731927"),
        "title": "Python Fundamentals Quiz",
        "description": "Test your knowledge of Python basics with this comprehensive quiz",
        "duration_minutes": 15,
        "difficulty": "Easy",
        "tags": ["python", "programming", "basics"],
        "questions": [
            {
                "id": "py_q1",
                "question_type": "mcq",
                "text": "What is the correct way to create a function in Python?",
                "options": ["function myFunction()", "def myFunction():", "create myFunction():"],
                "correct_answer": "def myFunction():"
            },
            {
                "id": "py_q2",
                "question_type": "mcq",
                "text": "Which method can be used to return a string in upper case letters?",
                "options": ["upper()", "toUpperCase()", "uppercase()"],
                "correct_answer": "upper()"
            },
            {
                "id": "py_q3",
                "question_type": "coding",
                "text": "Write a Python function `multiply(a, b)` that returns the product of two numbers.",
                "test_cases": [
                    {"input": "2, 3", "output": "6", "hidden": False},
                    {"input": "5, 5", "output": "25", "hidden": False},
                    {"input": "-10, 10", "output": "-100", "hidden": True},
                    {"input": "0, 100", "output": "0", "hidden": True}
                ]
            }
        ]
    },
    {
        "_id": ObjectId("689a1140c768c6bb7e731928"),
        "title": "Web Development Basics",
        "description": "Assess your understanding of HTML, CSS and JavaScript fundamentals",
        "duration_minutes": 10,
        "difficulty": "Easy",
        "tags": ["html", "css", "javascript", "web"],
        "questions": [
            {
                "id": "web_q1",
                "question_type": "mcq",
                "text": "What does HTML stand for?",
                "options": ["Hypertext Markup Language", "Hyper-Tool Markup Language", "Home Tool Markup Language"],
                "correct_answer": "Hypertext Markup Language"
            },
            {
                "id": "web_q2",
                "question_type": "mcq",
                "text": "Which CSS property is used to change the text color of an element?",
                "options": ["fgcolor", "color", "text-color"],
                "correct_answer": "color"
            },
            {
                "id": "web_q3",
                "question_type": "coding",
                "text": "Write a JavaScript function `greet(name)` that returns the string 'Hello, ' followed by the name.",
                "test_cases": [
                    {"input": "'World'", "output": "'Hello, World'", "hidden": False},
                    {"input": "'Alice'", "output": "'Hello, Alice'", "hidden": False},
                    {"input": "''", "output": "'Hello, '", "hidden": True}
                ]
            }
        ]
    },
    {
        "_id": ObjectId("689a1140c768c6bb7e731929"),
        "title": "Data Structures & Algorithms",
        "description": "Challenge yourself with advanced data structure and algorithm questions",
        "duration_minutes": 45,
        "difficulty": "Hard",
        "tags": ["algorithms", "data-structures", "complexity"],
        "questions": [
            {
                "id": "dsa_q1",
                "question_type": "mcq",
                "text": "What is the time complexity of binary search?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correct_answer": "O(log n)"
            },
            {
                "id": "dsa_q2",
                "question_type": "mcq",
                "text": "Which data structure uses LIFO (Last-In-First-Out) principle?",
                "options": ["Queue", "Stack", "Linked List", "Tree"],
                "correct_answer": "Stack"
            },
            {
                "id": "dsa_q3",
                "question_type": "coding",
                "text": "Implement a function `reverse_string(s)` that returns the reverse of a given string.",
                "test_cases": [
                    {"input": "'hello'", "output": "'olleh'", "hidden": False},
                    {"input": "'racecar'", "output": "'racecar'", "hidden": False},
                    {"input": "'a'", "output": "'a'", "hidden": True},
                    {"input": "''", "output": "''", "hidden": True}
                ]
            }
        ]
    },
    {
        "_id": ObjectId("689a1140c768c6bb7e731930"),
        "title": "Database Concepts",
        "description": "Test your knowledge of SQL and database management systems",
        "duration_minutes": 30,
        "difficulty": "Medium",
        "tags": ["sql", "database", "queries"],
        "questions": [
            {
                "id": "db_q1",
                "question_type": "mcq",
                "text": "Which SQL clause is used to filter records?",
                "options": ["FILTER", "WHERE", "HAVING", "CONDITION"],
                "correct_answer": "WHERE"
            },
            {
                "id": "db_q2",
                "question_type": "mcq",
                "text": "Which join returns all records when there is a match in either left or right table?",
                "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
                "correct_answer": "FULL OUTER JOIN"
            },
            {
                "id": "db_q3",
                "question_type": "coding",
                "text": "Write a SQL query to find all users with age greater than 25 from the 'users' table.",
                "test_cases": [
                    {"input": "", "output": "SELECT * FROM users WHERE age > 25;", "hidden": False}
                ]
            }
        ]
    },
    {
        "_id": ObjectId("689a1140c768c6bb7e731931"),
        "title": "JavaScript Advanced Concepts",
        "description": "Advanced JavaScript concepts including closures, promises, and async/await",
        "duration_minutes": 25,
        "difficulty": "Medium",
        "tags": ["javascript", "advanced", "async"],
        "questions": [
            {
                "id": "js_q1",
                "question_type": "mcq",
                "text": "What is a closure in JavaScript?",
                "options": [
                    "A function that has access to its outer function's scope",
                    "A way to close a browser window",
                    "A method to terminate a program",
                    "A type of loop"
                ],
                "correct_answer": "A function that has access to its outer function's scope"
            },
            {
                "id": "js_q2",
                "question_type": "mcq",
                "text": "Which method returns a new promise that resolves when all promises in the iterable argument have resolved?",
                "options": ["Promise.all()", "Promise.race()", "Promise.resolve()", "Promise.final()"],
                "correct_answer": "Promise.all()"
            },
            {
                "id": "js_q3",
                "question_type": "coding",
                "text": "Write a function `async fetchData(url)` that uses async/await to fetch data from a URL and returns the JSON response.",
                "test_cases": [
                    {"input": "'https://api.example.com/data'", "output": "{}", "hidden": False}
                ]
            }
        ]
    }
]

async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["evalytics-ai"]
    exams_collection = db["exams"]
    
    print("Deleting old exams...")
    await exams_collection.delete_many({})
    
    print("Seeding new exams with correct answers...")
    await exams_collection.insert_many(dummy_exams)
    print("Seeding complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())