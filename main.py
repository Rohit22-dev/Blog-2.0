from fastapi import FastAPI
from routes.blog import blog
from routes.auth import auth
import logging
import uvicorn
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


app.include_router(blog)
app.include_router(auth)

# if __name__ == "__main__":
#     uvicorn.run("main:app", port=8000 , log_level='info' )
