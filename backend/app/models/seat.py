from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    cinema_id = Column(Integer, ForeignKey("cinemas.id"), nullable=False)
    row_label = Column(String, nullable=False)   # e.g. "A"
    seat_number = Column(Integer, nullable=False)  # e.g. 1  -> "A1"

    cinema = relationship("Cinema", back_populates="seats")
    booking_seats = relationship("BookingSeat", back_populates="seat")