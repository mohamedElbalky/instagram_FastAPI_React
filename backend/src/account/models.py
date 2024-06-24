from sqlalchemy import Column, Integer, String
from settings.database import Base
from sqlalchemy.orm import relationship

class DbUser(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)
    
    posts = relationship('DbPost', back_populates='user')
    
    comments = relationship("DbComment", back_populates="user")
