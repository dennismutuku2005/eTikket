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
          <div className="overflow-hidden rounded-[1.75rem] bg-slate-100">
            <div className="relative h-80 w-full">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Views", event.views, "page views"],
              ["Orders", event.orders, "orders placed"],
              ["Tickets sold", event.ticketsSold, "tickets purchased"],
            ].map(([label, value, subtitle]) => (
              <div key={String(label)} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {event.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${event.status === "Sold out" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                {event.status}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {event.price}
              </span>
            </div>
            <p className="text-sm leading-7 text-slate-600">{event.longDescription || event.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Date", `${event.date} · ${event.time}`],
              ["Location", event.location],
              ["Host", event.host],
              ["Remaining", `${event.remainingTickets} tickets`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Tickets</p>
                <p className="mt-1 text-sm text-slate-500">Classes and availability</p>
              </div>
              {event.isEditable ? (
                <Link href={`/organizer/events/${event.slug}/edit`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Edit event
                </Link>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Not editable</span>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {event.tickets.length > 0 ? (
                event.tickets.map((ticket) => (
                  <div key={ticket.name} className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{ticket.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{ticket.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">KSh {ticket.price}</p>
                        <p className="mt-1 text-xs text-slate-500">{ticket.available} available</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No ticket classes have been added yet.</p>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Google Maps pin</p>
            <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{event.mapLabel || event.location}</p>
              <p className="mt-2">Latitude {coordinates.lat.toFixed(5)}</p>
              <p>Longitude {coordinates.lng.toFixed(5)}</p>
              <div className="mt-4 h-56 rounded-3xl bg-slate-950/5 p-4">
                <p className="font-semibold text-slate-900">Map preview</p>
                <p className="mt-2 text-sm text-slate-500">This preview represents the venue pin location for the event.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Event actions</p>
            <div className="mt-4 space-y-3">
              <Link href={`/organizer/events/${event.slug}/edit`} className="block rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-slate-800">
                {event.isEditable ? "Edit event details" : "View event settings"}
              </Link>
              <button type="button" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                {event.isPast ? "View analytics" : "Publish event"}
              </button>
              <button type="button" className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                {event.isPast ? "Archived" : "Archive event"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
