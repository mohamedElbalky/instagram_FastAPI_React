from datetime import datetime

from fastapi import status, HTTPException
from sqlalchemy.orm.session import Session

from .models import DbPost, DbComment
from .schemas import PostCreate, CommentCreate


def create_post(db: Session, request: PostCreate, user_id:int):
    """create new post"""
    new_post = DbPost(
        image_url=request.image_url,
        image_url_type=request.image_url_type,
        caption=request.caption,
        user_id=user_id,
        timestamp=datetime.now(),
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


def all_posts(db: Session):
    return db.query(DbPost).all()

def delete_post(db: Session, id: str, user_id:int):
    post = db.query(DbPost).filter(DbPost.id == id).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with id [{id}] not found",
        )
        
    if post.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Only Post creator can delete the post",
        )
        
    db.delete(post)
    db.commit()

    return True


def create_new_comment(db: Session, request: CommentCreate, user_id:int):
    new_comment = DbComment(
        text = request.text,
        post_id = request.post_id,
        user_id = user_id
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return new_comment

def get_all_comments(db: Session, post_id: int):
    """return all comments for a post"""
    return db.query(DbComment).filter(DbComment.post_id == post_id).all()