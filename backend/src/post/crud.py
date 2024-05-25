from datetime import datetime

from sqlalchemy.orm.session import Session

from .models import DbPost
from .schemas import PostCreate


def create_post(db: Session, request: PostCreate):
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


def get_all_posts(db: Session, skip: int = 0, limit: int = 3):
    return db.query(DbPost).offset(skip).limit(limit).all()