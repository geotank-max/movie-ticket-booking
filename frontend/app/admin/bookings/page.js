"use client";

import { useState, useEffect } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { getAllBookings } from "@/lib/api";

function formatShowtime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export default function AdminBookingsPage() {
  const status = useAdminGuard();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (status === "allowed") {
      getAllBookings().then(setBookings);
    }
  }, [status]);

  if (status === "checking") return <main><p>Checking permissions...</p></main>;
  if (status === "denied") return <main><p>You don't have access to this page.</p></main>;

  return (
    <main className="admin-page">
      <h1>All Bookings ({bookings.length})</h1>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h3>{booking.showtime.movie.title}</h3>
            <p>{booking.showtime.cinema.name} · {formatShowtime(booking.showtime.start_time)}</p>
            <p>{booking.seat_ids.length} seat(s) — Booking #{booking.id} — Status: {booking.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}