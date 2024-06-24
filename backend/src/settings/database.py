import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv

# Load environment variables
load_dotenv()


DATABASE_URL = os.getenv("POSTGRES_DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()



# database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

