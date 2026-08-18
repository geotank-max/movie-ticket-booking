"use client";

import Link from "next/link";
import { useAdminGuard } from "@/lib/useAdminGuard";

export default function AdminDashboard() {
  const status = useAdminGuard();

  if (status === "checking") return <main><p>Checking permissions...</p></main>;
  if (status === "denied") return <main><p>You don't have access to this page.</p></main>;

  return (
    <main className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-links">
        <Link href="/admin/movies">Manage Movies</Link>
        <Link href="/admin/bookings">View All Bookings</Link>
      </div>
    </main>
  );
}