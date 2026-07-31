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
    <div className="bg-white">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">
            Email or phone number
          </span>
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            type="text"
            autoComplete="username"
            className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
            placeholder="you@example.com or 0711000000"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">
            Password
          </span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
            placeholder="Password"
          />
        </label>

        {error ? (
          <p className="rounded-[14px] bg-[#f33959]/10 px-4 py-2.5 text-sm font-bold text-[#f33959]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-full bg-[#f33959] px-5 text-sm font-bold text-white transition hover:bg-[#d92847] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}