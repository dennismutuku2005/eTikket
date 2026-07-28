import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/register-form";

export default function OrganizerRegisterPage() {
  return (
    <main className="h-dvh overflow-y-auto bg-white text-slate-900">
      <div className="grid min-h-dvh w-full overflow-hidden lg:grid-cols-[6fr_4fr]">
        <section className="relative min-h-64 overflow-hidden bg-slate-950 lg:min-h-dvh">
          <Image
            src="/sideimage.png"
            alt="Decorative server aisle illustration"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/10 via-slate-950/20 to-slate-950/40" />
          <div className="absolute inset-0 flex items-end p-5 sm:p-7 lg:p-10">
            <div className="max-w-md text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Organizer access
              </span>
              <h1 className="mt-3 text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
                Register as an organizer.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/75 sm:text-base">
                Create an account and manage attendees, events, payments, and gate staff from one dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center overflow-y-auto px-6 py-10 sm:px-10 lg:px-12">
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
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Create account
              </h1>
              <p className="mt-1 text-sm text-slate-500">Register as an organizer</p>
            </div>

            {/* Register Form */}
            <div className="mt-6">
              <RegisterForm role="organizer" redirectPath="/organizer/home" />
            </div>

            {/* Login link */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
              <span className="text-slate-500">Already have an account?</span>
              <Link
                href="/organizer/login"
                className="font-semibold text-rose-500 transition-colors hover:text-rose-600"
              >
                Sign in →
              </Link>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs leading-5 text-slate-400">
              By registering, you accept the{" "}
              <Link href="/terms" className="text-slate-600 underline underline-offset-2 hover:text-rose-500">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-slate-600 underline underline-offset-2 hover:text-rose-500">
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