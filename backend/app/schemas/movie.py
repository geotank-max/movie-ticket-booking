from __future__ import annotations
from typing import Optional

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MovieBase(BaseModel):
    title: str
    description: str | None = None
    duration_minutes: int
    genre: str | None = None
    poster_url: str | None = None


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    title: str | None = None
    description: Optional[str] = None
    duration_minutes: int | None = None
    genre: str | None = None
    poster_url: str | None = None


class MovieOut(MovieBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime