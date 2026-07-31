"use client";

import Image from "next/image";

export default function EventDetailsModal({ event, onClose }) {
  const coordinates = event.mapCoordinates ?? { lat: -1.2921, lng: 36.8219 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ececec] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ececec] bg-white/95 backdrop-blur px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">Event details</p>
            <h2 className="mt-1 text-2xl font-bold text-[#0f0f10]">{event.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#ececec] bg-white px-4 py-2 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.75fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[20px] bg-[#111113] relative aspect-16/10">
              <Image
                src={event.image || "/sideimage.png"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/50" />
            </div>

            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Overview</p>
                  <h3 className="mt-1 text-lg font-bold text-[#0f0f10]">{event.category} • {event.status}</h3>
                </div>
                <span className="rounded-full bg-[#f33959] px-3 py-1 text-xs font-bold text-white">{event.price}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b6b70]">{event.longDescription || event.description}</p>
            </div>

            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Tickets</p>
              <div className="mt-4 space-y-3">
                {event.tickets && event.tickets.length > 0 ? (
                  event.tickets.map((ticket) => (
                    <div key={ticket.name} className="rounded-[16px] border border-[#ececec] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#0f0f10]">{ticket.name}</p>
                          <p className="mt-1 text-xs text-[#6b6b70]">{ticket.description}</p>
                        </div>
                        <p className="text-sm font-bold text-[#f33959]">KSh {ticket.price.toLocaleString()}</p>
                      </div>
                      <p className="mt-2 text-xs text-[#6b6b70]">Available: {ticket.available}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6b6b70]">No ticket classes added for this event.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Event info</p>
              <dl className="mt-4 space-y-4 text-sm text-[#6b6b70]">
                <div>
                  <dt className="font-bold text-[#0f0f10]">Date & time</dt>
                  <dd className="mt-1">{event.date} · {event.time}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Location</dt>
                  <dd className="mt-1">{event.location}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Host</dt>
                  <dd className="mt-1">{event.host}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Remaining stock</dt>
                  <dd className="mt-1">{event.remainingTickets}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Location pin</p>
              <div className="mt-4 space-y-3 rounded-[16px] border border-[#ececec] bg-white p-4">
                <p className="text-sm font-bold text-[#0f0f10]">{event.location}</p>
                <p className="text-xs text-[#6b6b70]">Lat: {coordinates.lat.toFixed(5)} | Lng: {coordinates.lng.toFixed(5)}</p>
                <div className="mt-3 rounded-[14px] bg-[#f4f4f5] p-3 text-xs text-[#6b6b70]">
                  <p className="font-bold text-[#0f0f10]">Map pin preview</p>
                  <p className="mt-1">Venue pin location verified.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
