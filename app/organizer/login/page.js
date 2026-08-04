"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getClientSession();

    if (session?.role === "organizer") {
      router.replace(getRoleHomePath(session.role));
    }
  }, [router]);

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
                Organizer access
              </span>
              <h1 className="mt-3 text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
                Sign in to run your events.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80 sm:text-base">
                Manage listings, track ticket sales, and get paid — all from one dashboard.
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
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-[#6b6b70]">Sign in to your organizer account</p>
            </div>

            {/* Login Form */}
            <div className="mt-6">
              <LoginForm requiredRole="organizer" />
            </div>

            {/* Register link */}
            <div className="mt-6 flex items-center justify-between border-t border-[#ececec] pt-4 text-sm">
              <span className="text-[#6b6b70]">New here?</span>
              <Link
                href="/organizer/register"
                className="font-bold text-[#f33959] transition-colors hover:text-[#d92847]"
              >
                Register as an organizer →
              </Link>
            </div>

            {/* Demo credentials removed — use real accounts */}

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