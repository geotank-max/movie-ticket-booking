import { getMovie, getShowtimesByMovie } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import MovieHero from "@/components/MovieHero";
import ShowtimePicker from "@/components/ShowtimePicker";

export default async function MovieDetailsPage({ params }) {
  const { id } = await params;

  let movie, showtimes;
  try {
    [movie, showtimes] = await Promise.all([
      getMovie(id),
      getShowtimesByMovie(id),
    ]);
  } catch {
    notFound();
  }

  return (
    <main>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.75rem 2rem 0" }}>
        <Link href="/movies" className="back-link">← Back to movies</Link>
      </div>

      <MovieHero movie={movie} />
      <ShowtimePicker showtimes={showtimes} />
    </main>
  );
}
