# backend/seed_data_interviews.py
# python -m backend.seed_data_interviews

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

dummy_interviews = [
    {
        "_id": ObjectId("789a1140c768c6bb7e731940"),
        "title": "Python Developer Interview",
        "description": "Comprehensive Python programming interview covering core concepts and problem-solving",
        "duration_minutes": 45,
        "difficulty": "Intermediate",
        "tags": ["python", "programming", "algorithms", "data-structures"],
        "questions": [
            {
                "id": "py_int_1",
                "text": "Explain the difference between lists and tuples in Python. When would you use each?",
                "expected_answer": "Lists are mutable while tuples are immutable. Use lists for collections that need to change, tuples for fixed data that shouldn't be modified.",
                "time_limit": 120
            },
            {
                "id": "py_int_2",
                "text": "What are decorators in Python and how do they work? Provide a simple example.",
                "expected_answer": "Decorators are functions that modify other functions. They use @ syntax and wrap the original function.",
                "time_limit": 180
            },
            {
                "id": "py_int_3",
                "text": "How does Python handle memory management? Explain garbage collection.",
                "expected_answer": "Python uses reference counting and generational garbage collection. Objects are automatically deleted when no longer referenced.",
                "time_limit": 150
            },
            {
                "id": "py_int_4",
                "text": "Explain the Global Interpreter Lock (GIL) and its implications for multithreading.",
                "expected_answer": "GIL allows only one thread to execute Python bytecode at a time. It simplifies memory management but limits CPU-bound multithreading.",
                "time_limit": 120
            }
        ]
    },
    {
        "_id": ObjectId("789a1140c768c6bb7e731941"),
        "title": "Java Technical Interview",
        "description": "Java programming interview covering OOP concepts, collections, and JVM",
        "duration_minutes": 50,
        "difficulty": "Intermediate",
        "tags": ["java", "oop", "jvm", "collections"],
        "questions": [
            {
                "id": "java_int_1",
                "text": "Explain the four main principles of Object-Oriented Programming.",
                "expected_answer": "Encapsulation, Abstraction, Inheritance, and Polymorphism. Each serves to organize code and promote reusability.",
                "time_limit": 120
            },
            {
                "id": "java_int_2",
                "text": "What is the difference between ArrayList and LinkedList? When would you use each?",
                "expected_answer": "ArrayList uses dynamic array, fast random access. LinkedList uses doubly-linked list, fast insertions/deletions. Use ArrayList for read-heavy, LinkedList for modification-heavy.",
                "time_limit": 150
            },
            {
                "id": "java_int_3",
                "text": "Explain the Java Memory Model and garbage collection process.",
                "expected_answer": "JVM divides memory into heap, stack, method area. Garbage collection automatically reclaims memory from unused objects.",
                "time_limit": 180
            }
        ]
    },
    {
        "_id": ObjectId("789a1140c768c6bb7e731942"),
        "title": "SQL Database Interview",
        "description": "Database concepts and SQL query writing interview",
        "duration_minutes": 35,
        "difficulty": "Beginner",
        "tags": ["sql", "database", "queries", "normalization"],
        "questions": [
            {
                "id": "sql_int_1",
                "text": "Explain the differences between INNER JOIN, LEFT JOIN, and RIGHT JOIN.",
                "expected_answer": "INNER JOIN returns matching rows, LEFT JOIN returns all left table rows, RIGHT JOIN returns all right table rows.",
                "time_limit": 120
            },
            {
                "id": "sql_int_2",
                "text": "What is database normalization and why is it important?",
                "expected_answer": "Normalization organizes data to reduce redundancy and improve integrity. It follows normal forms (1NF, 2NF, 3NF, etc.).",
                "time_limit": 150
            },
            {
                "id": "sql_int_3",
                "text": "Write a SQL query to find the second highest salary from an employees table.",
                "expected_answer": "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
                "time_limit": 180
            }
        ]
    },
    {
        "_id": ObjectId("789a1140c768c6bb7e731943"),
        "title": "AI/ML Concepts Interview",
        "description": "Interview covering artificial intelligence and machine learning fundamentals",
        "duration_minutes": 60,
        "difficulty": "Advanced",
        "tags": ["ai", "machine-learning", "neural-networks", "data-science"],
        "questions": [
            {
                "id": "ai_int_1",
                "text": "Explain the bias-variance tradeoff in machine learning.",
                "expected_answer": "Bias is error from assumptions, variance is sensitivity to training data. High bias underfits, high variance overfits.",
                "time_limit": 180
            },
            {
                "id": "ai_int_2",
                "text": "What are the main types of machine learning? Explain each with examples.",
                "expected_answer": "Supervised (labeled data), Unsupervised (unlabeled data), Reinforcement (reward-based learning).",
                "time_limit": 240
            },
            {
                "id": "ai_int_3",
                "text": "How does a neural network learn? Explain backpropagation.",
                "expected_answer": "Neural networks learn by adjusting weights through backpropagation, which calculates gradients of the loss function.",
                "time_limit": 200
            }
        ]
    },
    {
        "_id": ObjectId("789a1140c768c6bb7e731944"),
        "title": "Software Engineering Principles",
        "description": "Interview covering software development methodologies and best practices",
        "duration_minutes": 40,
        "difficulty": "Intermediate",
        "tags": ["software-engineering", "design-patterns", "agile", "testing"],
        "questions": [
            {
                "id": "se_int_1",
                "text": "Explain the SOLID principles of object-oriented design.",
                "expected_answer": "Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.",
                "time_limit": 180
            },
            {
                "id": "se_int_2",
                "text": "What is the difference between Agile and Waterfall methodologies?",
                "expected_answer": "Agile is iterative and flexible, Waterfall is sequential and rigid. Agile adapts to change, Waterfall requires fixed requirements.",
                "time_limit": 150
            },
            {
                "id": "se_int_3",
                "text": "Explain Test-Driven Development (TDD) and its benefits.",
                "expected_answer": "TDD involves writing tests before code. Benefits include better design, fewer bugs, and living documentation.",
                "time_limit": 120
            }
        ]
    }
]

async def seed_interviews():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["evalytics-ai"]
    interviews_collection = db["interviews"]
    
    print("Deleting old interview data...")
    await interviews_collection.delete_many({})
    
    print("Seeding new interviews...")
    await interviews_collection.insert_many(dummy_interviews)
    print("Interview seeding complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_interviews())