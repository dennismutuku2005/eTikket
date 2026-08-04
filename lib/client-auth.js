import { parseSessionCookie } from "@/lib/auth";

/** Decode a JWT payload without verifying the signature (client-side only) */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns true if a JWT token is expired */
function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false; // no expiry claim → treat as valid
  return Date.now() / 1000 >= payload.exp;
}

/** Clear the session cookie and redirect to the role login page */
export function clearSessionAndRedirect(role = "organizer") {
  document.cookie = "etikket-session=; Max-Age=0; path=/";
  const loginPaths = {
    organizer: "/organizer/login",
    admin: "/admin/login",
    gate_staff: "/gatestaff/login",
  };
  window.location.replace(loginPaths[role] || "/organizer/login");
}

/**
 * Gets the current client session from the cookie.
 * Returns null (and clears the cookie) if the session is missing or the JWT is expired.
 */
export function getClientSession() {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith("etikket-session="));

  if (!cookie) return null;

  const value = cookie.slice("etikket-session=".length);
  const session = parseSessionCookie(value);

  if (!session) return null;

  // If the JWT token is expired, treat it as no session
  if (session.token && isTokenExpired(session.token)) {
    document.cookie = "etikket-session=; Max-Age=0; path=/";
    return null;
  }

  return session;
}