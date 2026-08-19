"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { getShowtime, createBooking } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";
import DigitalTicket from "@/components/DigitalTicket";
import TicketActions from "@/components/TicketActions";

export default function ConfirmBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const showtimeId = params.showtimeId;
  const seatIds = searchParams.get("seats")?.split(",").map(Number) || [];

  const [showtime, setShowtime] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | submitting | error | success
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Auth guard
  useEffect(() => {
    if (!getToken()) {
      const returnTo = `/booking/${showtimeId}/confirm?seats=${searchParams.get("seats")}`;
      router.push(`/login?redirect=${encodeURIComponent(returnTo)}`);
    }
  }, []);

  useEffect(() => {
    getShowtime(showtimeId)
      .then((data) => {
        setShowtime(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [showtimeId]);

  async function handleConfirm() {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const booking = await createBooking(showtimeId, seatIds);
      setConfirmedBooking(booking);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("ready");
    }
  }

  if (status === "loading") {
    return (
      <main className="ticket-page">
        <p style={{ color: "var(--text-tertiary)" }}>Loading...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="ticket-page">
        <p style={{ color: "var(--text-tertiary)" }}>Could not load this showtime.</p>
      </main>
    );
  }

  // ── Success: Show Digital Ticket ──────────────────────────────────
  if (status === "success" && confirmedBooking) {
    return (
      <main className="ticket-page">
        <div className="ticket-success-header">
          <div className="ticket-success-header__icon">✓</div>
          <h1 className="ticket-success-header__title">Booking Confirmed</h1>
          <p className="ticket-success-header__ref">MTB-{confirmedBooking.id}</p>
        </div>

        <DigitalTicket booking={confirmedBooking} />
        <TicketActions bookingId={confirmedBooking.id} />

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/bookings" className="back-link">
            View all bookings →
          </Link>
        </div>
      </main>
    );
  }

  // ── Pre-confirmation state ────────────────────────────────────────
  const total = (seatIds.length * Number(showtime.price)).toFixed(2);

  return (
    <main className="ticket-page">
      <div className="ticket-card" style={{ animationName: "none", opacity: 1 }}>
        <div className="ticket-card__header">
          {showtime.movie.poster_url ? (
            <img
              src={showtime.movie.poster_url}
              alt={showtime.movie.title}
              className="ticket-card__poster"
            />
          ) : (
            <div className="ticket-card__poster-fallback" aria-hidden="true">🎬</div>
          )}
          <div className="ticket-card__movie-info">
            <h2 className="ticket-card__movie-title">{showtime.movie.title}</h2>
            <p className="ticket-card__movie-meta">
              {showtime.cinema.name}
            </p>
          </div>
        </div>

        <div className="ticket-card__divider" aria-hidden="true" />

        <div className="ticket-card__details">
          <div className="ticket-detail">
            <p className="ticket-detail__label">Seats</p>
            <p className="ticket-detail__value">{seatIds.length} seat{seatIds.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="ticket-detail">
            <p className="ticket-detail__label">Price Each</p>
            <p className="ticket-detail__value">${showtime.price}</p>
          </div>
          <div className="ticket-detail">
            <p className="ticket-detail__label">Total</p>
            <p className="ticket-detail__value ticket-detail__value--accent">${total}</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p style={{ color: "#ff6b6b", marginTop: "1rem", textAlign: "center" }}>
          {errorMessage}
        </p>
      )}

      <div className="cta-wrapper" style={{ marginTop: "1.5rem" }}>
        <button
          className="cta-book"
          onClick={handleConfirm}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </main>
  );
}
