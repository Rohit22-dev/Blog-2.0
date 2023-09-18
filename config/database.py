from logger import logger
from pymongo import MongoClient
from decouple import config


try:
    logger.info('Initialising mongo database connection')
    client = MongoClient(config("mongoUrl"))

    db = client.test

    blog_collection = db["blogs"]
    user_collection = db["users"]
except Exception as e:
    logger.error(str(e))
