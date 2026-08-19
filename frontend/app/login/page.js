"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { access_token } = await loginUser(email, password);
      saveToken(access_token);
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/movies");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-card__form" onSubmit={handleSubmit}>
      <div className="auth-card__field">
        <label className="auth-card__label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className="auth-card__input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="auth-card__field">
        <label className="auth-card__label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          className="auth-card__input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p className="auth-card__error">{error}</p>}

      <button
        type="submit"
        className="auth-card__submit"
        disabled={submitting}
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="auth-page-modern">
      <div className="auth-card">
        {/* Branding */}
        <div className="auth-card__header">
          <div className="auth-card__icon" aria-hidden="true">🎬</div>
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">
            Sign in to access your tickets and bookings
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            Don't have an account?{" "}
            <Link href="/register" className="auth-card__footer-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
