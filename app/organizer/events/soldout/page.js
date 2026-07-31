"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiEye } from "react-icons/fi";
import AppShell from "@/components/app-shell";
import { OrganizerTable } from "@/components/organizer-table";
import EventDetailsModal from "@/components/event-details-modal";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { publicEvents } from "@/lib/public-events";

export default function SoldOutEventsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  useEffect(() => {
    const clientSession = getClientSession();

    if (!clientSession) {
      router.replace("/organizer/login");
      return;
    }

    if (clientSession.role !== "organizer") {
      router.replace(getRoleHomePath(clientSession.role));
      return;
    }

    setSession(clientSession);
  }, [router]);

  const soldOutEvents = useMemo(
    () => publicEvents.filter((event) => event.status === "Sold out" || event.isPast),
    [],
  );

  if (!session) {
    return null;
  }

  return (
    <AppShell
      role="Organizer"
      title="Sold out events"
      subtitle="Review events that are full and ready for waitlists or added capacity."
    >
      {activeModalEvent && (
        <EventDetailsModal event={activeModalEvent} onClose={() => setActiveModalEvent(null)} />
      )}

      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-sm font-bold text-[#6b6b70]">Sold out events</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{soldOutEvents.length}</p>
          </div>
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-sm font-bold text-[#6b6b70]">Waitlist capacity</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{soldOutEvents.reduce((sum, event) => sum + (event.remainingTickets ?? 0), 0)}</p>
          </div>
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-sm font-bold text-[#6b6b70]">Events ready for relaunch</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{soldOutEvents.filter((event) => !event.isPast).length}</p>
          </div>
        </div>

        <OrganizerTable
          title="Sold out events"
          description="Track fully booked headline events and see remaining waitlist opportunities."
        >
          <thead className="bg-[#fafafa] text-[#6b6b70]">
            <tr>
              <th className="px-5 py-3.5 font-bold">Event</th>
              <th className="px-5 py-3.5 font-bold">Date</th>
              <th className="px-5 py-3.5 font-bold">Location</th>
              <th className="px-5 py-3.5 font-bold">Tickets</th>
              <th className="px-5 py-3.5 font-bold">Remaining</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
              <th className="px-5 py-3.5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {soldOutEvents.map((event) => (
              <tr
                key={event.slug}
                className="group border-t border-[#ececec] transition hover:bg-[#f4f4f5]"
              >
                <td className="px-5 py-4 cursor-pointer" onClick={() => setActiveModalEvent(event)}>
                  <div className="font-bold text-[#0f0f10]">{event.title}</div>
                  <div className="mt-0.5 text-xs text-[#6b6b70]">{event.category}</div>
                </td>
                <td className="px-5 py-4 text-[#6b6b70]">{event.shortDate}</td>
                <td className="px-5 py-4 text-[#6b6b70]">{event.location}</td>
                <td className="px-5 py-4 text-[#6b6b70]">{event.tickets.length}</td>
                <td className="px-5 py-4 text-[#6b6b70]">{event.remainingTickets ?? 0}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-bold text-[#6b6b70]">
                    {event.status}
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
                      onClick={() => router.push(`/organizer/events/${event.slug}`)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#111113] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#0f0f10]"
                    >
                      <FiArrowRight className="h-3.5 w-3.5" />
                      Page
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </OrganizerTable>
      </div>
    </AppShell>
  );
}
