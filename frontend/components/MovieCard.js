import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} />
        ) : (
          <div className="poster-placeholder">No Image</div>
        )}
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.genre} · {movie.duration_minutes} min
        </p>
      </div>
    </Link>
  );
}