"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyBookings } from "@/lib/api";
import { getToken } from "@/lib/auth";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");
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

  if (status === "loading") {
    return (
      <main className="page-container">
        <p className="page-loading">Loading your bookings...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="page-container">
        <p className="page-loading">Could not load your bookings.</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🎟</div>
          <h2 className="empty-state__title">No bookings yet</h2>
          <p className="empty-state__desc">
            When you book a movie, your tickets will appear here.
          </p>
          <Link href="/movies" className="cta-book" style={{ minWidth: "auto" }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="booking-card-modern"
            >
              <div className="booking-card-modern__top">
                <div className="booking-card-modern__movie">
                  {booking.showtime.movie.poster_url ? (
                    <img
                      src={booking.showtime.movie.poster_url}
                      alt=""
                      className="booking-card-modern__poster"
                    />
                  ) : (
                    <div className="booking-card-modern__poster-fallback">🎬</div>
                  )}
                  <div className="booking-card-modern__info">
                    <h3 className="booking-card-modern__title">
                      {booking.showtime.movie.title}
                    </h3>
                    <p className="booking-card-modern__cinema">
                      {booking.showtime.cinema.name}
                    </p>
                  </div>
                </div>
                <span className={`status-pill status-pill--${booking.status}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-card-modern__divider" />

              <div className="booking-card-modern__details">
                <div className="booking-card-modern__detail">
                  <span className="booking-card-modern__label">Date</span>
                  <span className="booking-card-modern__value">
                    {formatDate(booking.showtime.start_time)}
                  </span>
                </div>
                <div className="booking-card-modern__detail">
                  <span className="booking-card-modern__label">Time</span>
                  <span className="booking-card-modern__value">
                    {formatTime(booking.showtime.start_time)}
                  </span>
                </div>
                <div className="booking-card-modern__detail">
                  <span className="booking-card-modern__label">Seats</span>
                  <span className="booking-card-modern__value">
                    {booking.seat_ids.length}
                  </span>
                </div>
                <div className="booking-card-modern__detail">
                  <span className="booking-card-modern__label">Ref</span>
                  <span className="booking-card-modern__value booking-card-modern__value--mono">
                    MTB-{booking.id}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
