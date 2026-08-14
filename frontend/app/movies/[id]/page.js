import { getMovie } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MovieDetailsPage({ params }) {
  const { id } = await params;

  let movie;
  try {
    movie = await getMovie(id);
  } catch (error) {
    notFound();
  }

  return (
    <main>
      <Link href="/movies">← Back to movies</Link>

      <div className="movie-details">
        {movie.poster_url && (
          <img src={movie.poster_url} alt={movie.title} className="movie-details-poster" />
        )}

        <div>
          <h1>{movie.title}</h1>
          <p className="movie-meta">
            {movie.genre} · {movie.duration_minutes} min
          </p>
          <p>{movie.description}</p>

          <Link href={`/booking?movie_id=${movie.id}`} className="book-button">
            View Showtimes
          </Link>
        </div>
      </div>
    </main>
  );
}