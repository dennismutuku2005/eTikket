"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { FiEdit2, FiPlus, FiTrash2, FiLoader } from "react-icons/fi";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError, BACKEND_URL } from "@/lib/api";
import { toast } from "sonner";

const STATUS_COLORS = {
  Live: "bg-emerald-50 text-emerald-700",
  Draft: "bg-[#f4f4f5] text-[#6b6b70]",
  "Sold out": "bg-[#f4f4f5] text-[#6b6b70]",
  "Selling fast": "bg-amber-50 text-amber-700",
  New: "bg-blue-50 text-blue-700",
};

function getImageSrc(event) {
  if (!event) return null;
  if (event.cover_image_url) return `${BACKEND_URL}${event.cover_image_url}`;
  if (event.cover_image_base64) return event.cover_image_base64;
  return null;
}

export default function OrganizerEventsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadEvents = useCallback(async (token) => {
    try {
      const data = await apiRequestAuth("/events/mine", token);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof AuthError) { handleAuthError("organizer"); return; }
      toast.error(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const clientSession = getClientSession();
    if (!clientSession) { router.replace("/organizer/login"); return; }
    if (clientSession.role !== "organizer") { router.replace(getRoleHomePath(clientSession.role)); return; }
    setSession(clientSession);
    loadEvents(clientSession.token);
  }, [router, loadEvents]);

  async function handleDelete(eventId, eventTitle) {
    if (!confirm(`Delete "${eventTitle}"? This cannot be undone.`)) return;
    setDeletingId(eventId);
    try {
      await apiRequestAuth(`/events/${eventId}`, session.token, { method: "DELETE" });
      toast.success("Event deleted.");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      if (err instanceof AuthError) { handleAuthError("organizer"); return; }
      toast.error(err.message || "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!session) return null;

  const liveCount = events.filter((e) => e.status !== "Draft" && e.status !== "Sold out").length;
  const draftCount = events.filter((e) => e.status === "Draft").length;
  const soldOutCount = events.filter((e) => e.status === "Sold out").length;

  return (
    <AppShell
      role="Organizer"
      title="Events"
      subtitle="Create, edit and delete your events. Images are saved and served from the backend."
    >
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="text-sm font-bold text-[#6b6b70]">Live events</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : liveCount}</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold text-[#6b6b70]">Draft events</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : draftCount}</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold text-[#6b6b70]">Sold out</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : soldOutCount}</p>
          </div>
        </div>

        {/* Events list */}
        <div className="card-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">Your events</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">Manage all events you have created.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/organizer/events/createnew")}
              className="btn-clean btn-primary inline-flex items-center gap-2"
            >
              <FiPlus size={16} />
              Create event
            </button>
          </div>

          {loading ? (
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-[18px] bg-[#f4f4f5]" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-4xl">🎟️</p>
              <p className="mt-4 text-lg font-bold text-[#0f0f10]">No events yet</p>
              <p className="mt-2 text-sm text-[#6b6b70]">Create your first event to get started.</p>
              <button
                type="button"
                onClick={() => router.push("/organizer/events/createnew")}
                className="btn-clean btn-primary mt-6 inline-flex items-center gap-2"
              >
                <FiPlus size={16} />
                Create your first event
              </button>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="clean-table min-w-[700px] w-full">
                <thead className="bg-[#fafafa] text-[#6b6b70]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-bold">Event</th>
                    <th className="px-5 py-3.5 text-left font-bold">Date</th>
                    <th className="px-5 py-3.5 text-left font-bold">Venue</th>
                    <th className="px-5 py-3.5 text-left font-bold">Remaining</th>
                    <th className="px-5 py-3.5 text-left font-bold">Status</th>
                    <th className="px-5 py-3.5 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {getImageSrc(event) ? (
                            <img
                              src={getImageSrc(event)}
                              alt={event.title}
                              className="h-10 w-14 rounded-[10px] object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-14 rounded-[10px] bg-[#f4f4f5] border border-[#ececec] flex items-center justify-center text-[10px] font-bold text-[#6b6b70] flex-shrink-0">
                              No image
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#0f0f10] leading-tight">{event.title}</p>
                            <p className="mt-0.5 text-xs text-[#6b6b70]">{event.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#6b6b70] text-sm">{event.event_date ? new Date(event.event_date).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-4 text-[#6b6b70] text-sm">{event.venue}</td>
                      <td className="px-5 py-4">
                        {Number(event.total_tickets) === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                            Set up tickets
                          </span>
                        ) : Number(event.remaining_tickets) === 0 ? (
                          <span className="font-bold text-[#f33959]">Sold out</span>
                        ) : (
                          <span className="font-bold text-[#0f0f10]">{event.remaining_tickets} / {event.total_tickets}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[event.status] || "bg-[#f4f4f5] text-[#6b6b70]"}`}>
                          {event.status || "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/organizer/events/${event.slug || event.id}/edit`)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-xs font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                          >
                            <FiEdit2 size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(event.id, event.title)}
                            disabled={deletingId === event.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#f33959]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#f33959] transition hover:bg-[#fff2f4] disabled:opacity-50"
                          >
                            {deletingId === event.id ? <FiLoader size={12} className="animate-spin" /> : <FiTrash2 size={12} />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
