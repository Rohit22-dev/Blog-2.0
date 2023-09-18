from config.database import user_collection
from decouple import config
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from logger import logger
from datetime import datetime,timedelta

JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def individual_serial(todo) -> dict:
    todo['_id'] = str(todo["_id"])
    return todo


def list_serial(todos) -> list:
    return [individual_serial(todo) for todo in todos]


# JWT token functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def check_user(data):
    # print("Check",data.email)
    try:
        print(data.email)
        existing_user = user_collection.find_one({"email": data.email})
        existing_user['_id'] = str(existing_user['_id'])
        if not existing_user:
            raise Exception("User not found")
        if not verify_password(data.password, existing_user['password']):
            raise Exception("Invalid password")
        return existing_user
    except Exception as e:
        logger.warning(str(e))
