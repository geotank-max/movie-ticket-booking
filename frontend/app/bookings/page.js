"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyBookings } from "@/lib/api";
import { getToken } from "@/lib/auth";

function formatShowtime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login?redirect=/bookings");
      return;
    }

    getMyBookings()
      .then((data) => {
        setBookings(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <main><p>Loading your bookings...</p></main>;
  if (status === "error") return <main><p>Could not load your bookings.</p></main>;

  return (
    <main className="bookings-page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>
          You haven't booked anything yet.{" "}
          <Link href="/movies">Browse movies</Link>
        </p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.showtime.movie.title}</h3>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <p>{booking.showtime.cinema.name}</p>
              <p>{formatShowtime(booking.showtime.start_time)}</p>
              <p>{booking.seat_ids.length} seat(s) — Booking #{booking.id}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}