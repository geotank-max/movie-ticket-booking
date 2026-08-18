from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db

from app.models.showtime import Showtime
from app.models.seat import Seat
from app.models.booking_seat import BookingSeat
from app.models.booking import Booking
from app.models.user import User

from app.schemas.showtime import ShowtimeCreate, ShowtimeOut
from app.schemas.seat import SeatAvailability

from app.core.dependencies import require_admin

router = APIRouter(prefix="/showtimes", tags=["showtimes"])

@router.get("/", response_model=list[ShowtimeOut])
def list_showtimes(
    movie_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Showtime).options(
        joinedload(Showtime.movie), joinedload(Showtime.cinema)
    )

    if movie_id is not None:
        query = query.filter(Showtime.movie_id == movie_id)

    return query.order_by(Showtime.start_time).all()


@router.get("/{showtime_id}", response_model=ShowtimeOut)
def get_showtime(showtime_id: int, db: Session = Depends(get_db)):
    showtime = (
        db.query(Showtime)
        .options(joinedload(Showtime.movie), joinedload(Showtime.cinema))
        .filter(Showtime.id == showtime_id)
        .first()
    )
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    return showtime


@router.post("/", response_model=ShowtimeOut, status_code=201)
def create_showtime(
    showtime_data: ShowtimeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),    
):
    showtime = Showtime(**showtime_data.model_dump())
    db.add(showtime)
    db.commit()
    db.refresh(showtime)
    return showtime

@router.get("/{showtime_id}/seats", response_model=list[SeatAvailability])
def get_showtime_seats(showtime_id: int, db: Session = Depends(get_db)):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")

    all_seats = (
        db.query(Seat)
        .filter(Seat.cinema_id == showtime.cinema_id)
        .order_by(Seat.row_label, Seat.seat_number)
        .all()
    )

    booked_seat_ids = {
        row.seat_id
        for row in (
            db.query(BookingSeat.seat_id)
            .join(Booking, Booking.id == BookingSeat.booking_id)
            .filter(Booking.showtime_id == showtime_id)
            .filter(Booking.status != "cancelled")
            .all()
        )
    }

    return [
        SeatAvailability(
            id=seat.id,
            row_label=seat.row_label,
            seat_number=seat.seat_number,
            is_booked=seat.id in booked_seat_ids,
        )
        for seat in all_seats
    ]