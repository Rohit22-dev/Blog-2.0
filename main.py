from fastapi import FastAPI
from routes.blog import blog
from routes.auth import auth
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# logging structure
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    filename="basic.log"
)

app.include_router(blog)
app.include_router(auth)

@app.get('/')
def hello():
    return {"message": "Hello"}
