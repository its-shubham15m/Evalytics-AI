from fastapi import APIRouter, HTTPException, Response, Depends
from backend import models, utils, database

router = APIRouter(prefix="/api", tags=["Authentication"])

@router.post("/signup")
async def signup(user: models.SignupModel):
    users_collection = database.db["users"]

    if not utils.validate_phone(user.phoneNumber):
        raise HTTPException(status_code=400, detail="Invalid phone number format.")
    if not utils.validate_password(user.password):
        raise HTTPException(status_code=400, detail="Password does not meet complexity requirements.")

    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken.")
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_pw = utils.hash_password(user.password)
    user_doc = user.dict()
    user_doc["password"] = hashed_pw
    await users_collection.insert_one(user_doc)
    return {"success": True, "message": "Registration successful! Please login."}

@router.post("/login")
async def login(login_data: models.LoginModel, response: Response):
    users_collection = database.db["users"]
    user = await users_collection.find_one({"username": login_data.username})
    if not user or not utils.verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = utils.create_access_token({"sub": str(user["_id"])})
    response.set_cookie(key="token", value=token, httponly=True, samesite="Lax", secure=False)
    return {
        "success": True, "message": "Login successful!",
        "user": { "username": user["username"], "firstName": user["firstName"]}
    }

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"success": True, "message": "Logged out"}

@router.get("/user/profile", response_model=models.UserInDBModel)
async def get_profile(current_user: dict = Depends(utils.get_current_user)):
    # The dependency already fetches the user, we just return it
    # We might want a different Pydantic model that doesn't expose the password hash
    return current_user