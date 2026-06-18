from fastapi import FastAPI

from database import Base, engine
import models
from routers import courts, groups

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Picker API")

app.include_router(courts.router)
app.include_router(groups.router)

@app.get("/")
def home():
    return {"message": "Picker api running"}

