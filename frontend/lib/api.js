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

export async function getShowtimesByMovie(movieId){
  const res = await fetch (`${API_URL}/showtimes/?movie_id=${movieId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch showtimes");
  }

  return res.json();
}

export async function getShowtimeSeats(showtimeId) {
  const res = await fetch(`${API_URL}/showtimes/${showtimeId}/seats`);

  if (!res.ok) {
    throw new Error("Failed to fetch seats");
  }

  return res.json();
}

export async function getShowtime(showtimeId) {
  const res = await fetch(`${API_URL}/showtimes/${showtimeId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch showtime");
  }

  return res.json();
}

export async function createBooking(showtimeId, seatIds){
  const res = await fetch(`${API_URL}/bookings/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ showtime_id: Number(showtimeId), seat_ids: seatIds}),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.detail || "Failed to create booking");
    error.status = res.status;
    throw error;
  }

  return data;
}

