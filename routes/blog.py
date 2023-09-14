from fastapi import APIRouter, HTTPException
from config.database import blog_collection,user_collection
from models.model import CreateBlogRequest, UpdateBlogRequest, UpdateCommentRequest
import logging
from schema.schemas import list_serial,individual_serial
from bson import ObjectId

blog = APIRouter(prefix='/blog')


# Common error handling method
def handle_error(e: Exception):
    logging.info(str(e))
    return {"error": str(e)}


# Create new post
@blog.post('/create', status_code=201)
async def create_blog(request_data: CreateBlogRequest):
    try:
        print(request_data)
        user_id = request_data.userId

        user = user_collection.find_one({'_id': ObjectId(user_id)})
        user = individual_serial(user)
        if not user:
            raise HTTPException(status_code=400, detail="User not found.")

        new_blog_data = {
            'userId': user_id,
            'userName': user['name'],
            'title': request_data.title,
            'image': {"url": request_data.image.url, "fileId": request_data.image.fileId},
            'description': request_data.description,
            'comments': []
        }

        blog_collection.insert_one(new_blog_data)

        return {"msg": "Blog saved successfully"}
    except Exception as e:
        handle_error(e)


# Get user post
@blog.get('/user/{user_id}')
async def get_user_post(user_id: str):
    try:

        user_blog = list_serial(blog_collection.find({"userId": user_id}))
        return user_blog
    except Exception as e:
        return handle_error(e)


# Get all post
@blog.get('/')
async def get_all_blog():
    try:
        all_blog = list_serial(blog_collection.find())
        return all_blog
    except Exception as e:
        return handle_error(e)


# Delete user post
@blog.delete('/delete/{blog_id}')
async def delete_user_post(blog_id: str):
    try:

        user_blog = blog_collection.delete_one({"_id": ObjectId(blog_id)})
        return { "message": "Deleted successfully" }
    except Exception as e:
        return handle_error(e)


# Update Blog
@blog.put('/update/{user_id}')
async def update_blog(request_data: UpdateBlogRequest):
    try:
        _id = request_data._id

        # Check if the blog exists
        existing_blog = await blog_collection.find_one({'_id': _id})
        if not existing_blog:
            raise HTTPException(status_code=404, detail="Blog not found")

        # Update the blog with the provided data
        update_data = {
            'image': request_data.image,
            'title': request_data.title,
            'description': request_data.description,
        }

        await blog_collection.update_one({'_id': _id}, {'$set': update_data})

        return {"msg": "Blog updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Get Comment
@blog.get('/comments/{blog_id}')
async def get_blog_comments(blog_id: str):
    try:
        blog = blog_collection.find_one({"_id": ObjectId(blog_id)})
        blog = individual_serial(blog)
        return blog['comments']
    except Exception as e:
        return handle_error(e)


# Update Comment
@blog.patch('/comment/{blog_id}')
async def add_comment(blog_id: str,request_data:UpdateCommentRequest):
    try:

        # Add the new comment to the blog
        new_comment = {
            "userName": request_data.name,
            "comment": request_data.comment,
        }

        await blog_collection.update_one({'_id': ObjectId(blog_id)}, {'$push': {'comments': new_comment}}, upsert=True)

        return {"comment":"updated successfully"}
    except Exception as e:
        return handle_error(e)