"use client";

import Image from "next/image";

export default function EventDetailsModal({ event, onClose }) {
  const coordinates = event.mapCoordinates ?? { lat: -1.2921, lng: 36.8219 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-slate-950/60 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Event details</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{event.title}</h2>
            <p className="mt-2 text-sm text-slate-600">Tap a ticket class to review availability and pricing.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.75fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[1.75rem] bg-slate-100">
              <div className="relative h-72 w-full">
                <Image
                  src={event.image || "/sideimage.png"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{event.category} • {event.status}</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{event.price}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{event.longDescription || event.description}</p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tickets</p>
              <div className="mt-4 space-y-3">
                {event.tickets.length > 0 ? (
                  event.tickets.map((ticket) => (
                    <div key={ticket.name} className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{ticket.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{ticket.description}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">KSh {ticket.price}</p>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">Available: {ticket.available}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No ticket classes added for this event.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Event info</p>
              <dl className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-900">Date & time</dt>
                  <dd className="mt-1">{event.date} · {event.time}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Location</dt>
                  <dd className="mt-1">{event.location}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Host</dt>
                  <dd className="mt-1">{event.host}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Remaining stock</dt>
                  <dd className="mt-1">{event.remainingTickets}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Google Maps pin</p>
              <div className="mt-4 space-y-3 rounded-[1.5rem] bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{event.location}</p>
                <p className="text-sm text-slate-500">Latitude {coordinates.lat.toFixed(5)}</p>
                <p className="text-sm text-slate-500">Longitude {coordinates.lng.toFixed(5)}</p>
                <div className="mt-4 rounded-3xl bg-slate-950/5 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Map pin preview</p>
                  <p className="mt-2">This is a placeholder for the venue pin on Google Maps.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
