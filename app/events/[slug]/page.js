import Image from "next/image";
import Link from "next/link";
import TicketSelector from "@/components/ticket-selector";
import ShareEvent from "@/components/share-event";
import { getPublicEvent, publicEvents } from "@/lib/public-events";
import { PublicHeader } from "@/components/PublicHeader";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return publicEvents.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params; // ✅ Await params
  const event = getPublicEvent(slug);
  
  // Handle case where event doesn't exist
  if (!event) {
    notFound();
  }
  
  const isSoldOut = event.status === "Sold out";

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <PublicHeader />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-[#111113]">
            <Image
              src={event.image}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className={`object-cover ${isSoldOut ? "grayscale" : ""}`}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/10 to-black/60" />
            <div className={`absolute left-4 top-4 rounded-full px-5 py-2 text-base font-bold ${isSoldOut ? "bg-[#a3a3a8] text-white" : "bg-white text-[#f33959]"}`}>
              {event.status}
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-[#111113] px-5 py-2 text-base font-bold text-white">
              {event.remainingTickets} remaining
            </div>
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-base font-bold text-white/80">{event.category}</p>
              <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">{event.title}</h1>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
            <p className="text-lg leading-8 text-[#6b6b70]">{event.longDescription}</p>
            <div className="mt-5 grid gap-3 text-base sm:grid-cols-3">
              {[
                ["Date", event.date],
                ["Time", event.time],
                ["Location", event.location],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[14px] bg-[#f4f4f5] p-4">
                  <p className="font-bold">{label}</p>
                  <p className="mt-1 text-[#6b6b70]">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-base text-[#6b6b70]">
              Hosted by <span className="font-bold text-[#0f0f10]">{event.host}</span>
            </p>

            {/* Map */}
            <div className="mt-5 overflow-hidden rounded-[14px] border border-[#ececec]">
              <div className="relative h-56 w-full">
                <iframe
                  title={`Map showing ${event.location}`}
                  src={`https://maps.google.com/maps?q=${event.mapLat},${event.mapLng}&z=15&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              {/* ✅ Fixed: Added the opening <a> tag */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${event.mapLat},${event.mapLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#f4f4f5] p-4 transition hover:bg-[#ececec]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f33959] text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M12 21s-7-6.1-7-11.4A7 7 0 0 1 19 9.6C19 14.9 12 21 12 21z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="9.6" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">{event.location}</p>
                  <p className="text-sm text-[#6b6b70]">Open in Google Maps</p>
                </div>
              </a>
            </div>
          </div>

          <ShareEvent title={event.title} />
        </div>

        {/* Ticket stub */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[24px] border border-[#ececec] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]">

            {/* Stub head: event recap, styled like the info printed at the top of a ticket */}
            <div className="flex items-center justify-between gap-4 p-6">
              <div>
                <p className="text-xs font-bold text-[#a3a3a8]">
                  Admit one
                </p>
                <h2 className="mt-1 text-xl font-bold leading-snug">{event.title}</h2>
                <p className="mt-1 text-sm text-[#6b6b70]">
                  {event.date} · {event.time}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-[#a3a3a8]">Venue</p>
                <p className="mt-1 max-w-[9rem] text-sm font-bold leading-snug">{event.location}</p>
              </div>
            </div>

            {/* Perforation / tear line, with circular notches cut into both edges */}
            <div className="relative">
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#fafafa]" />
              <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#fafafa]" />
              <div className="mx-6 border-t-2 border-dashed border-[#e2e2e4]" />
            </div>

            {/* Stub body: the actual ticket selector */}
            <div className="">
              {isSoldOut ? (
                <div className="rounded-[16px] bg-[#f4f4f5] pt-4 text-center">
                  <p className="text-4xl font-bold text-[#a3a3a8]">Sold out</p>
                  <p className="mt-3 text-base leading-7 text-[#6b6b70]">
                    This event has 0 tickets remaining. Browse more events for available ticket classes.
                  </p>
                  <Link
                    href="/events"
                    className="mt-5 inline-flex rounded-full bg-[#f33959] px-5 py-3 text-base font-bold text-white hover:bg-[#d92847]"
                  >
                    View more events
                  </Link>
                </div>
              ) : (
                <TicketSelector event={event} />
              )}
            </div>

            {/* Barcode footer, only reads as a real ticket if there's something to redeem */}
            {!isSoldOut && (
              <div className="flex items-center justify-between gap-4 border-t border-[#ececec] bg-[#fafafa] px-6 py-4">
                <p className="text-xs font-bold text-[#a3a3a8]">
                  {event.remainingTickets} left
                </p>
                <div
                  className="h-8 flex-1 max-w-[180px] opacity-70"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, #0f0f10 0 2px, transparent 2px 5px, #0f0f10 5px 6px, transparent 6px 10px)",
                  }}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}