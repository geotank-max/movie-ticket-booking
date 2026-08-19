"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

function getDateKey(isoString) {
  const d = new Date(isoString);
  return d.toISOString().slice(0, 10);
}

function formatDateTab(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  if (dateStr === todayStr) return "Today";
  if (dateStr === tomorrowStr) return "Tomorrow";

  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ShowtimePicker({ showtimes }) {
  // Group showtimes by date, then by cinema
  const dateMap = useMemo(() => {
    const map = {};
    for (const st of showtimes) {
      const key = getDateKey(st.start_time);
      if (!map[key]) map[key] = [];
      map[key].push(st);
    }
    return map;
  }, [showtimes]);

  const sortedDates = Object.keys(dateMap).sort();
  const [selectedDate, setSelectedDate] = useState(sortedDates[0] || "");
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);

  // Group by cinema for the selected date
  const cinemaGroups = useMemo(() => {
    const items = dateMap[selectedDate] || [];
    const grouped = {};
    for (const st of items) {
      const cId = st.cinema.id;
      if (!grouped[cId]) {
        grouped[cId] = { cinema: st.cinema, showtimes: [] };
      }
      grouped[cId].showtimes.push(st);
    }
    return Object.values(grouped);
  }, [dateMap, selectedDate]);

  if (sortedDates.length === 0) {
    return (
      <section className="showtime-section">
        <h2 className="showtime-section__title">Showtimes</h2>
        <p style={{ color: "var(--text-tertiary)" }}>
          No showtimes available for this movie.
        </p>
      </section>
    );
  }

  return (
    <section className="showtime-section">
      <div className="showtime-section__header">
        <h2 className="showtime-section__title">Showtimes</h2>
      </div>

      {/* Date Tab Strip */}
      <div className="date-strip" role="tablist" aria-label="Select date">
        {sortedDates.map((date) => (
          <button
            key={date}
            role="tab"
            aria-selected={date === selectedDate}
            className={`date-tab ${date === selectedDate ? "date-tab--active" : ""}`}
            onClick={() => {
              setSelectedDate(date);
              setSelectedShowtimeId(null);
            }}
          >
            {formatDateTab(date)}
          </button>
        ))}
      </div>

      {/* Cinema groups with time chips */}
      {cinemaGroups.map(({ cinema, showtimes: sts }) => (
        <div key={cinema.id} className="cinema-group">
          <p className="cinema-group__name">{cinema.name}</p>
          {cinema.location && (
            <p className="cinema-group__location">{cinema.location}</p>
          )}
          <div className="time-chips" role="radiogroup" aria-label={`Showtimes at ${cinema.name}`}>
            {sts.map((st) => (
              <button
                key={st.id}
                role="radio"
                aria-checked={st.id === selectedShowtimeId}
                className={`time-chip ${st.id === selectedShowtimeId ? "time-chip--selected" : ""}`}
                onClick={() => setSelectedShowtimeId(st.id)}
              >
                {formatTime(st.start_time)}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Book Ticket CTA */}
      <div className="cta-wrapper">
        {selectedShowtimeId ? (
          <Link href={`/booking/${selectedShowtimeId}`} className="cta-book">
            🎬 Book Ticket
          </Link>
        ) : (
          <button className="cta-book" disabled>
            Select a showtime
          </button>
        )}
      </div>
    </section>
  );
}
