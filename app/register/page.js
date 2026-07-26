"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
  const [role, setRole] = useState(null); // null, 'user', or 'seller'

  return (
    <main className="h-dvh overflow-y-auto bg-slate-100 text-slate-900">
      <div className="grid min-h-dvh w-full overflow-hidden bg-white lg:grid-cols-[6fr_4fr]">
        <section className="relative min-h-80 overflow-hidden bg-slate-950 lg:min-h-dvh">
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
                {role === null && "Create your account."}
                {role === 'user' && "Join as an attendee."}
                {role === 'seller' && "Start selling events."}
              </h1>
              <p className="mt-3 max-w-sm text-base leading-8 text-white/85 sm:text-lg">
                {role === null && "Register to buy tickets, save purchases, and continue on your user panel."}
                {role === 'user' && "Discover events, buy tickets, and manage your bookings."}
                {role === 'seller' && "Create events, sell tickets, and grow your audience."}
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_100%)] px-8 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-md space-y-6">
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

            {/* Role Selection */}
            {role === null ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                    Choose account type
                  </h1>
                  <p className="mt-2 text-base text-slate-600">
                    How will you use eTikket?
                  </p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={() => setRole('user')}
                    className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all hover:border-rose-500 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-100">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">I'm an attendee</h3>
                      <p className="text-sm text-slate-600">Buy tickets for events</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setRole('seller')}
                    className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all hover:border-rose-500 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-100">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">I'm an organizer</h3>
                      <p className="text-sm text-slate-600">Create and sell tickets for events</p>
                    </div>
                  </button>
                </div>

                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-rose-500 hover:text-rose-600">
                    Sign in
                  </Link>
                </p>
              </div>
            ) : (
              /* Registration Form */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setRole(null)}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
                    {role === 'user' ? 'Attendee' : 'Organizer'}
                  </span>
                </div>

                <div className="text-center">
                  <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                    {role === 'user' ? "Create attendee account" : "Create organizer account"}
                  </h1>
                  <p className="mt-2 text-base text-slate-600">
                    {role === 'user' 
                      ? "Start discovering and attending events" 
                      : "Start creating and selling tickets"}
                  </p>
                </div>

                <RegisterForm role={role} />

                <div className="pt-2 text-center text-base text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-rose-500 hover:text-rose-600">
                    Sign in
                  </Link>
                </div>

                <p className="text-center text-base font-medium text-slate-900 sm:text-lg">
                  By joining, you accept the{" "}
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
            )}
          </div>
        </section>
      </div>
    </main>
  );
}