"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { OrganizerTable } from "@/components/organizer-table";
import { FiArrowRight } from "react-icons/fi";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { publicEvents } from "@/lib/public-events";

export default function OrganizerEventsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

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
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Live events</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{liveEvents}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Draft events</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{draftEvents}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Sold out</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{soldOutEvents}</p>
          </div>
        </div>

        <OrganizerTable
          title="Event list"
          description="Tap any event to open its detail page and see tickets, location, and publish details."
          action={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/organizer/events/createnew"
                className="inline-flex items-center justify-center rounded-full bg-[#f33959] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d92847]"
              >
                Create event
              </Link>
              <Link
                href={`/organizer/events/${publicEvents[0]?.slug ?? ""}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                View sample event
              </Link>
            </div>
          }
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
            {publicEvents
              .filter((event) => !event.isPast && event.status !== "Draft")
              .map((event) => (
                <tr
                  key={event.slug}
                  onClick={() => router.push(`/organizer/events/${event.slug}`)}
                  className="group cursor-pointer border-t border-slate-200 transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950">{event.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{event.category}</div>
                  </td>
                  <td className="px-5 py-4">{event.shortDate}</td>
                  <td className="px-5 py-4">{event.location}</td>
                  <td className="px-5 py-4">{event.tickets.length} classes</td>
                  <td className="px-5 py-4">{event.remainingTickets}</td>
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

        <OrganizerTable title="Past events" description="These events are closed and not editable.">
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
            {publicEvents.filter((event) => event.isPast).map((event) => (
              <tr
                key={event.slug}
                className="group cursor-pointer border-t border-slate-200 transition hover:bg-slate-50"
                onClick={() => router.push(`/organizer/events/${event.slug}`)}
              >
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-950">{event.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{event.category}</div>
                </td>
                <td className="px-5 py-4">{event.shortDate}</td>
                <td className="px-5 py-4">{event.location}</td>
                <td className="px-5 py-4">{event.tickets.length} classes</td>
                <td className="px-5 py-4">{event.remainingTickets}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
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
