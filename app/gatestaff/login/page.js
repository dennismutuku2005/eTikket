"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDemoUser } from "@/lib/auth";

export default function GateStaffLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedSession = window.localStorage.getItem("etikket-gate-session");
      if (!storedSession) {
        return;
      }

      const parsed = JSON.parse(storedSession);
      if (parsed?.role === "gate_staff") {
        router.replace("/gatestaff/now");
      }
    } catch {
      window.localStorage.removeItem("etikket-gate-session");
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = getDemoUser(identifier, password);

      if (!user || user.role !== "gate_staff") {
        setError("Use the gate staff demo credentials to continue.");
        setIsLoading(false);
        return;
      }

      const sessionData = { email: user.email, role: user.role, name: user.name };

      if (typeof window !== "undefined") {
        window.localStorage.setItem("etikket-gate-session", JSON.stringify(sessionData));
      }

      router.replace("/gatestaff/now");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh overflow-y-auto bg-[#fafafa] text-[#0f0f10]">
      <div className="grid min-h-dvh w-full overflow-hidden lg:grid-cols-[6fr_4fr]">
        <section className="relative min-h-64 overflow-hidden bg-[#111113] lg:min-h-dvh">
          <Image src="/sideimage.png" alt="Gate staff entry" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/30 to-black/60" />
          <div className="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-12">
            <div className="max-w-md text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">Gate staff access</span>
              <h1 className="mt-3 text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
                Sign in to begin check-in.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80 sm:text-base">
                Only approved gate staff can scan tickets and verify attendees at the entrance.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-[#fafafa] px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-sm">
            <Image src="/eTikketwhite.png" alt="eTikket logo" width={140} height={42} priority className="h-auto w-32 filter invert" />

            <div className="mt-8 rounded-[24px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
              <div>
                <h2 className="text-2xl font-bold text-[#0f0f10]">Gate staff login</h2>
                <p className="mt-1 text-sm text-[#6b6b70]">Enter your staff credentials to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Email or phone</span>
                  <input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    type="text"
                    autoComplete="username"
                    placeholder="gate@etikket.co.ke"
                    className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Password</span>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                  />
                </label>

                {error ? <p className="rounded-[14px] bg-[#f33959]/10 px-4 py-2.5 text-xs font-bold text-[#f33959]">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-full bg-[#f33959] px-5 text-sm font-bold text-white transition hover:bg-[#d92847] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Log in"}
                </button>
              </form>

              <div className="mt-4 rounded-[14px] border border-dashed border-[#ececec] bg-[#fafafa] px-3.5 py-3 text-xs leading-5 text-[#6b6b70]">
                Demo gate staff access: <span className="font-bold text-[#0f0f10]">gate@etikket.co.ke</span> / <span className="font-bold text-[#0f0f10]">gate123</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
