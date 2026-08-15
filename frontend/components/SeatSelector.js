"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function SeatSelector({ seats, showtimeId, price }) {
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const router = useRouter();

  const { seatsByRow, maxSeatsPerRow } = useMemo(() => {
    const grouped = {};
    let max = 0;
    for (const seat of seats) {
      if (!grouped[seat.row_label]) grouped[seat.row_label] = [];
      grouped[seat.row_label].push(seat);
      if (grouped[seat.row_label].length > max) max = grouped[seat.row_label].length;
    }
    return { seatsByRow: grouped, maxSeatsPerRow: max };
  }, [seats]);

  function toggleSeat(seat) {
    if (seat.is_booked) return;
    setSelectedSeatIds((current) =>
      current.includes(seat.id)
        ? current.filter((id) => id !== seat.id)
        : [...current, seat.id]
    );
  }

  function getSeatState(seat) {
    if (seat.is_booked) return "booked";
    if (selectedSeatIds.includes(seat.id)) return "selected";
    return "available";
  }

  const total = (selectedSeatIds.length * Number(price)).toFixed(2);
  const availableCount = seats.filter((s) => !s.is_booked).length;
  const bookedCount = seats.filter((s) => s.is_booked).length;

  function handleContinue() {
    router.push(`/booking/${showtimeId}/confirm?seats=${selectedSeatIds.join(",")}`);
  }

  return (
    <div className="seat-selector-wrapper">
      {/* Screen */}
      <div className="screen-container">
        <div className="screen-surface" />
        <p className="screen-label">SCREEN</p>
      </div>

      {/* Seat map */}
      <div className="seat-map-scroll">
        <div className="seat-map">
          {Object.entries(seatsByRow).map(([rowLabel, rowSeats]) => (
            <div key={rowLabel} className="seat-row">
              <span className="row-label">{rowLabel}</span>
              <div className="seat-row-seats">
                {rowSeats.map((seat) => {
                  const state = getSeatState(seat);
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      className={`seat seat-${state}`}
                      disabled={seat.is_booked}
                      onClick={() => toggleSeat(seat)}
                      aria-label={`Seat ${rowLabel}${seat.seat_number}${seat.is_booked ? " (booked)" : ""}`}
                      title={`${rowLabel}${seat.seat_number}`}
                    >
                      <span className="seat-number">{seat.seat_number}</span>
                    </button>
                  );
                })}
              </div>
              <span className="row-label">{rowLabel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-swatch seat-available" />
          <span>Available ({availableCount})</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch seat-selected" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch seat-booked" />
          <span>Booked ({bookedCount})</span>
        </div>
      </div>

      {/* Booking summary footer */}
      <div className="booking-footer">
        <div className="booking-footer-info">
          <div className="booking-footer-stat">
            <span className="stat-value">{selectedSeatIds.length}</span>
            <span className="stat-label">seat{selectedSeatIds.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="booking-footer-divider" />
          <div className="booking-footer-stat">
            <span className="stat-value">${price}</span>
            <span className="stat-label">per seat</span>
          </div>
          <div className="booking-footer-divider" />
          <div className="booking-footer-stat">
            <span className="stat-value total-amount">${total}</span>
            <span className="stat-label">total</span>
          </div>
        </div>
        <button
          type="button"
          className="continue-btn"
          disabled={selectedSeatIds.length === 0}
          onClick={handleContinue}
        >
          {selectedSeatIds.length === 0
            ? "Select seats to continue"
            : `Continue with ${selectedSeatIds.length} seat${selectedSeatIds.length !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}
