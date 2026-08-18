import { getToken } from "@/lib/auth";


function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
    headers: {"Content-Type": "application/json", ...authHeaders(), },
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

export async function registerUser(email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");
  return data;
}

export async function loginUser(email, password) {
  const formBody = new URLSearchParams();
  formBody.append("username", email);
  formBody.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getMyBookings() {
  const res = await fetch(`${API_URL}/bookings/`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return res.json();
}