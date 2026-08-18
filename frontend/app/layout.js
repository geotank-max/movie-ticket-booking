import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Movie Ticket Booking",
  description: "Book movie tickets online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="main-nav">
          <Link href="/" className="nav-brand">🎬 MovieBooking</Link>
          <div className="nav-links">
            <Link href="/movies">Movies</Link>
            <Link href="/bookings">My Bookings</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/login">Log In</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}