"use client";

import { useState, useEffect } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { getMovies, createMovie, deleteMovie } from "@/lib/api";

export default function AdminMoviesPage() {
  const status = useAdminGuard();
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: "",
    genre: "",
    poster_url: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "allowed") {
      getMovies().then(setMovies);
    }
  }, [status]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const newMovie = await createMovie({
        ...form,
        duration_minutes: Number(form.duration_minutes),
        description: form.description || null,
        genre: form.genre || null,
        poster_url: form.poster_url || null,
      });
      setMovies((current) => [...current, newMovie]);
      setForm({ title: "", description: "", duration_minutes: "", genre: "", poster_url: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(movieId) {
    if (!confirm("Delete this movie?")) return;
    try {
      await deleteMovie(movieId);
      setMovies((current) => current.filter((m) => m.id !== movieId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (status === "checking") return <main><p>Checking permissions...</p></main>;
  if (status === "denied") return <main><p>You don't have access to this page.</p></main>;

  return (
    <main className="admin-page">
      <h1>Manage Movies</h1>

      <form onSubmit={handleCreate} className="admin-form">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Duration (minutes)"
          type="number"
          value={form.duration_minutes}
          onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
          required
        />
        <input
          placeholder="Genre"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
        />
        <input
          placeholder="Poster URL"
          value={form.poster_url}
          onChange={(e) => setForm({ ...form, poster_url: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {error && <p className="booking-error">{error}</p>}
        <button type="submit">Add Movie</button>
      </form>

      <div className="admin-movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="admin-movie-row">
            <span>{movie.title}</span>
            <button onClick={() => handleDelete(movie.id)} className="delete-button">
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}