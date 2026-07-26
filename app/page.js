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
            <Link href="/holiday" className="rounded-full px-4 py-2 text-[#6b6b70] hover:text-[#0f0f10]">Holidays</Link>
          </div>
        </nav>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link href="/help" className="hidden rounded-full px-3 py-2 text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10] sm:inline-flex">Help</Link>
          <Link href="/login" className="rounded-full border border-[#ececec] px-4 py-2 hover:bg-[#f4f4f5]">Login</Link>
          <Link href="/organizer" className="rounded-full bg-[#f33959] px-4 py-2 text-white hover:bg-[#d92847]">Sell your events</Link>
        </div>
      </div>
    </header>
  );
}

// A thin rule that reads as a ticket's tear-perforation — the one
// signature detail carried from the hero into the rest of the page.
function TicketDivider() {
  return (
    <div className="relative my-10 h-px w-full bg-[#ececec] sm:my-14" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-1"
        style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-[#d4d4d8]" />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <Link href={`/events/${event.slug}`} className="group rounded-[20px] border border-[#ececec] bg-white p-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#111113]">
        <Image src={event.image} alt="" fill sizes="(max-width: 768px) 100vw, 420px" className={`object-cover ${event.status === "Sold out" ? "grayscale" : ""}`} />
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
  const events = publicEvents;

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <PublicHeader />

      <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-24">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f33959]">Guest checkout · M-Pesa · QR tickets</p>
        <h1 className="mx-auto mt-5 max-w-2xl text-5xl font-bold leading-[1.05] sm:text-6xl">
          Discover clean, real events around Kenya.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-[#6b6b70]">
          Browse without logging in. Open an event, choose your ticket class, pay, and get a QR ticket for entry.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/events" className="rounded-full bg-[#f33959] px-6 py-3 text-base font-bold text-white hover:bg-[#d92847]">Browse events</Link>
          <Link href="/holiday" className="rounded-full border border-[#ececec] bg-white px-6 py-3 text-base font-bold hover:bg-[#f4f4f5]">Holiday plans</Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <TicketDivider />
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-base font-bold text-[#f33959]">Popular now</p>
            <h2 className="mt-1 text-3xl font-bold">Events people are booking</h2>
          </div>
          <Link href="/events" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#f33959] hover:bg-[#f4f4f5]">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </section>

      <footer className="bg-[#111113] text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-[1.2fr_0.8fr_0.8fr] sm:px-6">
          <div>
            <Image src="/eTikket.png" alt="eTikket" width={170} height={52} className="h-auto w-36" />
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