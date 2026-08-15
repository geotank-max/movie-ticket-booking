from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError

from app.db.database import get_db
from app.models.booking import Booking
from app.models.booking_seat import BookingSeat
from app.models.showtime import Showtime
from app.models.seat import Seat
from app.schemas.booking import BookingCreate, BookingOut

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=BookingOut, status_code=201)
def create_booking(booking_data: BookingCreate, db: Session = Depends(get_db)):
    if not booking_data.seat_ids:
        raise HTTPException(status_code=400, detail="At least one seat must be selected")

    showtime = db.query(Showtime).filter(Showtime.id == booking_data.showtime_id).first()
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")

    valid_seats = (
        db.query(Seat)
        .filter(Seat.id.in_(booking_data.seat_ids))
        .filter(Seat.cinema_id == showtime.cinema_id)
        .all()
    )
    if len(valid_seats) != len(set(booking_data.seat_ids)):
        raise HTTPException(
            status_code=400,
            detail="One or more selected seats do not belong to this showtime's cinema",
        )

    already_booked = (
        db.query(BookingSeat.seat_id)
        .join(Booking, Booking.id == BookingSeat.booking_id)
        .filter(Booking.showtime_id == booking_data.showtime_id)
        .filter(Booking.status != "cancelled")
        .filter(BookingSeat.seat_id.in_(booking_data.seat_ids))
        .all()
    )
    if already_booked:
        taken_ids = [row.seat_id for row in already_booked]
        raise HTTPException(
            status_code=409,
            detail=f"Seat(s) {taken_ids} were just booked by someone else. Please choose different seats.",
        )

    booking = Booking(
        user_id=1,  # temporary — real user comes from auth in Step 17
        showtime_id=booking_data.showtime_id,
        status="confirmed",
    )
    db.add(booking)
    db.flush()  # assigns booking.id without fully committing yet

    for seat_id in booking_data.seat_ids:
        db.add(BookingSeat(
            booking_id=booking.id,
            seat_id=seat_id,
            showtime_id=booking_data.showtime_id,
        )
    )

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="One or more seats were booked by someone else just now. Please try again.",
        )

    db.refresh(booking)
    booking = (
        db.query(Booking)
        .options(
            joinedload(Booking.booking_seats),
            joinedload(Booking.showtime).joinedload(Showtime.movie),
            joinedload(Booking.showtime).joinedload(Showtime.cinema),
        )
        .filter(Booking.id == booking.id)
        .first()
    )

    return BookingOut.from_booking(booking)