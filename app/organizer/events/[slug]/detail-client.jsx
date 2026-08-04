"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError, BACKEND_URL } from "@/lib/api";
import EventMap from "@/components/event-map";
import { toast } from "sonner";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

function getImageSrc(event) {
  if (!event) return null;
  if (event.cover_image_url) return `${BACKEND_URL}${event.cover_image_url}`;
  if (event.cover_image_base64) return event.cover_image_base64;
  return null;
}

export default function OrganizerEventDetailClient() {
  const router = useRouter();
  const params = useParams();
  const [session, setSession] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientSession = getClientSession();
    if (!clientSession) { router.replace("/organizer/login"); return; }
    if (clientSession.role !== "organizer") { router.replace(getRoleHomePath(clientSession.role)); return; }
    setSession(clientSession);

    const lookup = params?.slug;
    if (!lookup) return;

    (async () => {
      try {
        const data = await apiRequestAuth(`/events/${lookup}`, clientSession.token);
        setEvent(data);
      } catch (err) {
        if (err instanceof AuthError) { handleAuthError("organizer"); return; }
        toast.error("Event not found.");
        router.replace("/organizer/events");
      } finally {
        setLoading(false);
      }
    })();
  }, [router, params?.slug]);

  if (!session) return null;

  if (loading) {
    return (
      <AppShell role="Organizer" title="Event details" subtitle="Loading event details…">
        <div className="card-lg space-y-4">
          <div className="h-60 animate-pulse rounded-[20px] bg-[#f4f4f5]" />
          <div className="h-20 animate-pulse rounded-[16px] bg-[#f4f4f5]" />
        </div>
      </AppShell>
    );
  }

  if (!event) return null;

  const coordinates = { lat: Number(event.latitude || -1.2921), lng: Number(event.longitude || 36.8219) };

  return (
    <AppShell
      role="Organizer"
      title={event.title}
      subtitle="Review event details, ticket activity, and publishing status from your database."
    >
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-white px-4 py-2 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
        >
          <FiArrowLeft size={14} />
          Back to events
        </button>

        <Link
          href={`/organizer/events/${event.slug || event.id}/edit`}
          className="inline-flex items-center gap-2 rounded-full bg-[#f33959] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d92847]"
        >
          <FiEdit2 size={14} />
          Edit event
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[20px] bg-[#f4f4f5] border border-[#ececec] relative aspect-video flex items-center justify-center">
            {getImageSrc(event) ? (
              <>
                <img
                  src={getImageSrc(event)}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/50" />
              </>
            ) : (
              <div className="text-center text-[#6b6b70]">
                <p className="text-sm font-bold text-[#0f0f10]">No cover image uploaded</p>
                <p className="mt-1 text-xs text-[#6b6b70]">Upload a cover image when editing this event.</p>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Category</p>
              <p className="mt-2 text-xl font-bold text-[#0f0f10]">{event.category}</p>
            </div>
            <div className="card">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Status</p>
              <p className="mt-2 text-xl font-bold text-[#f33959]">{event.status || "Draft"}</p>
            </div>
            <div className="card">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Remaining tickets</p>
              <p className="mt-2 text-xl font-bold text-[#0f0f10]">{event.remaining_tickets ?? "—"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-bold uppercase text-[#6b6b70]">
                {event.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${event.status === "Sold out" ? "bg-[#f4f4f5] text-[#6b6b70]" : "bg-[#f33959]/10 text-[#f33959]"}`}>
                {event.status || "Draft"}
              </span>
              <span className="rounded-full bg-[#111113] px-3 py-1 text-xs font-bold text-white">
                {event.price_label || "Free"}
              </span>
            </div>
            <p className="text-sm leading-7 text-[#6b6b70]">{event.description || "No description provided."}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Date", event.event_date ? new Date(event.event_date).toLocaleDateString() : "—"],
              ["Time", event.event_time || "—"],
              ["Location", event.venue],
              ["Host", event.host_name || "Organizer"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[16px] border border-[#ececec] bg-[#fafafa] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{label}</p>
                <p className="mt-1 text-sm font-bold text-[#0f0f10]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Venue Location Map</p>
            <div className="mt-3">
              <EventMap
                lat={coordinates.lat}
                lng={coordinates.lng}
                venue={event.venue}
                editable={false}
              />
            </div>
          </div>

          <div className="card-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Event actions</p>
            <div className="mt-4 space-y-3">
              <Link href={`/organizer/events/${event.slug || event.id}/edit`} className="block rounded-full bg-[#f33959] px-4 py-2.5 text-sm font-bold text-white text-center transition hover:bg-[#d92847]">
                Edit event details
              </Link>
              <button
                type="button"
                onClick={() => router.push("/organizer/events")}
                className="w-full rounded-full border border-[#ececec] bg-white px-4 py-2.5 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
              >
                Back to all events
              </button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
