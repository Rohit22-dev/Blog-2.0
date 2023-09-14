from pydantic import BaseModel, Field, EmailStr


class Todo(BaseModel):
    name: str
    description: str
    complete: bool


class ImageSchema(BaseModel):
    url: str | None
    fileId: str | None


class UserSchema(BaseModel):
    name: str
    email: str
    password: str
    image: ImageSchema | None
    about: str | None

    class Config:
        the_schema = {
            "user_demo": {
                "name": "Amelia",
                "email": "amelia@test.com",
                "password": "123456"
            }
        }


class UserLoginSchema(BaseModel):
    email: EmailStr = Field(default=None)
    password: str = Field(default=None)

    class Config:
        the_schema = {
            "user_demo": {
                "email": "amelia@test.com",
                "password": "123456"
            }
        }


class CommentSchema(BaseModel):
    userName: str
    comment: str


class BlogSchema(BaseModel):
    userId: str
    userName: str
    title: str
    image: ImageSchema
    description: str
    comments: list[CommentSchema] = Field(default=[])

class CreateBlogRequest(BaseModel):
    userId: str
    title: str
    image: ImageSchema
    description: str

class UpdateBlogRequest(BaseModel):
    _id: str
    image: ImageSchema
    title: str
    description: str

class UpdateCommentRequest(BaseModel):
    name: str
    comment: str