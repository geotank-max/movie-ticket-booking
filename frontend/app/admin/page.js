"use client";

import Link from "next/link";
import { useAdminGuard } from "@/lib/useAdminGuard";

export default function AdminDashboard() {
  const status = useAdminGuard();

  if (status === "checking") {
    return (
      <main className="page-container">
        <p className="page-loading">Checking permissions...</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="page-container">
        <div className="empty-state">
          <div className="empty-state__icon">🚫</div>
          <h2 className="empty-state__title">Access Denied</h2>
          <p className="empty-state__desc">You don't have permission to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage your cinema platform</p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <Link href="/admin/movies" className="admin-dashboard-card">
          <span className="admin-dashboard-card__icon">🎞</span>
          <h2 className="admin-dashboard-card__title">Manage Movies</h2>
          <p className="admin-dashboard-card__desc">
            Add, edit, or remove movies from the catalog.
          </p>
        </Link>

        <Link href="/admin/bookings" className="admin-dashboard-card">
          <span className="admin-dashboard-card__icon">📋</span>
          <h2 className="admin-dashboard-card__title">View All Bookings</h2>
          <p className="admin-dashboard-card__desc">
            Monitor all customer bookings and statuses.
          </p>
        </Link>
      </div>
    </main>
  );
}
