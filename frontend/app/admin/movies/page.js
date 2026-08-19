"use client";

import { useState, useEffect } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { getMovies, createMovie, deleteMovie } from "@/lib/api";

export default function AdminMoviesPage() {
  const status = useAdminGuard();
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: "",
    genre: "",
    poster_url: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "allowed") {
      getMovies().then(setMovies);
    }
  }, [status]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
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
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(movieId) {
    if (!confirm("Delete this movie? This cannot be undone.")) return;
    try {
      await deleteMovie(movieId);
      setMovies((current) => current.filter((m) => m.id !== movieId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (status === "checking") {
    return (
      <main className="page-container">
        <p className="page-loading">Checking permissions...</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="page-container">
        <div className="empty-state">
          <div className="empty-state__icon">🚫</div>
          <h2 className="empty-state__title">Access Denied</h2>
          <p className="empty-state__desc">You don't have permission to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Movies</h1>
          <p className="page-subtitle">{movies.length} movie{movies.length !== 1 ? "s" : ""} in catalog</p>
        </div>
        <button
          className="page-header__action"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Movie"}
        </button>
      </div>

      {/* Add Movie Form */}
      {showForm && (
        <div className="admin-form-card">
          <h2 className="admin-form-card__title">New Movie</h2>
          <form className="admin-form-modern" onSubmit={handleCreate}>
            <div className="admin-form-modern__row">
              <div className="admin-form-modern__field admin-form-modern__field--grow">
                <label className="admin-form-modern__label">Title *</label>
                <input
                  className="auth-card__input"
                  placeholder="Movie title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="admin-form-modern__field">
                <label className="admin-form-modern__label">Duration (min) *</label>
                <input
                  className="auth-card__input"
                  type="number"
                  placeholder="120"
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="admin-form-modern__row">
              <div className="admin-form-modern__field admin-form-modern__field--grow">
                <label className="admin-form-modern__label">Genre</label>
                <input
                  className="auth-card__input"
                  placeholder="Action, Sci-Fi, Drama..."
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                />
              </div>
              <div className="admin-form-modern__field admin-form-modern__field--grow">
                <label className="admin-form-modern__label">Poster URL</label>
                <input
                  className="auth-card__input"
                  placeholder="https://..."
                  value={form.poster_url}
                  onChange={(e) => setForm({ ...form, poster_url: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-modern__field">
              <label className="admin-form-modern__label">Description</label>
              <textarea
                className="auth-card__input admin-form-modern__textarea"
                placeholder="A brief synopsis..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {error && <p className="auth-card__error">{error}</p>}

            <button
              type="submit"
              className="auth-card__submit"
              disabled={submitting}
              style={{ maxWidth: "200px" }}
            >
              {submitting ? "Adding..." : "Add Movie"}
            </button>
          </form>
        </div>
      )}

      {/* Movie List */}
      <div className="admin-table">
        <div className="admin-table__header">
          <span className="admin-table__col admin-table__col--grow">Movie</span>
          <span className="admin-table__col admin-table__col--sm">Genre</span>
          <span className="admin-table__col admin-table__col--sm">Duration</span>
          <span className="admin-table__col admin-table__col--action">Actions</span>
        </div>
        {movies.length === 0 ? (
          <div className="admin-table__empty">No movies added yet.</div>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="admin-table__row">
              <div className="admin-table__col admin-table__col--grow">
                <div className="admin-table__movie-cell">
                  {movie.poster_url ? (
                    <img src={movie.poster_url} alt="" className="admin-table__thumb" />
                  ) : (
                    <div className="admin-table__thumb-fallback">🎬</div>
                  )}
                  <span className="admin-table__movie-title">{movie.title}</span>
                </div>
              </div>
              <span className="admin-table__col admin-table__col--sm admin-table__col--muted">
                {movie.genre || "—"}
              </span>
              <span className="admin-table__col admin-table__col--sm admin-table__col--muted">
                {movie.duration_minutes} min
              </span>
              <span className="admin-table__col admin-table__col--action">
                <button
                  className="admin-table__delete-btn"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
