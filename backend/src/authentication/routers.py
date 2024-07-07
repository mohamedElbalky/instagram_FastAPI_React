from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from fastapi.security.oauth2 import OAuth2PasswordRequestForm

from ..settings.database import get_db

from ..account.models import DbUser
from ..account.hashing import Hash

from .oauth2 import create_access_token

from ..account.schemas import UserDisplay, UserCreate
from ..account.crud import create_user

router = APIRouter(tags=["authentication"])


@router.post("/login")
def get_token(
    request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(DbUser).filter(DbUser.username == request.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not Hash.verify(user.password, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": create_access_token(data={"username": user.username}),
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
    }

@router.post("/signup", response_model=UserDisplay, status_code=status.HTTP_201_CREATED)
def create_new_user(request: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db=db, request=request)

    if user:
        return user
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Data")