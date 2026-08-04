"use client";

import { useEffect, useState } from "react";
import { apiRequest, BACKEND_URL } from "@/lib/api";
import EventMap from "@/components/event-map";
import { FiLoader } from "react-icons/fi";

export default function EventDetailsModal({ event, onClose }) {
  const [tickets, setTickets] = useState(event.tickets || []);
  const [loadingTickets, setLoadingTickets] = useState(!event.tickets || event.tickets.length === 0);

  const venue = event.venue || event.location || "Venue TBA";
  const category = event.category || "General";
  const status = event.status || "Live";
  const priceLabel = event.price_label || event.price || "Free";
  const description = event.description || event.longDescription || "No description provided.";
  const dateStr = event.event_date ? new Date(event.event_date).toLocaleDateString() : (event.date || "—");
  const timeStr = event.event_time || event.time || "—";
  const hostName = event.host_name || event.host || "Organizer";
  const lat = Number(event.latitude || event.mapCoordinates?.lat || -1.2921);
  const lng = Number(event.longitude || event.mapCoordinates?.lng || 36.8219);

  const remaining = event.remaining_tickets ?? event.remainingTickets;
  const total = event.total_tickets ?? event.totalTickets;

  // Load ticket types from database for this event
  useEffect(() => {
    if (!event?.id) return;
    apiRequest(`/event-ticket-types/${event.id}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setTickets(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingTickets(false));
  }, [event?.id]);

  const coverImageSrc = event.cover_image_url
    ? `${BACKEND_URL}${event.cover_image_url}`
    : event.cover_image_base64 || event.image || null;

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
            <div className="overflow-hidden rounded-[20px] bg-[#f4f4f5] border border-[#ececec] relative aspect-video flex items-center justify-center">
              {coverImageSrc ? (
                <>
                  <img
                    src={coverImageSrc}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/50" />
                </>
              ) : (
                <div className="text-center text-[#6b6b70]">
                  <p className="text-sm font-bold text-[#0f0f10]">No cover image uploaded</p>
                </div>
              )}
            </div>

            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Overview</p>
                  <h3 className="mt-1 text-lg font-bold text-[#0f0f10]">{category} • {status}</h3>
                </div>
                <span className="rounded-full bg-[#f33959] px-3 py-1 text-xs font-bold text-white">{priceLabel}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b6b70]">{description}</p>
            </div>

            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Tickets</p>
              <div className="mt-4 space-y-3">
                {loadingTickets ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6b6b70]">
                    <FiLoader size={14} className="animate-spin text-[#f33959]" />
                    Loading ticket tiers…
                  </div>
                ) : tickets && tickets.length > 0 ? (
                  tickets.map((ticket, index) => (
                    <div key={ticket.id || index} className="rounded-[16px] border border-[#ececec] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#0f0f10]">{ticket.name}</p>
                          <p className="mt-1 text-xs text-[#6b6b70]">{ticket.description || "Standard ticket"}</p>
                        </div>
                        <p className="text-sm font-bold text-[#f33959]">
                          KSh {Number(ticket.price || 0).toLocaleString()}
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-[#6b6b70]">
                        Capacity: {ticket.available_quantity ?? ticket.available ?? 0} tickets
                      </p>
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
                  <dd className="mt-1">{dateStr} · {timeStr}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Location</dt>
                  <dd className="mt-1">{venue}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Host</dt>
                  <dd className="mt-1">{hostName}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Capacity & remaining</dt>
                  <dd className="mt-1 font-bold text-[#0f0f10]">
                    {total === undefined || Number(total) === 0
                      ? "No ticket tiers set"
                      : `${remaining ?? 0} / ${total} remaining`}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Location pin</p>
              <div className="mt-3">
                <EventMap
                  lat={lat}
                  lng={lng}
                  venue={venue}
                  editable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
