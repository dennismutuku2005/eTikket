import Link from "next/link";

export default function AppShell({ role, title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff5f7_0%,#ffffff_42%,#f8fafc_100%)] px-6 py-6 text-slate-900 sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col gap-6 rounded-4xl border border-slate-200 bg-white p-5 sm:p-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
              {role}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/home"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Public Home
            </Link>
            <Link
              href="/logout"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Log out
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {children}
        </section>
      </div>
    </main>
  );
}