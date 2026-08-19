import Link from "next/link";
import { getMovies } from "@/lib/api";

export default async function Home() {
  let movies = [];
  try {
    movies = await getMovies();
  } catch {
    // Graceful fallback — hero still renders
  }

  // Pick up to 4 featured movies for the showcase
  const featured = movies.slice(0, 4);

  return (
    <main className="landing">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero__content">
          <p className="landing-hero__overline">Your cinema, simplified</p>
          <h1 className="landing-hero__title">
            Book Movie Tickets<br />
            <span className="landing-hero__title--accent">In Seconds</span>
          </h1>
          <p className="landing-hero__subtitle">
            Browse showtimes, pick your seats, and get your digital ticket — 
            all in one seamless flow.
          </p>
          <div className="landing-hero__actions">
            <Link href="/movies" className="cta-book">
              Browse Movies
            </Link>
            <Link href="/bookings" className="landing-hero__secondary-link">
              My Bookings →
            </Link>
          </div>
        </div>

        {/* Decorative floating ticket card */}
        <div className="landing-hero__visual" aria-hidden="true">
          <div className="landing-hero__ticket">
            <div className="landing-hero__ticket-top">
              <div className="landing-hero__ticket-circle" />
              <div className="landing-hero__ticket-lines">
                <div className="landing-hero__ticket-line landing-hero__ticket-line--wide" />
                <div className="landing-hero__ticket-line landing-hero__ticket-line--narrow" />
              </div>
            </div>
            <div className="landing-hero__ticket-divider" />
            <div className="landing-hero__ticket-bottom">
              <div className="landing-hero__ticket-grid">
                <div className="landing-hero__ticket-block" />
                <div className="landing-hero__ticket-block" />
                <div className="landing-hero__ticket-block" />
              </div>
              <div className="landing-hero__ticket-qr" />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="landing-steps">
        <h2 className="landing-steps__title">How it works</h2>
        <div className="landing-steps__grid">
          <div className="landing-step">
            <span className="landing-step__number">01</span>
            <h3 className="landing-step__heading">Choose a Movie</h3>
            <p className="landing-step__desc">
              Browse what's showing and pick the film that speaks to you.
            </p>
          </div>
          <div className="landing-step">
            <span className="landing-step__number">02</span>
            <h3 className="landing-step__heading">Select Your Seats</h3>
            <p className="landing-step__desc">
              Interactive seat map lets you grab the perfect spot.
            </p>
          </div>
          <div className="landing-step">
            <span className="landing-step__number">03</span>
            <h3 className="landing-step__heading">Get Your Ticket</h3>
            <p className="landing-step__desc">
              Instant digital ticket with QR code — no printing needed.
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured Movies ──────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="landing-featured">
          <div className="landing-featured__header">
            <h2 className="landing-featured__title">Now Showing</h2>
            <Link href="/movies" className="landing-featured__link">
              View all →
            </Link>
          </div>
          <div className="landing-featured__grid">
            {featured.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="landing-featured__card"
              >
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="landing-featured__poster"
                  />
                ) : (
                  <div className="landing-featured__poster-fallback">🎬</div>
                )}
                <div className="landing-featured__info">
                  <h3 className="landing-featured__movie-title">{movie.title}</h3>
                  <p className="landing-featured__movie-meta">
                    {movie.genre} · {movie.duration_minutes} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <p className="landing-footer__text">
          Built with care. Enjoy the show.
        </p>
      </footer>
    </main>
  );
}
