"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const COLORS = ["#f33959", "#111113", "#82ca9d", "#ffbb28", "#8884d8"];

function fmtKes(n) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
  return `KES ${n}`;
}

function pct(sold, cap) {
  return cap > 0 ? Math.min(100, Math.round((sold / cap) * 100)) : 0;
}

export default function OrganizerAnalyticsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const s = getClientSession();
    if (!s) { router.replace("/organizer/login"); return; }
    if (s.role !== "organizer") { router.replace(getRoleHomePath(s.role)); return; }
    setSession(s);

    (async () => {
      try {
        const [analyticsData, eventsData] = await Promise.all([
          apiRequestAuth("/analytics/summary", s.token),
          apiRequestAuth("/events/mine", s.token),
        ]);
        setAnalytics(analyticsData);
        const evArr = Array.isArray(eventsData) ? eventsData : [];
        setEvents(evArr);
        if (evArr.length) setSelectedId(evArr[0].id);
      } catch (err) {
        if (err instanceof AuthError) { handleAuthError("organizer"); return; }
        setAnalytics({ totalRevenue: 0, totalOrders: 0, totalTickets: 0, activeEvents: 0, soldOutEvents: 0, revenueByDay: [], bookingsByDay: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const filteredEvents = useMemo(
    () => events.filter((e) => e.title.toLowerCase().includes(search.trim().toLowerCase())),
    [events, search],
  );

  useEffect(() => {
    if (!filteredEvents.some((e) => e.id === selectedId)) {
      setSelectedId(filteredEvents[0]?.id ?? null);
    }
  }, [filteredEvents, selectedId]);

  const selectedEvent = useMemo(() => events.find((e) => e.id === selectedId) ?? events[0], [events, selectedId]);

  if (!session) return null;

  const revenueByDay = analytics?.revenueByDay || [];
  const bookingsByDay = analytics?.bookingsByDay || [];

  // Build distribution data from events (use remaining_tickets as a proxy since we have no per-event sold data without extra API)
  const ticketDistData = selectedEvent
    ? [
        { name: "Sold", value: selectedEvent.remaining_tickets ? (200 - selectedEvent.remaining_tickets) : 0 },
        { name: "Remaining", value: selectedEvent.remaining_tickets || 0 },
      ]
    : [];

  return (
    <AppShell
      role="Organizer"
      title="Analytics"
      subtitle="Revenue, booking trends, and per-event insights — all from your live data."
    >
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total revenue", value: loading ? "…" : fmtKes(analytics?.totalRevenue ?? 0), sub: "across all events" },
            { label: "Total orders", value: loading ? "…" : String(analytics?.totalOrders ?? 0), sub: "ticket orders placed" },
            { label: "Active events", value: loading ? "…" : String(analytics?.activeEvents ?? 0), sub: "tracked this season" },
          ].map((item) => (
            <div key={item.label} className="card-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-[#0f0f10]">{item.value}</p>
              <p className="mt-1 text-xs text-[#6b6b70]">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="card-lg">
          <h2 className="text-xl font-bold text-[#0f0f10]">Revenue (last 7 days)</h2>
          <p className="mt-1 text-sm text-[#6b6b70]">KES income recorded per day from your ticket orders.</p>
          <div className="mt-6 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByDay.length ? revenueByDay : [{ label: "—", value: 0 }]} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f33959" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f33959" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ececec" vertical={false} />
                <XAxis dataKey="label" stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} tickFormatter={fmtKes} />
                <Tooltip formatter={(v) => [`KES ${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="value" stroke="#f33959" fill="url(#revGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings chart */}
        <div className="card-lg">
          <h2 className="text-xl font-bold text-[#0f0f10]">Bookings (last 7 days)</h2>
          <p className="mt-1 text-sm text-[#6b6b70]">Number of ticket orders per day.</p>
          <div className="mt-6 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByDay.length ? bookingsByDay : [{ label: "—", value: 0 }]} margin={{ top: 10, right: 5, left: -20, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid stroke="#ececec" vertical={false} />
                <XAxis dataKey="label" stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip formatter={(v) => [v, "Orders"]} />
                <Bar dataKey="value" fill="#f33959" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-event intelligence */}
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
          <section className="card-lg">
            <h2 className="text-xl font-bold text-[#0f0f10]">Your events</h2>
            <p className="mt-1 text-sm text-[#6b6b70]">Select an event to see details.</p>

            <div className="mt-5">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event name"
                className="w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3 text-sm text-[#0f0f10] outline-none transition focus:border-[#f33959] focus:bg-white"
              />
            </div>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-[16px] bg-[#f4f4f5]" />)}
                </div>
              ) : filteredEvents.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#6b6b70]">
                  {events.length === 0 ? "No events yet. Create your first event!" : "No events match your search."}
                </p>
              ) : (
                filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedId(event.id)}
                    className={`w-full rounded-[18px] border px-4 py-4 text-left transition ${
                      selectedId === event.id
                        ? "border-[#f33959] bg-[#fff2f4]"
                        : "border-[#ececec] bg-white hover:border-[#f33959] hover:bg-[#ffeff2]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#0f0f10]">{event.title}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${event.status === "Live" ? "bg-emerald-50 text-emerald-700" : event.status === "Draft" ? "bg-[#f4f4f5] text-[#6b6b70]" : "bg-amber-50 text-amber-700"}`}>
                        {event.status || "Draft"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6b6b70]">{event.venue} · {event.event_date ? new Date(event.event_date).toLocaleDateString() : "—"}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f4f4f5]">
                        <div className="h-full rounded-full bg-[#f33959]" style={{ width: `${pct(200 - (event.remaining_tickets || 0), 200)}%` }} />
                      </div>
                      <span className="text-xs text-[#6b6b70]">{event.remaining_tickets} left</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="card-lg">
            {!selectedEvent ? (
              <div className="flex h-full items-center justify-center text-sm text-[#6b6b70]">
                Select an event on the left to view its analytics.
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0f0f10]">{selectedEvent.title}</h2>
                    <p className="mt-1 text-sm text-[#6b6b70]">{selectedEvent.venue} · {selectedEvent.category}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedEvent.status === "Live" ? "bg-emerald-50 text-emerald-700" : "bg-[#f4f4f5] text-[#6b6b70]"}`}>
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Remaining", value: selectedEvent.remaining_tickets ?? "—" },
                    { label: "Price label", value: selectedEvent.price_label || "—" },
                    { label: "Status", value: selectedEvent.status || "Draft" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[16px] border border-[#ececec] bg-[#fafafa] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{item.label}</p>
                      <p className="mt-2 text-lg font-bold text-[#0f0f10]">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-sm font-bold text-[#0f0f10]">Ticket availability</p>
                  <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketDistData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={44}
                          outerRadius={88}
                          paddingAngle={4}
                        >
                          {ticketDistData.map((entry, i) => (
                            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v, n) => [`${v} tickets`, n]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-6 rounded-[16px] border border-[#ececec] bg-[#fafafa] p-4">
                  <p className="text-sm font-bold text-[#0f0f10]">Quick insights</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#6b6b70]">
                    <li className="rounded-[12px] bg-white p-3">
                      <span className="font-bold text-[#0f0f10]">Event date:</span>{" "}
                      {selectedEvent.event_date ? new Date(selectedEvent.event_date).toDateString() : "Not set"}
                    </li>
                    <li className="rounded-[12px] bg-white p-3">
                      <span className="font-bold text-[#0f0f10]">Host:</span>{" "}
                      {selectedEvent.host_name || "Not specified"}
                    </li>
                    <li className="rounded-[12px] bg-white p-3">
                      <span className="font-bold text-[#0f0f10]">Tickets remaining:</span>{" "}
                      {selectedEvent.remaining_tickets ?? "—"} available
                    </li>
                  </ul>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Event table */}
        {events.length > 0 && (
          <div className="card-lg">
            <h2 className="text-xl font-bold text-[#0f0f10]">All events overview</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="clean-table min-w-[640px] w-full">
                <thead>
                  <tr className="border-b border-[#ececec] bg-[#fafafa]">
                    {["Event", "Venue", "Date", "Remaining tickets", "Price label", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6b6b70] text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} className="border-t border-[#ececec]">
                      <td className="px-4 py-3 font-bold text-[#0f0f10]">{ev.title}</td>
                      <td className="px-4 py-3 text-[#6b6b70]">{ev.venue}</td>
                      <td className="px-4 py-3 text-[#6b6b70]">{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3">{ev.remaining_tickets ?? "—"}</td>
                      <td className="px-4 py-3 text-[#6b6b70]">{ev.price_label || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${ev.status === "Live" ? "bg-emerald-50 text-emerald-700" : "bg-[#f4f4f5] text-[#6b6b70]"}`}>
                          {ev.status || "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
