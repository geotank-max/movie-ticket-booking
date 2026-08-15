from pydantic import BaseModel, ConfigDict


class CinemaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    location: str | None = None