from datetime import datetime

from fastapi import status, HTTPException
from sqlalchemy.orm.session import Session

from .models import DbPost
from .schemas import PostCreate


def create(db: Session, request: PostCreate):
    """create new post"""
    new_post = DbPost(
        image_url=request.image_url,
        image_url_type=request.image_url_type,
        caption=request.caption,
        user_id=request.creator_id,
        timestamp=datetime.now(),
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


def all(db: Session, skip: int = 0, limit: int = 3):
    return db.query(DbPost).offset(skip).limit(limit).all()

def delete(db: Session, id: str, user_id:int):
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