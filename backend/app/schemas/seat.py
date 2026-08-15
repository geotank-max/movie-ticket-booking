from pydantic import BaseModel, ConfigDict


class SeatOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    cinema_id: int
    row_label: str
    seat_number: int


class SeatBulkCreate(BaseModel):
    cinema_id: int
    rows: list[str]
    seats_per_row: int


class SeatAvailability(BaseModel):
    id: int
    row_label: str
    seat_number: int
    is_booked: bool