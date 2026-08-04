"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiEye } from "react-icons/fi";
import AppShell from "@/components/app-shell";
import { OrganizerTable } from "@/components/organizer-table";
import EventDetailsModal from "@/components/event-details-modal";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";
import { toast } from "sonner";

export default function SoldOutEventsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  useEffect(() => {
    const clientSession = getClientSession();
    if (!clientSession) { router.replace("/organizer/login"); return; }
    if (clientSession.role !== "organizer") { router.replace(getRoleHomePath(clientSession.role)); return; }
    setSession(clientSession);

    (async () => {
      try {
        const data = await apiRequestAuth("/events/mine", clientSession.token);
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err instanceof AuthError) { handleAuthError("organizer"); return; }
        toast.error("Failed to load sold out events.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (!session) return null;

  const soldOutEvents = events.filter((e) => e.status === "Sold out" || e.remaining_tickets === 0);

  return (
    <AppShell
      role="Organizer"
      title="Sold out events"
      subtitle="Review events that are full and ready for waitlists or added capacity from your database."
    >
      {activeModalEvent && (
        <EventDetailsModal event={activeModalEvent} onClose={() => setActiveModalEvent(null)} />
      )}

      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="card">
            <p className="text-sm font-bold text-[#6b6b70]">Sold out events</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : soldOutEvents.length}</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold text-[#6b6b70]">Total events</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : events.length}</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold text-[#6b6b70]">Events ready for relaunch</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : soldOutEvents.length}</p>
          </div>
        </div>

        <OrganizerTable
          title="Sold out events"
          description="Track fully booked headline events from your organizer account."
        >
          <thead className="bg-[#fafafa] text-[#6b6b70]">
            <tr>
              <th className="px-5 py-3.5 text-left font-bold">Event</th>
              <th className="px-5 py-3.5 text-left font-bold">Date</th>
              <th className="px-5 py-3.5 text-left font-bold">Location</th>
              <th className="px-5 py-3.5 text-left font-bold">Remaining</th>
              <th className="px-5 py-3.5 text-left font-bold">Status</th>
              <th className="px-5 py-3.5 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-[#6b6b70]">Loading events…</td>
              </tr>
            ) : soldOutEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-3xl">🎉</p>
                  <p className="mt-3 font-bold text-[#0f0f10]">No sold out events</p>
                  <p className="mt-1 text-sm text-[#6b6b70]">None of your events are currently sold out.</p>
                </td>
              </tr>
            ) : (
              soldOutEvents.map((event) => (
                <tr
                  key={event.id}
                  className="group border-t border-[#ececec] transition hover:bg-[#f4f4f5]"
                >
                  <td className="px-5 py-4 cursor-pointer" onClick={() => setActiveModalEvent(event)}>
                    <div className="font-bold text-[#0f0f10]">{event.title}</div>
                    <div className="mt-0.5 text-xs text-[#6b6b70]">{event.category}</div>
                  </td>
                  <td className="px-5 py-4 text-[#6b6b70] text-sm">{event.event_date ? new Date(event.event_date).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-4 text-[#6b6b70] text-sm">{event.venue}</td>
                  <td className="px-5 py-4 font-bold text-[#f33959]">0 remaining</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-bold text-[#6b6b70]">
                      {event.status || "Sold out"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModalEvent(event)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3 py-1 text-xs font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                      >
                        <FiEye className="h-3.5 w-3.5 text-[#f33959]" />
                        Quick View
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/organizer/events/${event.slug || event.id}`)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#111113] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#0f0f10]"
                      >
                        <FiArrowRight className="h-3.5 w-3.5" />
                        Page
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </OrganizerTable>
      </div>
    </AppShell>
  );
}
