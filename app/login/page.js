"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getClientSession();

    if (session?.role) {
      router.replace(getRoleHomePath(session.role));
    }
  }, [router]);

  return (
    <main className="h-dvh overflow-y-auto bg-slate-100 text-slate-900">
      <div className="grid min-h-dvh w-full overflow-hidden bg-white lg:grid-cols-[6fr_4fr]">
        <section className="relative min-h-64 overflow-hidden bg-slate-950 lg:min-h-dvh">
          <Image
            src="/sideimage.png"
            alt="Decorative server aisle illustration"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/10 via-slate-950/20 to-slate-950/35" />
          <div className="absolute inset-0 flex items-end p-5 sm:p-7 lg:p-8">
            <div className="max-w-md text-white">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Sign in to continue.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/85 sm:text-base">
                Access your dashboard, manage tickets, and continue where you left off.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_100%)] px-5 py-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-sm space-y-3">
            {/* Logo - Smaller */}
            <div className="flex justify-center">
              <Image
                src="/eTikketwhite.png"
                alt="eTikket logo"
                width={160}
                height={48}
                priority
                className="h-auto w-36 sm:w-40"
              />
            </div>

            {/* Welcome Text - Compact */}
            <div className="text-center">
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Welcome Back
              </h1>
              <p className="mt-1 text-sm text-slate-600">Sign in to your account</p>
            </div>

            {/* Login Form - Compact */}
            <LoginForm />

            {/* Links - Compact */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
              <p className="text-sm">Need an account?</p>
              <Link href="/register" className="font-semibold text-rose-500 hover:text-rose-600">
                Create one
              </Link>
            </div>

            {/* Terms - Smaller */}
            <p className="text-xs text-center font-medium leading-5 text-slate-500">
              By signing in, you accept the{" "}
              <Link href="/terms" className="text-rose-500 hover:text-rose-600">
                Terms
              </Link>
              {" "}and{" "}
              <Link href="/privacy-policy" className="text-rose-500 hover:text-rose-600">
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