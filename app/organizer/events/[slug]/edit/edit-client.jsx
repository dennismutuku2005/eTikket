"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AppShell from "@/components/app-shell";
import EventBuilderForm from "@/components/event-builder-form";
import { FiArrowLeft } from "react-icons/fi";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";
import { toast } from "sonner";

export default function EditEventClient() {
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
        toast.error("Event not found or access denied.");
        router.replace("/organizer/events");
      } finally {
        setLoading(false);
      }
    })();
  }, [router, params?.slug]);

  if (!session) return null;

  return (
    <AppShell
      role="Organizer"
      title="Edit event"
      subtitle="Update your event details, change the cover image, and publish or save as draft."
    >
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-white px-4 py-2 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
        >
          <FiArrowLeft size={14} />
          Back to events
        </button>
      </div>

      <div className="card-lg">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-[14px] bg-[#f4f4f5]" />
            ))}
          </div>
        ) : event ? (
          <EventBuilderForm
            eventToEdit={event}
            onSaved={() => router.push("/organizer/events")}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
