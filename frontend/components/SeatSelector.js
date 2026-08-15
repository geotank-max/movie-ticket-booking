"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function SeatSelector({ seats, showtimeId, price }) {
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const router = useRouter();

  const seatsByRow = useMemo(() => {
    const grouped = {};
    for (const seat of seats) {
      if (!grouped[seat.row_label]) grouped[seat.row_label] = [];
      grouped[seat.row_label].push(seat);
    }
    return grouped;
  }, [seats]);

  function toggleSeat(seat) {
    if (seat.is_booked) return;

    setSelectedSeatIds((current) =>
      current.includes(seat.id)
        ? current.filter((id) => id !== seat.id)
        : [...current, seat.id]
    );
  }

  function seatClassName(seat) {
    if (seat.is_booked) return "seat seat-booked";
    if (selectedSeatIds.includes(seat.id)) return "seat seat-selected";
    return "seat seat-available";
  }

  const total = (selectedSeatIds.length * Number(price)).toFixed(2);

  function handleContinue() {
    const seatParams = selectedSeatIds.join(",");
    router.push(`/booking/${showtimeId}/confirm?seats=${seatParams}`);
  }

  return (
    <div className="seat-selector">
      <div className="screen-indicator">SCREEN</div>

      <div className="seat-map">
        {Object.entries(seatsByRow).map(([rowLabel, rowSeats]) => (
          <div key={rowLabel} className="seat-row">
            <span className="row-label">{rowLabel}</span>
            {rowSeats.map((seat) => (
              <button
                key={seat.id}
                type="button"
                className={seatClassName(seat)}
                disabled={seat.is_booked}
                onClick={() => toggleSeat(seat)}
                aria-label={`Seat ${rowLabel}${seat.seat_number}${seat.is_booked ? " (booked)" : ""}`}
              >
                {seat.seat_number}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <span><i className="seat seat-available" /> Available</span>
        <span><i className="seat seat-selected" /> Selected</span>
        <span><i className="seat seat-booked" /> Booked</span>
      </div>

      <div className="booking-summary">
        <p>{selectedSeatIds.length} seat(s) selected</p>
        <p className="total-price">Total: ${total}</p>
        <button
          type="button"
          className="book-button"
          disabled={selectedSeatIds.length === 0}
          onClick={handleContinue}
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
}