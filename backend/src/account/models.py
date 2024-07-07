from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..settings.database import Base

class DbUser(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)
    
    posts = relationship('DbPost', back_populates='user')
    
    comments = relationship("DbComment", back_populates="user")
