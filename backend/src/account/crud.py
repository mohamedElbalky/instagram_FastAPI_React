from sqlalchemy.orm import Session
from fastapi import HTTPException

from .schemas import UserCreate, UserDisplay
from .models import DbUser
from .hashing import Hash


def create_user(db: Session, request: UserCreate):
    """create a new user in database"""
    new_user = DbUser(
        username=request.username,
        email=request.email,
        password=Hash.bcrypt(request.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def get_all_users(db: Session, skip: int = 0, limit: int = 3):
    """return all user by skip and limit"""
    return db.query(DbUser).offset(skip).limit(limit).all()
