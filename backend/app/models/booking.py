from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.db.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    showtime_id = Column(Integer, ForeignKey("showtimes.id"), nullable=False)
    status = Column(String, default="confirmed", nullable=False)
    booking_time = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")
    showtime = relationship("Showtime", back_populates="bookings")
    booking_seats = relationship("BookingSeat", back_populates="booking")

    