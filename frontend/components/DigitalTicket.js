export default function DigitalTicket({ booking }) {
  const { showtime } = booking;
  const movie = showtime.movie;
  const cinema = showtime.cinema;

  const seatCount = booking.seat_ids.length;
  const total = (seatCount * Number(showtime.price)).toFixed(2);
  const reference = `MTB-${booking.id}`;

  const date = new Date(showtime.start_time);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const genres = movie.genre
    ? movie.genre.split(/[,\/]/).map((g) => g.trim()).filter(Boolean)
    : [];
  const hours = Math.floor(movie.duration_minutes / 60);
  const mins = movie.duration_minutes % 60;
  const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const metaStr = genres.length > 0 ? `${genres[0]} · ${durationStr}` : durationStr;

  // Generate a simple deterministic QR-like pattern from booking id
  const qrPattern = generateQRPattern(booking.id);

  return (
    <article className="ticket-card" aria-label={`Ticket for ${movie.title}`}>
      {/* Header: Poster + Movie Info */}
      <div className="ticket-card__header">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="ticket-card__poster"
          />
        ) : (
          <div className="ticket-card__poster-fallback" aria-hidden="true">🎬</div>
        )}
        <div className="ticket-card__movie-info">
          <h2 className="ticket-card__movie-title">{movie.title}</h2>
          <p className="ticket-card__movie-meta">{metaStr}</p>
        </div>
      </div>

      {/* Divider with notch */}
      <div className="ticket-card__divider" aria-hidden="true" />

      {/* Details Grid */}
      <div className="ticket-card__details">
        <div className="ticket-detail">
          <p className="ticket-detail__label">Date</p>
          <p className="ticket-detail__value">{formattedDate}</p>
        </div>
        <div className="ticket-detail">
          <p className="ticket-detail__label">Time</p>
          <p className="ticket-detail__value">{formattedTime}</p>
        </div>
        <div className="ticket-detail">
          <p className="ticket-detail__label">Screen</p>
          <p className="ticket-detail__value">{cinema.name}</p>
        </div>
        <div className="ticket-detail">
          <p className="ticket-detail__label">Seats</p>
          <p className="ticket-detail__value">
            {seatCount} seat{seatCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="ticket-detail" />
        <div className="ticket-detail">
          <p className="ticket-detail__label">Total</p>
          <p className="ticket-detail__value ticket-detail__value--accent">
            ${total}
          </p>
        </div>
      </div>

      {/* Divider with notch */}
      <div className="ticket-card__divider" aria-hidden="true" />

      {/* QR Code Section */}
      <div className="ticket-card__qr-section">
        <div className="ticket-card__qr" aria-label="QR code">
          <div className="ticket-card__qr-pattern">
            {qrPattern.map((filled, i) => (
              <div
                key={i}
                className={`ticket-card__qr-cell ${!filled ? "ticket-card__qr-cell--empty" : ""}`}
              />
            ))}
          </div>
        </div>
        <span className="ticket-card__qr-ref">{reference}</span>
      </div>
    </article>
  );
}

/**
 * Generate a deterministic pseudo-random QR-like grid pattern
 * based on a numeric seed (booking id).
 */
function generateQRPattern(seed) {
  const cells = 49; // 7x7 grid
  const pattern = [];
  let s = seed * 2654435761; // hash spread
  for (let i = 0; i < cells; i++) {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    // corners always filled (QR finder pattern illusion)
    const row = Math.floor(i / 7);
    const col = i % 7;
    const isCorner =
      (row < 3 && col < 3) ||
      (row < 3 && col > 3) ||
      (row > 3 && col < 3);
    pattern.push(isCorner ? true : s % 3 !== 0);
  }
  return pattern;
}
