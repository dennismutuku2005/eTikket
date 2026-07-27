"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";
import { getClientSession } from "@/lib/client-auth";
import { getRoleHomePath } from "@/lib/auth";

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
            alt="Organizer login background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/10 via-slate-950/20 to-slate-950/35" />
          <div className="absolute inset-0 flex items-end p-5 sm:p-7 lg:p-8">
            <div className="max-w-md text-white">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Welcome back.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/85 sm:text-base">
                Log in to access your eTikket account, buy tickets, or manage events.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_100%)] px-5 py-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-sm space-y-3">
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

            <div className="text-center">
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Sign in to eTikket
              </h1>
              <p className="mt-1 text-sm text-slate-600">Continue with your organizer or user account.</p>
            </div>

            <LoginForm />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Need an account?</p>
              <div className="mt-2 space-y-1">
                <Link href="/register" className="text-rose-500 hover:text-rose-600">
                  Register as a ticket buyer
                </Link>
                <Link href="/organizer/register" className="text-rose-500 hover:text-rose-600">
                  Register as an organizer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
