from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.seat import Seat
from app.models.cinema import Cinema
from app.schemas.seat import SeatOut, SeatBulkCreate

router = APIRouter(prefix="/seats", tags=["seats"])


@router.get("/", response_model=list[SeatOut])
def list_seats(cinema_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Seat)
    if cinema_id is not None:
        query = query.filter(Seat.cinema_id == cinema_id)
    return query.order_by(Seat.row_label, Seat.seat_number).all()


@router.post("/bulk", response_model=list[SeatOut], status_code=201)
def bulk_create_seats(data: SeatBulkCreate, db: Session = Depends(get_db)):
    cinema = db.query(Cinema).filter(Cinema.id == data.cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")

    existing_count = (
        db.query(Seat).filter(Seat.cinema_id == data.cinema_id).count()
    )
    if existing_count > 0:
        raise HTTPException(
            status_code=400,
            detail="This cinema already has seats. Delete them first if you want to regenerate.",
        )

    new_seats = []
    for row_label in data.rows:
        for seat_number in range(1, data.seats_per_row + 1):
            new_seats.append(
                Seat(
                    cinema_id=data.cinema_id,
                    row_label=row_label,
                    seat_number=seat_number,
                )
            )

    db.add_all(new_seats)
    db.commit()

    for seat in new_seats:
        db.refresh(seat)

    return new_seats