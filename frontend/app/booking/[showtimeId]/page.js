import { getShowtime, getShowtimeSeats } from "@/lib/api";
import { notFound } from "next/navigation";
import SeatSelector from "@/components/SeatSelector";
import Link from "next/link";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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

export default async function SeatSelectionPage({ params }) {
  const { showtimeId } = await params;

  let showtime, seats;
  try {
    [showtime, seats] = await Promise.all([
      getShowtime(showtimeId),
      getShowtimeSeats(showtimeId),
    ]);
  } catch {
    notFound();
  }

  const availableCount = seats.filter((s) => !s.is_booked).length;

  return (
    <div className="seat-page">

      {/* Top nav bar */}
      <div className="seat-page-topbar">
        <Link href={`/booking?movie_id=${showtime.movie.id}`} className="back-link">
          ← Showtimes
        </Link>
        <div className="topbar-breadcrumb">
          <Link href="/movies" className="breadcrumb-link">Movies</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href={`/movies/${showtime.movie.id}`} className="breadcrumb-link">{showtime.movie.title}</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Select Seats</span>
        </div>
      </div>

      <div className="seat-page-body">

        {/* Left: seat map */}
        <div className="seat-page-main">
          <SeatSelector
            seats={seats}
            showtimeId={showtime.id}
            price={showtime.price}
          />
        </div>

        {/* Right: info panel */}
        <aside className="seat-page-sidebar">
          {showtime.movie.poster_url && (
            <img
              src={showtime.movie.poster_url}
              alt={showtime.movie.title}
              className="sidebar-poster"
            />
          )}

          <div className="sidebar-info">
            <h1 className="sidebar-title">{showtime.movie.title}</h1>

            <div className="sidebar-tags">
              <span className="tag">{showtime.movie.genre}</span>
              <span className="tag">{showtime.movie.duration_minutes} min</span>
            </div>

            <div className="sidebar-details">
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <div>
                  <p className="detail-label">Venue</p>
                  <p className="detail-value">{showtime.cinema.name}</p>
                  {showtime.cinema.location && (
                    <p className="detail-sub">{showtime.cinema.location}</p>
                  )}
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">📅</span>
                <div>
                  <p className="detail-label">Date</p>
                  <p className="detail-value">{formatDate(showtime.start_time)}</p>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">🕐</span>
                <div>
                  <p className="detail-label">Time</p>
                  <p className="detail-value">{formatTime(showtime.start_time)}</p>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">🎟️</span>
                <div>
                  <p className="detail-label">Price per seat</p>
                  <p className="detail-value">${showtime.price}</p>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon">💺</span>
                <div>
                  <p className="detail-label">Availability</p>
                  <p className="detail-value">{availableCount} of {seats.length} seats available</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
