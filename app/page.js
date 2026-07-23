import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5f7_0%,_#ffffff_42%,_#f8fafc_100%)] px-6 py-10 text-slate-900 sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-between gap-12 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <header className="flex items-center justify-center sm:justify-start">
          <Image
            src="/eTikketLogo.png"
            alt="eTikket logo"
            width={320}
            height={90}
            priority
            className="h-auto w-56 sm:w-72"
          />
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-3xl space-y-6 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
              Modern event ticketing for Kenya
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Sell, pay, and check in with one simple ticketing flow.
            </h1>
            <p className="text-lg leading-8 text-slate-600 sm:text-xl">
              eTikket is a modern event ticketing platform designed to simplify
              ticket purchasing for events in Kenya. Organizers create events,
              share a unique purchase link, accept M-Pesa STK Push payments, and
              issue QR code tickets instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <span className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm">
                M-Pesa STK Push
              </span>
              <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm">
                QR code check-in
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Real-time sales tracking
              </span>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/10">
            <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-rose-300">
                How it works
              </p>
              <ol className="space-y-4 text-sm leading-7 text-slate-200">
                <li>Create an event and get a unique purchase link.</li>
                <li>Share the link on WhatsApp, SMS, email, or social media.</li>
                <li>Customers pay with M-Pesa and receive a QR ticket instantly.</li>
                <li>Scan at the venue to verify and check in attendees.</li>
              </ol>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-semibold">No paper</p>
                <p className="mt-1 text-sm text-slate-300">
                  Eliminate physical tickets and reduce waste.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-semibold">No forgery</p>
                <p className="mt-1 text-sm text-slate-300">
                  QR verification prevents duplicate or fake tickets.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <footer className="flex flex-col items-center gap-2 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:text-left">
          <p>Built for fast event sales and smooth venue entry.</p>
          <p>eTikket supports better visibility for organizers and attendees.</p>
        </footer>
      </div>
    </main>
  );
}
