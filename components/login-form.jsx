"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoUser, getRoleHomePath } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = getDemoUser(identifier, password);

      if (!user) {
        setError("Invalid email or phone number.");
        setIsLoading(false);
        return;
      }

      const session = encodeURIComponent(
        JSON.stringify({ email: user.email, role: user.role, name: user.name }),
      );

      document.cookie = `etikket-session=${session}; path=/; max-age=604800; samesite=lax`;
      router.replace(getRoleHomePath(user.role));
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,15,16,0.06)] sm:p-5">
      <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Email or phone number
            </span>
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              type="text"
              autoComplete="username"
              className="h-12 w-full rounded-lg border border-transparent bg-slate-50 px-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-400 focus:bg-white"
              placeholder="you@example.com or 0711000000"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              className="h-12 w-full rounded-lg border border-transparent bg-slate-50 px-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-400 focus:bg-white"
              placeholder="Password"
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-full bg-rose-500 px-5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {isLoading ? "Signing in..." : "Log in"}
          </button>
        </form>
    </div>
  );
}
