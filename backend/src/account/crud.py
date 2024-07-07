from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from .schemas import UserCreate
from .models import DbUser
from .hashing import Hash


def create_user(db: Session, request: UserCreate):
    """create a new user in database"""

    user = db.query(DbUser).filter(DbUser.username == request.username).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    
    user = db.query(DbUser).filter(DbUser.email == request.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )
    
    new_user = DbUser(
        username=request.username,
        email=request.email,
        password=Hash.bcrypt(request.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def delete_user(db: Session, user_id: str):
    """delete user by id"""
    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )
    
    db.delete(user)
    db.commit()

def get_all_users(db: Session, skip: int = 0, limit: int = 3):
    """return all user by skip and limit"""
    return db.query(DbUser).offset(skip).limit(limit).all()


def get_user_by_username(db: Session, username:str):
    """return user by username"""
    user = db.query(DbUser).filter(DbUser.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username {username} not found",
        )
        
    return user