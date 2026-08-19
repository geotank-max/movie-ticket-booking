"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import { getToken, clearToken, onAuthChange } from "@/lib/auth";
import Link from "next/link";

export default function NavUser() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const fetchUser = useCallback(() => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Re-fetch whenever auth state changes (login/logout)
  useEffect(() => {
    return onAuthChange(fetchUser);
  }, [fetchUser]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearToken();
    setUser(null);
    setOpen(false);
    router.push("/login");
  }

  // Not logged in — show login link
  if (loading) return null;

  if (!user) {
    return (
      <Link href="/login" className="nav-login-btn">
        Sign In
      </Link>
    );
  }

  // Logged in — show avatar
  const initials = user.email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="nav-user" ref={dropdownRef}>
      <button
        className="nav-user__avatar"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div className="nav-user__dropdown" role="menu">
          {/* User Info */}
          <div className="nav-user__info">
            <div className="nav-user__info-avatar">{initials}</div>
            <div className="nav-user__info-details">
              <p className="nav-user__info-email">{user.email}</p>
              <p className="nav-user__info-id">ID: {user.id}</p>
            </div>
          </div>

          <div className="nav-user__divider" />

          {/* Links */}
          <Link
            href="/bookings"
            className="nav-user__menu-item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className="nav-user__menu-icon">🎟</span>
            My Bookings
          </Link>

          {user.is_admin && (
            <Link
              href="/admin"
              className="nav-user__menu-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="nav-user__menu-icon">⚙️</span>
              Admin Panel
            </Link>
          )}

          <div className="nav-user__divider" />

          {/* Logout */}
          <button
            className="nav-user__logout"
            onClick={handleLogout}
            role="menuitem"
          >
            <span className="nav-user__menu-icon">↪</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
