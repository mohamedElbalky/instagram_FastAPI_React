from typing import List
import string
import random
import shutil

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm.session import Session

from settings.database import get_db
from authentication.oauth2 import get_current_user, oauth2_scheme
from authentication.schemes import UserAuth

from .crud import create_post, get_all_posts
from .schemas import PostDsiplay, PostCreate


router = APIRouter(prefix="/post", tags=["posts"])


IMAGE_URL_TYPES: list[str] = ["absolute", "relative"]


@router.post("", response_model=PostDsiplay, status_code=status.HTTP_201_CREATED)
def create_new_post(
    request: PostCreate,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user),
):

    if request.image_url_type not in IMAGE_URL_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Parameter image_url_type can onlt take values 'absolute' or 'relative'. ",
        )

    return create_post(db=db, request=request)


@router.get("", response_model=List[PostDsiplay])
def read_all_posts(
    skip: int = 0,
    limit: int = 3,
    db: Session = Depends(get_db),
):
    return get_all_posts(db=db, skip=skip, limit=limit)


@router.post("/image")
def upload_image(
    image: UploadFile = File(...), current_user: UserAuth = Depends(get_current_user)
):
    """upload new image anf save"""
    letters = string.ascii_letters
    rand_str = "".join(random.choice(letters) for _ in range(6))
    new = f"_{rand_str}."

    filename = new.join(image.filename.rsplit(".", 1))

    path = f"images/{filename}"

    with open(path, "w+b") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {"filename": path}
