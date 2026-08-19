import { getMovies } from "@/lib/api";
import MovieCard from "@/components/MovieCard";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <main>
      <h1>Now Showing</h1>

      {movies.length === 0 ? (
        <p>No movies available right now.</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}