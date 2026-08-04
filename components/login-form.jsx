"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getRoleHomePath } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

export default function LoginForm({ requiredRole }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      toast.error("Please enter both your email/phone and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      const user = response?.user || response;
      const role = user?.role || 'buyer';

      if (requiredRole && role !== requiredRole) {
        toast.error(`Access denied. Only ${requiredRole.replace('_', ' ')} accounts can sign in here.`);
        setIsLoading(false);
        return;
      }

      const session = encodeURIComponent(
        JSON.stringify({ id: user.id, email: user.email, role, name: user.name, token: response?.token || '' }),
      );

      document.cookie = `etikket-session=${session}; path=/; max-age=604800; samesite=lax`;
      toast.success("Successfully logged in!");
      router.replace(getRoleHomePath(role));
      router.refresh();
    } catch (err) {
      const errMsg = err.message || "Failed to fetch. Please try again.";
      toast.error(errMsg);
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