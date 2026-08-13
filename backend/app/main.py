from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.database import get_db

app = FastAPI(title="Movie Ticket Booking API")


@app.get("/")
def read_root():
    return {"message": "Movie Ticket Booking API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"database": "connected"}