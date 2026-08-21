from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import logging

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.routers import movie, showtime, cinema, seat, booking, auth
from app.db.database import get_db

from app.core.config import ALLOWED_ORIGINS, IS_PRODUCTION

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="Movie Ticket Booking API",
              docs_url=None if IS_PRODUCTION else "/docs",
              redoc_url=None if IS_PRODUCTION else "/redoc",
              )

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception occurred")

    if IS_PRODUCTION:
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal error occurred. Please try again later."},
        )
    # In development, let FastAPI's default (more detailed) error handling happen
    raise exc

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movie.router)
app.include_router(showtime.router)
app.include_router(cinema.router)
app.include_router(seat.router)
app.include_router(booking.router)

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