from fastapi import FastAPI
from app.db.database import engine, Base

app = FastAPI(title="LenDenClub Assignment")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "Backend running"}
