"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { getShowtime, createBooking } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";

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

  // Auth guard — redirect to login, preserving the return URL
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

  if (status === "loading") return <main><p>Loading...</p></main>;
  if (status === "error") return <main><p>Could not load this showtime.</p></main>;

  if (status === "success") {
    return (
      <main className="confirmation-page">
        <h1>Booking Confirmed 🎬</h1>
        <p>Your booking ID is #{confirmedBooking.id}</p>
        <p>{confirmedBooking.showtime.movie.title}</p>
        <p>{confirmedBooking.showtime.cinema.name}</p>
        <p>{confirmedBooking.seat_ids.length} seat(s) booked</p>
        <Link href="/movies">Back to movies</Link>
      </main>
    );
  }

  const total = (seatIds.length * Number(showtime.price)).toFixed(2);

  return (
    <main className="confirmation-page">
      <h1>Confirm Your Booking</h1>
      <p>{showtime.movie.title}</p>
      <p>{showtime.cinema.name}</p>
      <p>{seatIds.length} seat(s) — Total: ${total}</p>

      {errorMessage && <p className="booking-error">{errorMessage}</p>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Booking..." : "Confirm Booking"}
      </button>
    </main>
  );
}
