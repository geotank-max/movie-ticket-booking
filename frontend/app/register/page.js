"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await registerUser(email, password);
      const { access_token } = await loginUser(email, password);
      saveToken(access_token);
      router.push("/movies");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page-modern">
      <div className="auth-card">
        {/* Branding */}
        <div className="auth-card__header">
          <div className="auth-card__icon" aria-hidden="true">🎬</div>
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">
            Join to book tickets and manage your cinema experience
          </p>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="auth-card__field">
            <label className="auth-card__label" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
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
            <label className="auth-card__label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              className="auth-card__input"
              type="password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && <p className="auth-card__error">{error}</p>}

          <button
            type="submit"
            className="auth-card__submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            Already have an account?{" "}
            <Link href="/login" className="auth-card__footer-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
