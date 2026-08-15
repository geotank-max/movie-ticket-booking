from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.schemas.showtime import ShowtimeOut


class BookingCreate(BaseModel):
    showtime_id: int
    seat_ids: list[int]


class BookingSeatOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    seat_id: int


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    booking_time: datetime
    showtime: ShowtimeOut
    seat_ids: list[int] = []

    @classmethod
    def from_booking(cls, booking):
        return cls(
            id=booking.id,
            status=booking.status,
            booking_time=booking.booking_time,
            showtime=booking.showtime,
            seat_ids=[bs.seat_id for bs in booking.booking_seats],
        )