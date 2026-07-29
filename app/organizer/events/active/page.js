"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import AppShell from "@/components/app-shell";
import { OrganizerTable } from "@/components/organizer-table";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { publicEvents } from "@/lib/public-events";

export default function ActiveEventsPage() {
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

  const activeEvents = useMemo(
    () => publicEvents.filter((event) => !event.isPast && event.status !== "Draft"),
    [],
  );

  const totalRemaining = useMemo(
    () => activeEvents.reduce((sum, event) => sum + (event.remainingTickets ?? 0), 0),
    [activeEvents],
  );

  if (!session) {
    return null;
  }

  return (
    <AppShell
      role="Organizer"
      title="Active events"
      subtitle="Track live events, remaining capacity, and ticket stock in motion."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Active events</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{activeEvents.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total remaining tickets</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalRemaining}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Selling fast</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {publicEvents.filter((event) => event.status === "Selling fast").length}
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Active event schedule</h2>
              <p className="mt-2 text-sm text-slate-500">Live and upcoming events currently available for ticket sales.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/organizer/events/createnew")}
              className="inline-flex items-center justify-center rounded-full bg-[#f33959] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d92847]"
            >
              New event
            </button>
          </div>

          <OrganizerTable>
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
              {activeEvents.map((event) => (
                <tr
                  key={event.slug}
                  onClick={() => router.push(`/organizer/events/${event.slug}`)}
                  className="group cursor-pointer border-b border-slate-200 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-950">{event.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{event.category}</div>
                  </td>
                  <td className="px-4 py-3">{event.shortDate}</td>
                  <td className="px-4 py-3">{event.location}</td>
                  <td className="px-4 py-3">{event.tickets.length}</td>
                  <td className="px-4 py-3">{event.remainingTickets}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
      </div>
    </AppShell>
  );
}
