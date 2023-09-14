import logging
import bcrypt
from config.database import user_collection


def individual_serial(todo) -> dict:
    todo['_id'] = str(todo["_id"])
    return todo


def list_serial(todos) -> list:
    return [individual_serial(todo) for todo in todos]


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def check_user(data):
    # print("Check",data.email)
    try:
        print(data.email)
        existing_user = user_collection.find_one({"email": data.email})
        existing_user['_id'] = str(existing_user['_id'])
        if not existing_user:
            raise Exception("User not found")
        if not check_password(data.password, existing_user['password']):
            raise Exception("Invalid password")
        return existing_user
    except Exception as e:
        logging.warning(str(e))

