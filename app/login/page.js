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
    <main className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="grid h-screen w-full overflow-hidden bg-white lg:grid-cols-[3fr_1fr]">
        <section className="relative min-h-80 overflow-hidden bg-slate-950 lg:min-h-screen">
          <Image
            src="/sideimage.png"
            alt="Decorative server aisle illustration"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/10 via-slate-950/20 to-slate-950/35" />
          <div className="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-10">
            <div className="max-w-md text-white">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Sign in to continue.
              </h1>
              <p className="mt-3 max-w-sm text-base leading-8 text-white/85 sm:text-lg">
                Access your dashboard, manage tickets, and continue where you left off.
              </p>
            </div>
          </div>
        </section>

        <section className="flex h-screen items-start overflow-y-auto bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_100%)] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-md space-y-6 lg:mx-0 lg:max-w-md lg:pt-8">
            <div className="flex justify-center">
              <Image
                src="/eTikketwhite.png"
                alt="eTikket logo"
                width={220}
                height={64}
                priority
                className="h-auto w-56 sm:w-64"
              />
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Welcome Back
              </h1>
            </div>

            <LoginForm />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-base text-slate-600">
              <p>Need an account?</p>
              <Link href="/register" className="font-semibold text-rose-500 hover:text-rose-600">
                Create one
              </Link>
            </div>

            <p className="text-center text-base font-medium text-slate-900 sm:text-lg">
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