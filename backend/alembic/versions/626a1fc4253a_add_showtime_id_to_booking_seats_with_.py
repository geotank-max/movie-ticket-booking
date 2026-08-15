"""Add showtime_id to booking_seats with unique constraint

Revision ID: 626a1fc4253a
Revises: 7cf1ba5d7122
Create Date: 2026-08-15 21:59:21.873899

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '626a1fc4253a'
down_revision: Union[str, Sequence[str], None] = '7cf1ba5d7122'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('booking_seats', sa.Column('showtime_id', sa.Integer(), nullable=False))
    op.create_foreign_key(
        'fk_booking_seats_showtime_id',
        'booking_seats', 'showtimes',
        ['showtime_id'], ['id']
    )
    op.create_unique_constraint(
        'uq_showtime_seat',
        'booking_seats',
        ['showtime_id', 'seat_id']
    )


def downgrade() -> None:
    op.drop_constraint('uq_showtime_seat', 'booking_seats', type_='unique')
    op.drop_constraint('fk_booking_seats_showtime_id', 'booking_seats', type_='foreignkey')
    op.drop_column('booking_seats', 'showtime_id')
