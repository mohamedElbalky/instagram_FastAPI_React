from typing import List

from fastapi import APIRouter, Depends, status, HTTPException

from sqlalchemy.orm import Session

from settings.database import get_db

from .schemas import UserCreate, UserDisplay
from .crud import create_user, get_all_users


router = APIRouter(prefix="/users", tags=["users"])


# FIXME: Error when using this endpoint
@router.get("", response_model=List[UserDisplay])
def read_all_users(skip: int = 0, limit: int = 3, db: Session = Depends(get_db)):
    return get_all_users(db=db, skip=skip, limit=limit)


@router.post("", response_model=UserDisplay, status_code=status.HTTP_201_CREATED)
def create_new_user(request: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db=db, request=request)

    if user:
        return user
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Data")
