from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.database import Base


class BookingSeat(Base):
    __tablename__ = "booking_seats"
    __table_args__ = (
        UniqueConstraint("booking_id", "seat_id", name="uq_booking_seat"),
        UniqueConstraint("showtime_id", "seat_id", name="uq_showtime_seat"),
    )

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    seat_id = Column(Integer, ForeignKey("seats.id"), nullable=False)
    showtime_id = Column(Integer, ForeignKey("showtimes.id"), nullable=False)

    booking = relationship("Booking", back_populates="booking_seats")
    seat = relationship("Seat", back_populates="booking_seats")
