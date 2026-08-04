"use client";

import { useRouter } from "next/navigation";
import { AuthError } from "@/lib/api";

/**
 * Returns a wrapper around an async callback that automatically redirects
 * to the login page if the API responds with a 401 (session expired).
 *
 * Usage:
 *   const withAuth = useAuthGuard("organizer");
 *   await withAuth(async () => {
 *     const data = await apiRequestAuth("/events/mine", token);
 *   });
 */
export function useAuthGuard(role = "organizer") {
  const router = useRouter();

  const loginPaths = {
    organizer: "/organizer/login",
    admin: "/admin/login",
    gate_staff: "/gatestaff/login",
  };

  async function withAuth(fn) {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof AuthError || err?.status === 401) {
        // Clear the stale cookie
        if (typeof document !== "undefined") {
          document.cookie = "etikket-session=; Max-Age=0; path=/";
        }
        router.replace(loginPaths[role] || "/organizer/login");
        return null;
      }
      throw err; // re-throw non-auth errors for caller to handle
    }
  }

  return withAuth;
}
