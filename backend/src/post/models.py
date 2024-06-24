from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from settings.database import Base

from datetime import datetime

class DbPost(Base):
    __tablename__ = "post"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    image_url_type = Column(String)
    caption = Column(String)
    timestamp = Column(DateTime)
    
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('DbUser', back_populates='posts')
    
    comments = relationship('DbComment', back_populates="post")
    
    
class DbComment(Base):
    __tablename__ = "comment"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    timestamp = Column(DateTime, default=datetime.now(), index=True)
    
    post_id = Column(Integer, ForeignKey("post.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    
    post = relationship("DbPost", back_populates="comments")
    user = relationship("DbUser", back_populates="comments")