
from datetime import datetime
from pydantic import BaseModel


class PostBase(BaseModel):
    image_url: str
    image_url_type: str
    caption: str
    
    
class PostCreate(PostBase):
    pass

class PostUser(BaseModel):
    """For PostDsiplay"""
    id : int
    username: str
    class Config:
        from_attributes = True
        
class CommentUser(BaseModel):
    """For PostComment"""
    id: int
    username: str
    class Config:
        from_attributes = True
        
class PostComment(BaseModel):
    """For PostDsiplay"""
    text: str
    user: CommentUser
    timestamp: datetime
    class Config:
        from_attributes = True

class PostDsiplay(PostBase):
    id: int
    timestamp: datetime
    user: PostUser
    comments: list[PostComment]
    class Config:
        from_attributes = True



# ----------- start comment ----------------
class CommentBase(BaseModel):
    text: str
    
class CommentCreate(CommentBase):
    post_id: int
    
class CommentDisplay(CommentBase):
    id: int
    timestamp: datetime
    user_id: int
    
    class Config:
        from_attributes = True