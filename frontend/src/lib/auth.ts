export function clearAuth() {
  // Auth now lives in an httpOnly cookie set by the server.
  // Actual logout happens via a call to /auth/logout (see CartContext / Navbar).
  // This function exists so any old callers don't break during the transition.
}