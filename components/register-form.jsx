"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loading-screen";

export default function RegisterForm({ role = "user", redirectPath = "/user/home" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const missing = [];

    if (!name.trim()) missing.push("full name");
    if (!phone.trim()) missing.push("phone number");
    if (!email.trim()) missing.push("email");
    if (!password) missing.push("password");
    if (!confirmPassword) missing.push("confirm password");

    if (missing.length > 0) {
      setError(`Please enter your ${missing.join(", ")}.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setShowConfirmModal(true);
  }

  function confirmAccount() {
    setIsLoading(true);

    try {
      const session = encodeURIComponent(
        JSON.stringify({ email, phone, role, name }),
      );

      document.cookie = `etikket-session=${session}; path=/; max-age=604800; samesite=lax`;
      router.replace(redirectPath);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setShowConfirmModal(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}

      <div className="bg-white">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">
              Full name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              autoComplete="name"
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">
              Phone number
            </span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              type="tel"
              autoComplete="tel"
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="0711000000"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">
              Password
            </span>
            <div className="flex h-12 items-center gap-2 rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 transition focus-within:border-[#f33959] focus-within:bg-white">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full bg-transparent text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70]"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[#6b6b70] transition hover:text-[#0f0f10]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
                    <path d="M9.88 5.1A10.94 10.94 0 0 1 12 5c5 0 9 4 9 7a10.75 10.75 0 0 1-2.07 3.7" />
                    <path d="M6.6 6.6C4.2 8.1 3 10 3 12c0 3 4 7 9 7 1.2 0 2.33-.2 3.37-.56" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">
              Confirm password
            </span>
            <div className="flex h-12 items-center gap-2 rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 transition focus-within:border-[#f33959] focus-within:bg-white">
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full bg-transparent text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70]"
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="text-[#6b6b70] transition hover:text-[#0f0f10]"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
                    <path d="M9.88 5.1A10.94 10.94 0 0 1 12 5c5 0 9 4 9 7a10.75 10.75 0 0 1-2.07 3.7" />
                    <path d="M6.6 6.6C4.2 8.1 3 10 3 12c0 3 4 7 9 7 1.2 0 2.33-.2 3.37-.56" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {showConfirmModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
            <div className="w-full max-w-md rounded-[24px] border border-[#ececec] bg-white p-6 text-[#0f0f10] shadow-2xl animate-in fade-in zoom-in-95">
              <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">Confirm account</p>
              <h3 className="mt-2 text-2xl font-bold">Send confirmation email</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
                A confirmation message will be sent to <span className="font-bold text-[#0f0f10]">{email}</span> before the account is activated.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-full border border-[#ececec] px-5 py-2.5 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAccount}
                  className="rounded-full bg-[#f33959] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
                >
                  Confirm and send
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}