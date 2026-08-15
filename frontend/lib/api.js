const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMovies() {
  const res = await fetch(`${API_URL}/movies/`);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export async function getMovie(id) {
  const res = await fetch(`${API_URL}/movies/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}