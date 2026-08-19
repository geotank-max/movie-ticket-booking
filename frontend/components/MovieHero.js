export default function MovieHero({ movie }) {
  const genres = movie.genre
    ? movie.genre.split(/[,\/]/).map((g) => g.trim()).filter(Boolean)
    : [];

  const hours = Math.floor(movie.duration_minutes / 60);
  const mins = movie.duration_minutes % 60;
  const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <section className="movie-hero">
      {movie.poster_url ? (
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="movie-hero__poster"
        />
      ) : (
        <div className="movie-hero__poster-fallback" aria-hidden="true">
          🎬
        </div>
      )}

      <div className="movie-hero__content">
        <h1 className="movie-hero__title">{movie.title}</h1>

        <div className="movie-hero__meta">
          <span className="movie-hero__rating">★ 8.5</span>
          <span className="movie-hero__separator">·</span>
          <span className="movie-hero__duration">{durationStr}</span>
        </div>

        {genres.length > 0 && (
          <ul className="genre-tags" aria-label="Genres">
            {genres.map((genre) => (
              <li key={genre} className="genre-tag">
                {genre}
              </li>
            ))}
          </ul>
        )}

        {movie.description && (
          <p className="movie-hero__synopsis">{movie.description}</p>
        )}
      </div>
    </section>
  );
}
