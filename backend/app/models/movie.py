from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)
    genre = Column(String, nullable=True)
    poster_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    showtimes = relationship("Showtime", back_populates="movie")