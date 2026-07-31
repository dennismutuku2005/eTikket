"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { OrganizerTable } from "@/components/organizer-table";
import EventDetailsModal from "@/components/event-details-modal";
import { FiArrowRight, FiEye } from "react-icons/fi";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { publicEvents } from "@/lib/public-events";

export default function OrganizerEventsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  useEffect(() => {
    const clientSession = getClientSession();

    if (!clientSession) {
      router.replace("/login");
      return;
    }

    if (clientSession.role !== "organizer") {
      router.replace(getRoleHomePath(clientSession.role));
      return;
    }

    setSession(clientSession);
  }, [router]);

  const liveEvents = useMemo(
    () => publicEvents.filter((event) => event.status !== "Sold out" && event.status !== "Draft").length,
    [],
  );
  const draftEvents = useMemo(() => publicEvents.filter((event) => event.status === "Draft").length, []);
  const soldOutEvents = useMemo(() => publicEvents.filter((event) => event.status === "Sold out").length, []);

  if (!session) {
    return null;
  }

  return (
    <AppShell
      role="Organizer"
      title="Events"
      subtitle="Create events, edit details, and monitor ticket stock across every event you manage."
    >
      {activeModalEvent && (
        <EventDetailsModal event={activeModalEvent} onClose={() => setActiveModalEvent(null)} />
      )}

      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-sm font-bold text-[#6b6b70]">Live events</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{liveEvents}</p>
          </div>
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-sm font-bold text-[#6b6b70]">Draft events</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{draftEvents}</p>
          </div>
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-sm font-bold text-[#6b6b70]">Sold out</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{soldOutEvents}</p>
          </div>
        </div>

        <OrganizerTable
          title="Event list"
          description="Tap any event row or click Quick View to open details in a modal dialog."
          action={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/organizer/events/createnew"
                className="inline-flex items-center justify-center rounded-full bg-[#f33959] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
              >
                Create event
              </Link>
              <Link
                href={`/organizer/events/${publicEvents[0]?.slug ?? ""}`}
                className="inline-flex items-center justify-center rounded-full border border-[#ececec] bg-white px-5 py-2.5 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
              >
                View sample page
              </Link>
            </div>
          }
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
            {publicEvents
              .filter((event) => !event.isPast && event.status !== "Draft")
              .map((event) => (
                <tr
                  key={event.slug}
                  className="group border-t border-[#ececec] transition hover:bg-[#f4f4f5]"
                >
                  <td className="px-5 py-4 cursor-pointer" onClick={() => router.push(`/organizer/events/${event.slug}`)}>
                    <div className="font-bold text-[#0f0f10]">{event.title}</div>
                    <div className="mt-0.5 text-xs text-[#6b6b70]">{event.category}</div>
                  </td>
                  <td className="px-5 py-4 text-[#6b6b70]">{event.shortDate}</td>
                  <td className="px-5 py-4 text-[#6b6b70]">{event.location}</td>
                  <td className="px-5 py-4 text-[#6b6b70]">{event.tickets.length} classes</td>
                  <td className="px-5 py-4 font-bold text-[#0f0f10]">{event.remainingTickets}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      event.status === "Sold out" ? "bg-[#f4f4f5] text-[#6b6b70]" : "bg-[#f33959]/10 text-[#f33959]"
                    }`}>
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

        <OrganizerTable title="Past events" description="These events are closed and kept for historical record.">
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
            {publicEvents.filter((event) => event.isPast).map((event) => (
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
                <td className="px-5 py-4 text-[#6b6b70]">{event.tickets.length} classes</td>
                <td className="px-5 py-4 text-[#6b6b70]">{event.remainingTickets}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-bold text-[#6b6b70]">
                    {event.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setActiveModalEvent(event)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3 py-1 text-xs font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                  >
                    <FiEye className="h-3.5 w-3.5 text-[#f33959]" />
                    Quick View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </OrganizerTable>
      </div>
    </AppShell>
  );
}
