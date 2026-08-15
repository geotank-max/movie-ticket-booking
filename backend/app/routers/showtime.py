from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.models.showtime import Showtime
from app.schemas.showtime import ShowtimeCreate, ShowtimeOut

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
def create_showtime(showtime_data: ShowtimeCreate, db: Session = Depends(get_db)):
    showtime = Showtime(**showtime_data.model_dump())
    db.add(showtime)
    db.commit()
    db.refresh(showtime)
    return showtime