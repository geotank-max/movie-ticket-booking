import { getShowtime, getShowtimeSeats } from "@/lib/api";
import { notFound } from "next/navigation";
import SeatSelector from "@/components/SeatSelector";
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

export default async function SeatSelectionPage({ params }) {
  const { showtimeId } = await params;

  let showtime, seats;
  try {
    [showtime, seats] = await Promise.all([
      getShowtime(showtimeId),
      getShowtimeSeats(showtimeId),
    ]);
  } catch (error) {
    notFound();
  }

  return (
    <main>
      <Link href={`/booking?movie_id=${showtime.movie.id}`}>← Back to showtimes</Link>

      <h1>{showtime.movie.title}</h1>
      <p className="movie-meta">
        {showtime.cinema.name} · {formatShowtime(showtime.start_time)}
      </p>

      <SeatSelector seats={seats} showtimeId={showtime.id} price={showtime.price} />
    </main>
  );
}