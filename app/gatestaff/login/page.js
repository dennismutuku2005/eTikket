"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequest } from "@/lib/api";

export default function GateStaffLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (session?.role === "gate_staff") {
      router.replace(getRoleHomePath(session.role));
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      toast.error("Please enter your email/phone and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      const user = response?.user || response;

      if (!user || user.role !== "gate_staff") {
        toast.error("Access denied. Only gate staff accounts can sign in here.");
        setIsLoading(false);
        return;
      }

      const session = encodeURIComponent(
        JSON.stringify({ email: user.email, role: user.role, name: user.name, token: response?.token || '' }),
      );

      document.cookie = `etikket-session=${session}; path=/; max-age=604800; samesite=lax`;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "etikket-gate-session",
          JSON.stringify({ email: user.email, role: user.role, name: user.name })
        );
      }

      toast.success("Welcome! Redirecting to gate check-in...");
      router.replace(getRoleHomePath(user.role));
      router.refresh();
    } catch (err) {
      const errMsg = err.message || "Failed to fetch. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="h-dvh overflow-y-auto bg-[#fafafa] text-[#0f0f10]">
      <div className="grid min-h-dvh w-full overflow-hidden lg:grid-cols-[6fr_4fr]">
        <section className="relative min-h-64 overflow-hidden bg-[#111113] lg:min-h-dvh">
          <Image
            src="/sideimage.png"
            alt="Decorative event illustration"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/30 to-black/60" />
          <div className="absolute inset-0 flex items-end p-5 sm:p-7 lg:p-10">
            <div className="max-w-md text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f33959]">
                Gate staff access
              </span>
              <h1 className="mt-3 text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
                Sign in to begin check-in.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80 sm:text-base">
                Only approved gate staff can scan tickets and verify attendees at the entrance.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-white px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <Image
              src="/eTikketwhite.png"
              alt="eTikket logo"
              width={140}
              height={42}
              priority
              className="h-auto w-32"
            />

            {/* Welcome Text */}
            <div className="mt-8">
              <h1 className="text-2xl font-bold leading-tight text-[#0f0f10] sm:text-3xl">
                Gate staff login
              </h1>
              <p className="mt-1 text-sm text-[#6b6b70]">Sign in with your staff credentials</p>
            </div>

            {/* Login Form */}
            <div className="mt-6">
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
                    placeholder="gate@etikket.co.ke or 0711000000"
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

            {/* Notice: Gate staff are registered by organizers */}
            <div className="mt-6 border-t border-[#ececec] pt-4 text-xs leading-5 text-[#6b6b70]">
              <p className="font-bold text-[#0f0f10]">Cannot register?</p>
              <p className="mt-0.5">
                Gate staff accounts are created by event organizers or administrators. Contact your organizer for access credentials.
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs leading-5 text-[#6b6b70]">
              By signing in, you accept the{" "}
              <Link href="/terms" className="text-[#0f0f10] font-bold underline underline-offset-2 hover:text-[#f33959]">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#0f0f10] font-bold underline underline-offset-2 hover:text-[#f33959]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

