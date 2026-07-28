import Image from "next/image";
import Link from "next/link";

const helpCategories = [
  {
    title: "Buying tickets",
    description: "Choose an event, select a ticket class, and pay as a guest.",
    href: "/help/buying-tickets",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    title: "Selling events",
    description: "Create an organizer workspace and start listing events.",
    href: "/help/selling-events",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Payments & M-Pesa",
    description: "How M-Pesa STK Push works and what to do if a payment fails.",
    href: "/help/payments",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: "QR tickets & entry",
    description: "How QR check-in works and what guests should bring to the gate.",
    href: "/help/qr-tickets",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    title: "Organizer dashboard",
    description: "Manage events, track sales, and configure gate admins.",
    href: "/help/organizer-dashboard",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
      </svg>
    ),
  },
  {
    title: "Account & login",
    description: "Organizer login, password help, and session management.",
    href: "/help/account",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <Link href="/events" className="rounded-full bg-[#f33959] px-4 py-2 text-sm font-bold text-white">Browse events</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <div className="rounded-[20px] bg-white p-8 shadow-[0_2px_8px_rgba(15,15,16,0.06)] sm:p-10">
          <p className="text-base font-bold text-[#f33959]">Help center</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">How can we help?</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6b6b70]">
            Quick support pages for ticket buyers and event organizers. No account needed to buy tickets.
          </p>
        </div>

        {/* Category grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#fbd0d8] hover:shadow-[0_8px_24px_rgba(15,15,16,0.08)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500 group-hover:bg-rose-100">
                {cat.icon}
              </div>
              <h2 className="mt-4 text-xl font-bold">{cat.title}</h2>
              <p className="mt-2 text-base leading-7 text-[#6b6b70]">{cat.description}</p>
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 rounded-[20px] border border-[#ececec] bg-white p-6 text-center">
          <h2 className="text-2xl font-bold">Still need help?</h2>
          <p className="mt-3 text-base leading-7 text-[#6b6b70]">
            If you cannot find what you are looking for, reach out to the event organizer directly. They manage ticket sales and entry.
          </p>
        </div>
      </section>
    </main>
  );
}
