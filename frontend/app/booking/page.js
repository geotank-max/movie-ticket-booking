import { getShowtimesByMovie } from "@/lib/api";
import Link from "next/link";

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

export default async function BookingPage({ searchParams }) {
  const { movie_id } = await searchParams;

  if (!movie_id) {
    return (
      <main>
        <p>No movie selected. Go back to <Link href="/movies">movies</Link>.</p>
      </main>
    );
  }

  const showtimes = await getShowtimesByMovie(movie_id);

  return (
    <main>
      <Link href={`/movies/${movie_id}`}>← Back to movie</Link>

      {showtimes.length === 0 ? (
        <p>No showtimes scheduled for this movie yet.</p>
      ) : (
        <>
          <h1>{showtimes[0].movie.title} — Showtimes</h1>
          <div className="showtimes-list">
            {showtimes.map((showtime) => (
              <Link
                key={showtime.id}
                href={`/booking/${showtime.id}`}
                className="showtime-card"
              >
                <strong>{showtime.cinema.name}</strong>
                <span>{formatShowtime(showtime.start_time)}</span>
                <span>${showtime.price}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}