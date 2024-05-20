from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import Response

from sqlalchemy.orm import Session
from settings.database import get_db

from .schemas import UserCreate, UserDisplay
from .crud import create_user


router = APIRouter(prefix="/users", tags=["users"])


@router.get("")
def read_accounts(db: Session = Depends(get_db)):
    return {"message": "posts"}


@router.post("", response_model=UserDisplay, status_code=status.HTTP_201_CREATED)
def create_new_user(request: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db=db, request=request)

    if user:
        return user
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Data")
