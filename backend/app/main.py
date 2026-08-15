from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.routers import movie, showtime, cinema, seat

from app.db.database import get_db

app = FastAPI(title="Movie Ticket Booking API")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(seat.router)
app.include_router(cinema.router)
app.include_router(movie.router)
app.include_router(showtime.router)

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