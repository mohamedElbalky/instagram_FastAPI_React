from datetime import datetime
from pydantic import BaseModel


class PostBase(BaseModel):
    image_url: str
    image_url_type: str
    caption: str
    
    
class PostCreate(PostBase):
    creator_id: int

class PostUser(BaseModel):
    """For PostDsiplay"""
    username: str
    class Config:
        from_attributes = True

class PostDsiplay(PostBase):
    id: int
    timestamp: datetime
    user: PostUser
    class Congig:
        from_attributes = True