from fastapi import FastAPI

from fastapi.staticfiles import StaticFiles

from settings.database import Base, engine
from account import routers as account_routers
from post import routers as post_routers

app = FastAPI()

# routers
app.include_router(account_routers.router)
app.include_router(post_routers.router)


# main path
@app.get('')
def root():
    return {"message": "hello world"}



# database
Base.metadata.create_all(engine)


# mount static files
app.mount("/images", StaticFiles(directory="images"), name="images")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    