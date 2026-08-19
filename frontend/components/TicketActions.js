"use client";

export default function TicketActions({ bookingId }) {
  function handleSave() {
    // In a real app this would save to wallet/favorites
    alert(`Ticket MTB-${bookingId} saved!`);
  }

  function handleDownload() {
    // In a real app this would generate a PDF
    alert(`Downloading ticket MTB-${bookingId} as PDF...`);
  }

  return (
    <div className="ticket-actions">
      <button
        className="ticket-actions__btn ticket-actions__btn--primary"
        onClick={handleSave}
      >
        <span aria-hidden="true">🔖</span> Save Ticket
      </button>
      <button
        className="ticket-actions__btn ticket-actions__btn--secondary"
        onClick={handleDownload}
      >
        <span aria-hidden="true">⬇</span> Download PDF
      </button>
    </div>
  );
}
