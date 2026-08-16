"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/api";
import { saveToken } from "@/lib/auth";

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
    <main className="auth-page">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        {error && <p className="booking-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
}