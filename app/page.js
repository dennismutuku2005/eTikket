"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { fetchPublicEvents } from "@/lib/events-client";
import { BACKEND_URL } from "@/lib/api";

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

function getImageSrc(event) {
  if (event.cover_image_url) return `${BACKEND_URL}${event.cover_image_url}`;
  if (event.cover_image_base64) return event.cover_image_base64;
  if (event.image) return event.image;
  return null;
}

function EventCard({ event }) {
  const imageSrc = getImageSrc(event);
  const price = event.price_label || event.price || "Free";
  const status = event.status || "Live";
  const dateStr = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
    : event.shortDate || event.date || "—";
  const locationStr = event.venue || event.location || "Location TBA";

  return (
    <Link href={`/events/${event.slug || event.id}`} className="group rounded-[20px] border border-[#ececec] bg-white p-3 transition hover:shadow-lg">
      <div className="relative aspect-16/10 overflow-hidden rounded-[20px] bg-[#f4f4f5] border border-[#ececec] flex items-center justify-center">
        {imageSrc ? (
          <>
            <img src={imageSrc} alt={event.title} className={`h-full w-full object-cover ${status === "Sold out" ? "grayscale" : ""}`} />
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/45" />
          </>
        ) : (
          <div className="text-center text-[#6b6b70]">
            <p className="text-xs font-bold text-[#0f0f10]">No cover image</p>
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-3.5 py-1.5 text-xs font-bold ${status === "Sold out" ? "bg-[#a3a3a8] text-white" : "bg-white text-[#f33959]"}`}>{status}</span>
        <span className="absolute right-3 top-3 rounded-full bg-[#111113] px-3.5 py-1.5 text-xs font-bold text-white">{price}</span>
      </div>
      <div className="p-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">{event.category}</p>
        <h3 className="mt-1 text-xl font-bold leading-tight text-[#0f0f10]">{event.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#6b6b70] line-clamp-2">{event.description || "No description provided."}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#6b6b70]">
          <span className="rounded-full bg-[#f4f4f5] px-3 py-1">{dateStr}</span>
          <span className="rounded-full bg-[#f4f4f5] px-3 py-1">{locationStr}</span>
          {event.remaining_tickets !== undefined && (
            <span className="rounded-full bg-[#f4f4f5] px-3 py-1">{event.remaining_tickets} remaining</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const payload = await fetchPublicEvents({ page: 1, limit: 12 });
        const list = Array.isArray(payload?.data) ? payload.data : [];
        setEvents(list);
      } catch (err) {
        console.warn("Failed to fetch homepage events:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <PublicHeader />

      <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-24">
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

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-base font-bold text-[#f33959]">Popular now</p>
            <h2 className="mt-1 text-3xl font-bold">Events people are booking</h2>
          </div>
          <Link href="/events" className="rounded-full bg-white border border-[#ececec] px-4 py-2 text-sm font-bold text-[#0f0f10] hover:bg-[#f4f4f5]">View all</Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-[20px] bg-[#f4f4f5]" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[24px] border border-[#ececec] bg-white p-12 text-center">
            <p className="text-4xl">🎟️</p>
            <p className="mt-3 text-xl font-bold text-[#0f0f10]">No events published yet</p>
            <p className="mt-2 text-sm text-[#6b6b70]">Events created by organizers will automatically show up here live.</p>
            <Link href="/organizer/events/createnew" className="mt-6 inline-flex rounded-full bg-[#f33959] px-6 py-3 text-sm font-bold text-white hover:bg-[#d92847]">
              Create an event
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id || event.slug} event={event} />
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#111113] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-6 pt-14 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Image src="/eTikket.png" alt="eTikket" width={170} height={52} className="h-auto w-40" />
              <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/60">
                Event ticketing for Kenya with guest checkout, M-Pesa payments, and QR tickets.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase text-white/40">Explore</h3>
              <div className="mt-5 grid gap-3.5 text-[15px] text-white/70">
                <Link href="/events" className="transition-colors hover:text-white">Events</Link>
                <Link href="/holiday" className="transition-colors hover:text-white">Holidays</Link>
                <Link href="/organizer/login" className="transition-colors hover:text-white">Sell your events</Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase text-white/40">Support</h3>
              <div className="mt-5 grid gap-3.5 text-[15px] text-white/70">
                <Link href="/help" className="transition-colors hover:text-white">Help center</Link>
                <Link href="/help/buying-tickets" className="transition-colors hover:text-white">Buying tickets</Link>
                <Link href="/help/selling-events" className="transition-colors hover:text-white">Selling events</Link>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} eTikket. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-white/40">
              <Link href="/privacy-policy" className="transition-colors hover:text-white/70">Privacy</Link>
              <Link href="/terms" className="transition-colors hover:text-white/70">Terms</Link>
              <Link href="/contact" className="transition-colors hover:text-white/70">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}