import logging

from pymongo import MongoClient
from decouple import config


try:
    client = MongoClient(config("mongoUrl"))

    db = client.test

    blog_collection = db["blogs"]
    user_collection = db["users"]
except Exception as e:
    logging.error(str(e))
    raise Exception("Mongo connection error.")