from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.movie import Movie
from app.schemas.movie import MovieCreate, MovieUpdate, MovieOut

router = APIRouter(prefix="/movies", tags=["movies"])


@router.get("/", response_model=list[MovieOut])
def list_movies(db: Session = Depends(get_db)):
    return db.query(Movie).all()


@router.get("/{movie_id}", response_model=MovieOut)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@router.post("/", response_model=MovieOut, status_code=201)
def create_movie(movie_data: MovieCreate, db: Session = Depends(get_db)):
    movie = Movie(**movie_data.model_dump())
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


@router.put("/{movie_id}", response_model=MovieOut)
def update_movie(movie_id: int, movie_data: MovieUpdate, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    update_data = movie_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(movie, field, value)

    db.commit()
    db.refresh(movie)
    return movie


@router.delete("/{movie_id}", status_code=204)
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    db.delete(movie)
    db.commit()