from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.cinema import Cinema
from app.schemas.cinema import CinemaCreate, CinemaUpdate, CinemaOut

router = APIRouter(prefix="/cinemas", tags=["cinemas"])


@router.get("/", response_model=list[CinemaOut])
def list_cinemas(db: Session = Depends(get_db)):
    return db.query(Cinema).all()


@router.get("/{cinema_id}", response_model=CinemaOut)
def get_cinema(cinema_id: int, db: Session = Depends(get_db)):
    cinema = db.query(Cinema).filter(Cinema.id == cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    return cinema


@router.post("/", response_model=CinemaOut, status_code=201)
def create_cinema(cinema_data: CinemaCreate, db: Session = Depends(get_db)):
    cinema = Cinema(**cinema_data.model_dump())
    db.add(cinema)
    db.commit()
    db.refresh(cinema)
    return cinema


@router.put("/{cinema_id}", response_model=CinemaOut)
def update_cinema(cinema_id: int, cinema_data: CinemaUpdate, db: Session = Depends(get_db)):
    cinema = db.query(Cinema).filter(Cinema.id == cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")

    update_data = cinema_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cinema, field, value)

    db.commit()
    db.refresh(cinema)
    return cinema


@router.delete("/{cinema_id}", status_code=204)
def delete_cinema(cinema_id: int, db: Session = Depends(get_db)):
    cinema = db.query(Cinema).filter(Cinema.id == cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")

    db.delete(cinema)
    db.commit()