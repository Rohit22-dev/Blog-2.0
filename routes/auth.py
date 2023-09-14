from fastapi import APIRouter, Body, HTTPException
import logging
from models.model import UserSchema, UserLoginSchema
from config.database import user_collection
from schema.schemas import hash_password, check_user,list_serial


auth = APIRouter(prefix='/user')


# Common error handling method
def handle_error(e: Exception):
    logging.info(str(e))
    return {"error": str(e)}


# Register user
@auth.post('/signup', response_model=UserSchema)
async def user_signup(user: UserSchema = Body(default=None)):
    try:
        user.password = hash_password(user.password)
        insert_result = user_collection.insert_one(dict(user))

        new_user_id = insert_result.inserted_id
        new_user = user_collection.find_one({"_id": new_user_id})

        if new_user:
            return new_user
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        return handle_error(e)


# Login user
@auth.post('/login')
async def user_login(user: UserLoginSchema = Body(default=None)):
    try:
        print(user)
        existing_user = check_user(user)
        return existing_user
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
