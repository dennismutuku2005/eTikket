"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loading-screen";

export default function RegisterForm() {
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

    if (!name || !phone || !email || !password || !confirmPassword) {
      setError("Fill in all fields.");
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
        JSON.stringify({ email, phone, role: "user", name }),
      );

      document.cookie = `etikket-session=${session}; path=/; max-age=604800; samesite=lax`;
      router.replace("/user/home");
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

      <div className="rounded-3xl bg-white p-7 sm:p-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-base font-medium text-slate-700">
              Full name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              autoComplete="name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-400 focus:bg-white"
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-base font-medium text-slate-700">
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-400 focus:bg-white"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-base font-medium text-slate-700">
              Phone number
            </span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              type="tel"
              autoComplete="tel"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-400 focus:bg-white"
              placeholder="0711000000"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-base font-medium text-slate-700">
              Password
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-rose-400 focus-within:bg-white">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full bg-transparent text-slate-900 outline-none ring-0 placeholder:text-slate-400"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-slate-500 transition hover:text-slate-700"
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
            <span className="mb-2 block text-base font-medium text-slate-700">
              Confirm password
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-rose-400 focus-within:bg-white">
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full bg-transparent text-slate-900 outline-none ring-0 placeholder:text-slate-400"
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="text-slate-500 transition hover:text-slate-700"
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
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-base text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-rose-500 px-5 py-4 text-base font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {showConfirmModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900">
              <p className="text-base font-semibold text-rose-500">Confirm account</p>
              <h3 className="mt-2 text-3xl font-semibold">Send confirmation email</h3>
              <p className="mt-3 text-base leading-8 text-slate-600">
                A confirmation message will be sent to <span className="font-medium text-slate-900">{email}</span> before the account is activated.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-full px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAccount}
                  className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
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
