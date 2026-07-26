import Image from "next/image";
import Link from "next/link";
import TicketSelector from "@/components/ticket-selector";
import { getPublicEvent, publicEvents } from "@/lib/public-events";

export function generateStaticParams() {
  return publicEvents.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = getPublicEvent(slug);
  const isSoldOut = event.status === "Sold out";

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/events" className="rounded-full px-4 py-2 text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10]">Events</Link>
            <Link href="/holiday" className="rounded-full px-4 py-2 text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10]">Holidays</Link>
            <Link href="/help" className="hidden rounded-full px-4 py-2 text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10] sm:inline-flex">Help</Link>
            <Link href="/login" className="rounded-full border border-[#ececec] px-4 py-2 hover:bg-[#f4f4f5]">Login</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-[#111113]">
            <Image src={event.image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 620px" className={`object-cover ${isSoldOut ? "grayscale" : ""}`} />
            <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/10 to-black/60" />
            <div className={`absolute left-4 top-4 rounded-full px-5 py-2 text-base font-bold ${isSoldOut ? "bg-[#a3a3a8] text-white" : "bg-white text-[#f33959]"}`}>{event.status}</div>
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
              {[["Date", event.date], ["Time", event.time], ["Location", event.location]].map(([label, value]) => (
                <div key={label} className="rounded-[14px] bg-[#f4f4f5] p-4">
                  <p className="font-bold">{label}</p>
                  <p className="mt-1 text-[#6b6b70]">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-base text-[#6b6b70]">
              Hosted by <span className="font-bold text-[#0f0f10]">{event.host}</span>
            </p>
          </div>
        </div>

        {isSoldOut ? (
          <div className="rounded-[20px] border border-[#ececec] bg-white p-6">
            <div className="rounded-[20px] bg-[#f4f4f5] p-6 text-center">
              <p className="text-5xl font-bold text-[#a3a3a8]">Sold out</p>
              <p className="mt-3 text-lg leading-8 text-[#6b6b70]">This event has 0 tickets remaining. Browse more events for available ticket classes.</p>
              <Link href="/events" className="mt-5 inline-flex rounded-full bg-[#f33959] px-5 py-3 text-base font-bold text-white hover:bg-[#d92847]">View more events</Link>
            </div>
          </div>
        ) : (
          <TicketSelector event={event} />
        )}
      </section>
    </main>
  );
}