import { parseSessionCookie } from "@/lib/auth";

export function getClientSession() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith("etikket-session="));

  if (!cookie) {
    return null;
  }

  const value = cookie.slice("etikket-session=".length);
  return parseSessionCookie(value);
}