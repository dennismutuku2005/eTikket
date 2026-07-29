"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import AppShell from "@/components/app-shell";
import { OrganizerTable } from "@/components/organizer-table";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { publicEvents } from "@/lib/public-events";

export default function SoldOutEventsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

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
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Sold out events</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{soldOutEvents.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Waitlist capacity</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{soldOutEvents.reduce((sum, event) => sum + (event.remainingTickets ?? 0), 0)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Events ready for relaunch</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{soldOutEvents.filter((event) => !event.isPast).length}</p>
          </div>
        </div>

        <OrganizerTable
          title="Sold out events"
          description="Track fully booked headline events and see remaining waitlist opportunities."
        >
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Event</th>
              <th className="px-5 py-4 font-semibold">Date</th>
              <th className="px-5 py-4 font-semibold">Location</th>
              <th className="px-5 py-4 font-semibold">Tickets</th>
              <th className="px-5 py-4 font-semibold">Remaining</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {soldOutEvents.map((event) => (
              <tr
                key={event.slug}
                onClick={() => router.push(`/organizer/events/${event.slug}`)}
                className="group cursor-pointer border-t border-slate-200 transition hover:bg-slate-50"
              >
                <td className="px-5 py-4 font-semibold text-slate-950">{event.title}</td>
                <td className="px-5 py-4">{event.shortDate}</td>
                <td className="px-5 py-4">{event.location}</td>
                <td className="px-5 py-4">{event.tickets.length}</td>
                <td className="px-5 py-4">{event.remainingTickets ?? 0}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {event.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition group-hover:bg-slate-200">
                    <FiArrowRight className="h-4 w-4" />
                    View
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
