import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-4xl bg-white p-8 sm:p-10 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          eTikket
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Privacy Policy</h1>
        <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
          This policy explains what information eTikket collects, how it is used, and
          how account details are handled across the platform.
        </p>
        <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
          This page is a simple placeholder for the app flow. Replace it with your
          official privacy policy before going live.
        </p>
        <div className="mt-8">
          <Link href="/login" className="font-semibold text-rose-500 hover:text-rose-600">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}