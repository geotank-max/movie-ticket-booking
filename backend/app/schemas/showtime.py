from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

from app.schemas.movie import MovieOut
from app.schemas.cinema import CinemaOut


class ShowtimeBase(BaseModel):
    movie_id: int
    cinema_id: int
    start_time: datetime
    price: Decimal


class ShowtimeCreate(ShowtimeBase):
    pass


class ShowtimeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    start_time: datetime
    price: Decimal
    movie: MovieOut
    cinema: CinemaOut