const TOKEN_KEY = "access_token";

// Simple event emitter for auth state changes
const listeners = new Set();

export function onAuthChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notifyAuthChange() {
  listeners.forEach((fn) => fn());
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
}
