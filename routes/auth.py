from fastapi import APIRouter, Body, HTTPException
from logger import logger
from models.model import UserSchema, UserLoginSchema
from config.database import user_collection
from schema.schemas import get_password_hash, check_user, list_serial,create_access_token
from datetime import timedelta

auth = APIRouter(prefix='/user')
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Common error handling method
def handle_error(e: Exception):
    logger.error(str(e))
    return {"error": str(e)}


# Register user
@auth.post('/signup', response_model=UserSchema)
async def user_signup(user: UserSchema = Body(default=None)):
    try:
        user.password = get_password_hash(user.password)
        insert_result = user_collection.insert_one(dict(user))

        new_user_id = insert_result.inserted_id
        new_user = user_collection.find_one({"_id": new_user_id})

        if new_user:
            return new_user
        else:
            raise FileNotFoundError("User not found")
            # raise HTTPException(status_code=404, detail="User not found")
    except FileNotFoundError as e:
        return handle_error(e)


# Login user
# @auth.post('/login')
# async def user_login(user: UserLoginSchema = Body(default=None)):
#     try:
#         print(user)
#         existing_user = check_user(user)
#         return existing_user
#     except Exception as e:
#         return handle_error(e)
# Login user and get access token
@auth.post('/login', response_model=dict)
async def user_login(user: UserLoginSchema = Body(default=None)):
    try:
        existing_user = check_user(user)
        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data=existing_user, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        return handle_error(e)


# Get all users
@auth.get('/')
async def get_all_user():
    try:
        all_user = list_serial(user_collection.find())
        return all_user
    except Exception as e:
        return handle_error(e)
