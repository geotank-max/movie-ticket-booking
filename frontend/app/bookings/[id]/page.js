"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMyBookings } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";
import DigitalTicket from "@/components/DigitalTicket";
import TicketActions from "@/components/TicketActions";

export default function TicketViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!getToken()) {
      router.push(`/login?redirect=/bookings/${id}`);
      return;
    }

    getMyBookings()
      .then((bookings) => {
        const found = bookings.find((b) => String(b.id) === String(id));
        if (found) {
          setBooking(found);
          setStatus("ready");
        } else {
          setStatus("not-found");
        }
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") {
    return (
      <main className="ticket-page">
        <p style={{ color: "var(--text-tertiary)" }}>Loading ticket...</p>
      </main>
    );
  }

  if (status === "not-found" || status === "error") {
    return (
      <main className="ticket-page">
        <p style={{ color: "var(--text-tertiary)" }}>Ticket not found.</p>
        <Link href="/bookings" className="back-link" style={{ marginTop: "1rem", display: "inline-block" }}>
          ← Back to bookings
        </Link>
      </main>
    );
  }

  return (
    <main className="ticket-page">
      <div className="ticket-success-header">
        <div className="ticket-success-header__icon">🎟</div>
        <h1 className="ticket-success-header__title">Your Ticket</h1>
        <p className="ticket-success-header__ref">MTB-{booking.id}</p>
      </div>

      <DigitalTicket booking={booking} />
      <TicketActions bookingId={booking.id} />

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link href="/bookings" className="back-link">
          ← All Bookings
        </Link>
      </div>
    </main>
  );
}
