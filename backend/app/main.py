from fastapi import FastAPI
from app.db.database import engine, Base
from app.db import models
from app.routes import auth, users, transfer, transactions, audit_logs
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="LenDenClub Assignment",
    debug=True
)


app = FastAPI(
    title="LenDenClub Assignment",
    debug=True
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transfer.router)
app.include_router(transactions.router)
app.include_router(audit_logs.router)



@app.get("/")
def root():
    return {"status": "Backend running"}
