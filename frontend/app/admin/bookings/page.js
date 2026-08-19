"use client";

import { useState, useEffect } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { getAllBookings } from "@/lib/api";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminBookingsPage() {
  const status = useAdminGuard();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "allowed") {
      getAllBookings().then(setBookings);
    }
  }, [status]);

  if (status === "checking") {
    return (
      <main className="page-container">
        <p className="page-loading">Checking permissions...</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="page-container">
        <div className="empty-state">
          <div className="empty-state__icon">🚫</div>
          <h2 className="empty-state__title">Access Denied</h2>
          <p className="empty-state__desc">You don't have permission to view this page.</p>
        </div>
      </main>
    );
  }

  const filtered = search
    ? bookings.filter(
        (b) =>
          b.showtime.movie.title.toLowerCase().includes(search.toLowerCase()) ||
          String(b.id).includes(search)
      )
    : bookings;

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Bookings</h1>
          <p className="page-subtitle">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="page-header__search">
          <input
            className="auth-card__input"
            placeholder="Search by movie or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "240px" }}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-table">
        <div className="admin-table__header">
          <span className="admin-table__col admin-table__col--xs">#</span>
          <span className="admin-table__col admin-table__col--grow">Movie</span>
          <span className="admin-table__col admin-table__col--md">Cinema</span>
          <span className="admin-table__col admin-table__col--sm">Date</span>
          <span className="admin-table__col admin-table__col--sm">Time</span>
          <span className="admin-table__col admin-table__col--xs">Seats</span>
          <span className="admin-table__col admin-table__col--sm">Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-table__empty">
            {search ? "No bookings match your search." : "No bookings yet."}
          </div>
        ) : (
          filtered.map((booking) => (
            <div key={booking.id} className="admin-table__row">
              <span className="admin-table__col admin-table__col--xs admin-table__col--mono">
                {booking.id}
              </span>
              <span className="admin-table__col admin-table__col--grow admin-table__col--bold">
                {booking.showtime.movie.title}
              </span>
              <span className="admin-table__col admin-table__col--md admin-table__col--muted">
                {booking.showtime.cinema.name}
              </span>
              <span className="admin-table__col admin-table__col--sm admin-table__col--muted">
                {formatDate(booking.showtime.start_time)}
              </span>
              <span className="admin-table__col admin-table__col--sm admin-table__col--muted">
                {formatTime(booking.showtime.start_time)}
              </span>
              <span className="admin-table__col admin-table__col--xs">
                {booking.seat_ids.length}
              </span>
              <span className="admin-table__col admin-table__col--sm">
                <span className={`status-pill status-pill--${booking.status}`}>
                  {booking.status}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
