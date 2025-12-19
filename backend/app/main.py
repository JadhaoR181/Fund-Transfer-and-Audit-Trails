from fastapi import FastAPI
from app.db.database import engine, Base
from app.db import models
from app.routes import auth, users, transfer, transactions

app = FastAPI(
    title="LenDenClub Assignment",
    debug=True
)


Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transfer.router)
app.include_router(transactions.router)


@app.get("/")
def root():
    return {"status": "Backend running"}
