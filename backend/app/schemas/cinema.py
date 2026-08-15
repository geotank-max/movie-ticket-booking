from pydantic import BaseModel, ConfigDict


class CinemaBase(BaseModel):
    name: str
    location: str | None = None


class CinemaCreate(CinemaBase):
    pass


class CinemaUpdate(BaseModel):
    name: str | None = None
    location: str | None = None


class CinemaOut(CinemaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int