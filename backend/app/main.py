from fastapi import FastAPI
from app.db.database import engine, Base
from app.db import models

app = FastAPI(title="LenDenClub Assignment")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "Backend running"}
