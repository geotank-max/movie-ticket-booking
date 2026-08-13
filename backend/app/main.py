from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine

app = FastAPI(title="Movie Ticket Booking API")


@app.get("/")
def read_root():
    return {"message": "Movie Ticket Booking API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"database": "connected"}