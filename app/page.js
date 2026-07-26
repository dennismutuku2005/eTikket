import Image from "next/image";
import Link from "next/link";
import { publicEvents } from "@/lib/public-events";

function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#ececec] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <nav className="flex items-center gap-5">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <div className="hidden items-center gap-1 rounded-full bg-[#f4f4f5] p-1 text-sm font-semibold text-[#6b6b70] sm:flex">
            <Link href="/events" className="rounded-full bg-white px-4 py-2 text-[#0f0f10] shadow-[0_2px_8px_rgba(15,15,16,0.06)]">Events</Link>
            <Link href="/holiday" className="rounded-full px-4 py-2 transition hover:text-[#0f0f10]">Holidays</Link>
          </div>
        </nav>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link href="/help" className="hidden rounded-full px-3 py-2 text-[#6b6b70] transition hover:bg-[#f4f4f5] hover:text-[#0f0f10] sm:inline-flex">Help</Link>
          <Link href="/login" className="rounded-full border border-[#ececec] px-4 py-2 transition hover:bg-[#f4f4f5]">Login</Link>
          <Link href="/organizer" className="rounded-full bg-[#f33959] px-4 py-2 text-white transition hover:bg-[#d92847]">Sell your events</Link>
        </div>
      </div>
    </header>
  );
}

function EventCard({ event, featured = false }) {
  return (
    <Link href={`/events/${event.slug}`} className={`group rounded-[20px] border border-[#ececec] bg-white p-3 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,15,16,0.12)] ${featured ? "grid gap-4 sm:grid-cols-[0.9fr_1.1fr]" : ""}`}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#111113]">
        <Image src={event.image} alt="" fill sizes="(max-width: 768px) 100vw, 420px" className={`object-cover transition duration-300 group-hover:scale-105 ${event.status === "Sold out" ? "grayscale" : ""}`} />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/45" />
        <span className={`absolute left-3 top-3 rounded-full px-4 py-2 text-sm font-bold ${event.status === "Sold out" ? "bg-[#a3a3a8] text-white" : "bg-white text-[#f33959]"}`}>{event.status}</span>
        <span className="absolute right-3 top-3 rounded-full bg-[#111113] px-4 py-2 text-sm font-bold text-white">{event.price}</span>
      </div>
      <div className="p-2">
        <p className="text-sm font-bold text-[#f33959]">{event.category}</p>
        <h3 className="mt-1 text-2xl font-bold leading-tight">{event.title}</h3>
        <p className="mt-3 text-base leading-7 text-[#6b6b70]">{event.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-[#6b6b70]">
          <span className="rounded-full bg-[#f4f4f5] px-3 py-1.5">{event.shortDate}</span>
          <span className="rounded-full bg-[#f4f4f5] px-3 py-1.5">{event.location}</span>
          <span className="rounded-full bg-[#f4f4f5] px-3 py-1.5">{event.going}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [heroEvent, ...events] = publicEvents;

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <PublicHeader />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-[#fde8ec] px-5 py-2.5 text-base font-semibold text-[#d92847]">Guest checkout, M-Pesa, QR tickets</p>
            <h1 className="mt-5 max-w-xl text-5xl font-bold leading-tight sm:text-6xl">Discover clean, real events around Kenya.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#6b6b70]">Browse events without logging in. Open an event, choose your ticket class, pay, and get a QR ticket for entry.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/events" className="rounded-full bg-[#f33959] px-6 py-3 text-base font-bold text-white transition hover:bg-[#d92847]">Browse events</Link>
              <Link href="/holiday" className="rounded-full border border-[#ececec] bg-white px-6 py-3 text-base font-bold transition hover:bg-[#f4f4f5]">Holiday plans</Link>
            </div>
          </div>
          <EventCard event={heroEvent} featured />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-base font-bold text-[#f33959]">Popular now</p>
            <h2 className="mt-1 text-3xl font-bold">Events people are booking</h2>
          </div>
          <Link href="/events" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#f33959]">View all</Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </section>

      <section className="border-y border-[#ececec] bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-7 sm:grid-cols-3 sm:px-6">
          {["Search and compare events", "Choose ticket classes", "Checkout without login"].map((item) => (
            <div key={item} className="rounded-[14px] bg-[#fafafa] p-5">
              <h3 className="text-lg font-bold">{item}</h3>
              <p className="mt-2 text-base leading-6 text-[#6b6b70]">A focused public flow for buyers, with organizer tools only when someone wants to sell.</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#111113] text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-[1.2fr_0.8fr_0.8fr] sm:px-6">
          <div>
            <Image src="/eTikketwhite.png" alt="eTikket" width={170} height={52} className="h-auto w-36" />
            <p className="mt-4 max-w-sm text-base leading-7 text-white/70">Event ticketing for Kenya with guest checkout, M-Pesa payments, and QR tickets.</p>
          </div>
          <div>
            <h3 className="text-base font-bold">Explore</h3>
            <div className="mt-3 grid gap-2 text-white/70">
              <Link href="/events">Events</Link>
              <Link href="/holiday">Holidays</Link>
              <Link href="/organizer">Sell your events</Link>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold">Support</h3>
            <div className="mt-3 grid gap-2 text-white/70">
              <Link href="/help">Help center</Link>
              <Link href="/help/buying-tickets">Buying tickets</Link>
              <Link href="/help/selling-events">Selling events</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
