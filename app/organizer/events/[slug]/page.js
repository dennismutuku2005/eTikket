import Image from "next/image";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { publicEvents } from "@/lib/public-events";

export function generateStaticParams() {
  return publicEvents.map((event) => ({ slug: event.slug }));
}

export default async function OrganizerEventDetailPage({ params }) {
  const { slug } = await params;
  const event = publicEvents.find((item) => item.slug === slug) || publicEvents[0];
  const coordinates = event.mapCoordinates ?? { lat: -1.2921, lng: 36.8219 };

  return (
    <AppShell
      role="Organizer"
      title={event.title}
      subtitle="Review event details, ticket activity, and publishing status."
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[20px] bg-[#111113] relative aspect-16/10">
            <Image src={event.image} alt={event.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/50" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Views", event.views, "page views"],
              ["Orders", event.orders, "orders placed"],
              ["Tickets sold", event.ticketsSold, "tickets purchased"],
            ].map(([label, value, subtitle]) => (
              <div key={String(label)} className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{label}</p>
                <p className="mt-2 text-3xl font-bold text-[#0f0f10]">{value}</p>
                <p className="mt-1 text-xs text-[#6b6b70]">{subtitle}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-bold uppercase text-[#6b6b70]">
                {event.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${event.status === "Sold out" ? "bg-[#f4f4f5] text-[#6b6b70]" : "bg-[#f33959]/10 text-[#f33959]"}`}>
                {event.status}
              </span>
              <span className="rounded-full bg-[#111113] px-3 py-1 text-xs font-bold text-white">
                {event.price}
              </span>
            </div>
            <p className="text-sm leading-7 text-[#6b6b70]">{event.longDescription || event.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Date", `${event.date} · ${event.time}`],
              ["Location", event.location],
              ["Host", event.host],
              ["Remaining", `${event.remainingTickets} tickets`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[16px] border border-[#ececec] bg-[#fafafa] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{label}</p>
                <p className="mt-1 text-sm font-bold text-[#0f0f10]">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-bold text-[#0f0f10]">Ticket classes</p>
                <p className="mt-0.5 text-xs text-[#6b6b70]">Classes and current availability</p>
              </div>
              {event.isEditable ? (
                <Link href={`/organizer/events/${event.slug}/edit`} className="rounded-full bg-[#f33959] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#d92847]">
                  Edit event
                </Link>
              ) : (
                <span className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-bold text-[#6b6b70]">Not editable</span>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {event.tickets.length > 0 ? (
                event.tickets.map((ticket) => (
                  <div key={ticket.name} className="rounded-[16px] border border-[#ececec] bg-[#fafafa] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#0f0f10]">{ticket.name}</p>
                        <p className="mt-0.5 text-xs text-[#6b6b70]">{ticket.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#f33959]">KSh {ticket.price.toLocaleString()}</p>
                        <p className="mt-0.5 text-xs text-[#6b6b70]">{ticket.available} available</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6b6b70]">No ticket classes have been added yet.</p>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Google Maps pin</p>
            <div className="mt-3 rounded-[16px] border border-[#ececec] bg-[#fafafa] p-4 text-sm text-[#6b6b70]">
              <p className="font-bold text-[#0f0f10]">{event.mapLabel || event.location}</p>
              <p className="mt-1 text-xs">Lat: {coordinates.lat.toFixed(5)} | Lng: {coordinates.lng.toFixed(5)}</p>
              <div className="mt-3 rounded-[14px] bg-white p-4 border border-[#ececec]">
                <p className="font-bold text-[#0f0f10] text-xs">Map pin preview</p>
                <p className="mt-1 text-xs text-[#6b6b70]">Venue pin verified for public map directions.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Event actions</p>
            <div className="mt-4 space-y-3">
              <Link href={`/organizer/events/${event.slug}/edit`} className="block rounded-full bg-[#f33959] px-4 py-2.5 text-sm font-bold text-white text-center transition hover:bg-[#d92847]">
                {event.isEditable ? "Edit event details" : "View event settings"}
              </Link>
              <button type="button" className="w-full rounded-full border border-[#ececec] bg-white px-4 py-2.5 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]">
                {event.isPast ? "View analytics" : "Publish event"}
              </button>
              <button type="button" className="w-full rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2.5 text-sm font-bold text-[#6b6b70] transition hover:bg-[#f4f4f5]">
                {event.isPast ? "Archived" : "Archive event"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
