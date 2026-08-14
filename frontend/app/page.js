import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Movie Ticket Booking</h1>
      <p>Book tickets for the latest movies, fast and easy.</p>
      <Link href="/movies">Browse Movies</Link>
    </main>
  );
}