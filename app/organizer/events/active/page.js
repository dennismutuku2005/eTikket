"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
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

        <div className="rounded-3xl bg-slate-50 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Active event schedule</h2>
              <p className="mt-2 text-sm text-slate-500">Live and upcoming events currently available for ticket sales.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/organizer/events/createnew")}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              New event
            </button>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/40">
            <table className="w-full border-separate border-spacing-0 text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Event</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Location</th>
                  <th className="px-5 py-4 font-semibold">Tickets</th>
                  <th className="px-5 py-4 font-semibold">Remaining</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeEvents.map((event) => (
                  <tr
                    key={event.slug}
                    onClick={() => router.push(`/organizer/events/${event.slug}`)}
                    className="cursor-pointer border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{event.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{event.category}</div>
                    </td>
                    <td className="px-5 py-4">{event.shortDate}</td>
                    <td className="px-5 py-4">{event.location}</td>
                    <td className="px-5 py-4">{event.tickets.length}</td>
                    <td className="px-5 py-4">{event.remainingTickets}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
