from typing import List

from fastapi import APIRouter, Depends, status, HTTPException

from sqlalchemy.orm import Session

from ..settings.database import get_db
from .schemas import UserCreate, UserDisplay
from .crud import create_user, get_all_users, delete_user


router = APIRouter(prefix="/users", tags=["users"])



@router.get("", response_model=List[UserDisplay])
def read_all_users(skip: int = 0, limit: int = 3, db: Session = Depends(get_db)):
    return get_all_users(db=db, skip=skip, limit=limit)




@router.delete("{user_id}/")
def remove_user(user_id:str, db: Session = Depends(get_db)):
    delete_user(db=db, user_id=user_id)
    return {"message": "User deleted successfully"}
