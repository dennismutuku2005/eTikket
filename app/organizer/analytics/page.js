"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import Modal from "@/components/modal";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

const seedEvents = [
  {
    id: 1,
    name: "Urban Fest Nairobi",
    date: "Aug 12, 2026",
    venue: "Uhuru Gardens",
    capacity: 2000,
    ticketsSold: 1420,
    revenue: 852000,
    ticketTypes: [
      { name: "VIP", price: 2500, capacity: 200, sold: 178 },
      { name: "Regular", price: 500, capacity: 1200, sold: 980 },
      { name: "Advance", price: 350, capacity: 600, sold: 262 },
    ],
    forecastSellout: "Aug 9, 2026",
    trend: "up",
    intelligence: [
      "Sales pace is 23% above last month's comparable event.",
      "VIP tier is 89% sold — consider releasing 50 more slots.",
      "Advance tickets selling slower — a promo push could help.",
    ],
  },
  {
    id: 2,
    name: "Campus Night Live",
    date: "Sep 3, 2026",
    venue: "UoN Grounds",
    capacity: 800,
    ticketsSold: 310,
    revenue: 124000,
    ticketTypes: [
      { name: "General", price: 400, capacity: 800, sold: 310 },
    ],
    forecastSellout: "Aug 30, 2026",
    trend: "neutral",
    intelligence: [
      "Steady daily sales, no major spikes detected.",
      "Social referral traffic up 40% — keep current promotions active.",
    ],
  },
  {
    id: 3,
    name: "Coast Holiday Market",
    date: "Dec 20, 2026",
    venue: "Mombasa Waterfront",
    capacity: 1500,
    ticketsSold: 95,
    revenue: 47500,
    ticketTypes: [
      { name: "Day pass", price: 500, capacity: 1000, sold: 60 },
      { name: "Weekend pass", price: 900, capacity: 500, sold: 35 },
    ],
    forecastSellout: "Dec 18, 2026",
    trend: "down",
    intelligence: [
      "Early sales are below target — event is 5 months out.",
      "Consider an early-bird discount to accelerate momentum.",
      "Weekend pass demand suggests bundling could increase revenue.",
    ],
  },
];

function pct(sold, cap) {
  return Math.min(100, Math.round((sold / cap) * 100));
}

function fmtKes(n) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
  return `KES ${n}`;
}

function TrendBadge({ trend }) {
  const map = {
    up: { text: "\u2191 Growing", bg: "bg-emerald-50", fg: "text-emerald-700" },
    neutral: { text: "\u2192 Steady", bg: "bg-amber-50", fg: "text-amber-700" },
    down: { text: "\u2193 Slow", bg: "bg-red-50", fg: "text-[#f33959]" },
  };
  const { text, bg, fg } = map[trend] ?? map.neutral;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${bg} ${fg}`}>
      {text}
    </span>
  );
}

/* ── tiny inline spinner ── */
function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function OrganizerAnalyticsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState(seedEvents);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // delete‑dialog state
  const [deleteTarget, setDeleteTarget] = useState(null); // single event or "bulk"
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const s = getClientSession();
    if (!s) { router.replace("/organizer/login"); return; }
    if (s.role !== "organizer") { router.replace(getRoleHomePath(s.role)); return; }
    setSession(s);
  }, [router]);

  if (!session) return null;

  /* ── selection helpers ── */
  const allSelected = events.length > 0 && selectedIds.length === events.length;

  function toggleOne(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : events.map((e) => e.id));
  }

  /* ── delete helpers ── */
  function requestDeleteSingle(ev) {
    setDeleteTarget(ev);
  }

  function requestDeleteBulk() {
    setDeleteTarget("bulk");
  }

  async function executeDelete() {
    setIsDeleting(true);
    // simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    if (deleteTarget === "bulk") {
      setEvents((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
      setSelectedIds([]);
    } else if (deleteTarget) {
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setSelectedIds((prev) => prev.filter((x) => x !== deleteTarget.id));
    }

    setDeleteTarget(null);
    setIsDeleting(false);
  }

  /* ── derived stats ── */
  const totalRevenue = events.reduce((a, e) => a + e.revenue, 0);
  const totalSold = events.reduce((a, e) => a + e.ticketsSold, 0);
  const totalCapacity = events.reduce((a, e) => a + e.capacity, 0);

  const deleteModalTitle =
    deleteTarget === "bulk"
      ? `Delete ${selectedIds.length} event${selectedIds.length > 1 ? "s" : ""}?`
      : `Delete "${deleteTarget?.name}"?`;

  return (
    <AppShell
      role="Organizer"
      title="Analytics"
      subtitle="Expected ticket forecasts and intelligence reports across your events."
    >
      <div className="space-y-6">
        {/* ── summary cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total revenue", value: fmtKes(totalRevenue), sub: "across all events" },
            { label: "Tickets sold", value: totalSold.toLocaleString(), sub: `of ${totalCapacity.toLocaleString()} capacity` },
            { label: "Active events", value: events.length, sub: "tracked this season" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{s.label}</p>
              <p className="mt-2 text-3xl font-bold text-[#0f0f10]">{s.value}</p>
              <p className="mt-1 text-xs text-[#6b6b70]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── toolbar: select‑all + bulk delete ── */}
        {events.length > 0 && (
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-[#ececec] accent-[#f33959]"
              />
              <span className="text-sm font-semibold text-[#0f0f10]">
                {allSelected ? "Deselect all" : "Select all"}
              </span>
            </label>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={requestDeleteBulk}
                className="inline-flex items-center gap-2 rounded-full bg-[#f33959] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#d92847]"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                  <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
                </svg>
                Delete {selectedIds.length} selected
              </button>
            )}
          </div>
        )}

        {/* ── event intelligence cards ── */}
        <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <h2 className="text-xl font-bold text-[#0f0f10]">Event intelligence reports</h2>
          <p className="mt-1 text-sm text-[#6b6b70]">
            Ticket forecasts, sell‑out predictions, and AI‑powered insights per event.
          </p>

          <div className="mt-6 space-y-4">
            {events.length === 0 && (
              <p className="py-12 text-center text-sm text-[#6b6b70]">
                No events to display. Create an event to see analytics here.
              </p>
            )}

            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-[16px] border border-[#ececec] bg-[#fafafa] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(event.id)}
                      onChange={() => toggleOne(event.id)}
                      className="h-4 w-4 rounded border-[#ececec] accent-[#f33959]"
                    />
                    <div>
                      <p className="text-base font-bold text-[#0f0f10]">{event.name}</p>
                      <p className="mt-0.5 text-xs text-[#6b6b70]">{event.date} &middot; {event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendBadge trend={event.trend} />
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expandedId === event.id ? null : event.id)
                      }
                      className="rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-xs font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                    >
                      {expandedId === event.id ? "Hide detail" : "View detail"}
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeleteSingle(event)}
                      className="rounded-full border border-[#f33959]/30 bg-[#f33959]/5 px-3 py-1.5 text-xs font-bold text-[#f33959] transition hover:bg-[#f33959]/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* capacity bar */}
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs font-bold text-[#6b6b70]">
                    <span>{event.ticketsSold.toLocaleString()} sold</span>
                    <span>
                      {pct(event.ticketsSold, event.capacity)}% of{" "}
                      {event.capacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#ececec]">
                    <div
                      className="h-2 rounded-full bg-[#f33959] transition-all"
                      style={{
                        width: `${pct(event.ticketsSold, event.capacity)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* mini‑stats */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[12px] border border-[#ececec] bg-white px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Revenue</p>
                    <p className="mt-1 text-sm font-bold text-[#0f0f10]">{fmtKes(event.revenue)}</p>
                  </div>
                  <div className="rounded-[12px] border border-[#ececec] bg-white px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Forecast sellout</p>
                    <p className="mt-1 text-sm font-bold text-[#0f0f10]">{event.forecastSellout}</p>
                  </div>
                  <div className="rounded-[12px] border border-[#ececec] bg-white px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Remaining</p>
                    <p className="mt-1 text-sm font-bold text-[#0f0f10]">
                      {(event.capacity - event.ticketsSold).toLocaleString()} tickets
                    </p>
                  </div>
                </div>

                {/* expanded detail */}
                {expandedId === event.id && (
                  <div className="mt-4 space-y-4 border-t border-[#ececec] pt-4">
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6b6b70]">
                        Ticket type breakdown
                      </p>
                      <div className="space-y-3">
                        {event.ticketTypes.map((t) => (
                          <div
                            key={t.name}
                            className="rounded-[12px] border border-[#ececec] bg-white px-4 py-3"
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-[#0f0f10]">{t.name}</span>
                              <span className="text-xs font-bold text-[#6b6b70]">
                                KES {t.price.toLocaleString()} &middot; {t.sold}/{t.capacity} sold
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ececec]">
                              <div
                                className="h-1.5 rounded-full bg-[#f33959]"
                                style={{ width: `${pct(t.sold, t.capacity)}%` }}
                              />
                            </div>
                            <p className="mt-1 text-right text-xs font-bold text-[#6b6b70]">
                              {pct(t.sold, t.capacity)}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6b6b70]">
                        Intelligence insights
                      </p>
                      <ul className="space-y-2">
                        {event.intelligence.map((tip, i) => (
                          <li
                            key={i}
                            className="flex gap-3 rounded-[12px] border border-[#ececec] bg-white px-4 py-3"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f33959] text-[10px] font-bold text-white">
                              {i + 1}
                            </span>
                            <p className="text-sm text-[#0f0f10]">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── expected revenue table ── */}
        <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <h2 className="text-xl font-bold text-[#0f0f10]">Expected ticket revenue</h2>
          <p className="mt-1 text-sm text-[#6b6b70]">
            Projected totals if all remaining tickets sell at current pricing.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-[#0f0f10]">
              <thead>
                <tr className="border-b border-[#ececec] bg-[#fafafa]">
                  {["Event", "Sold", "Remaining", "Current revenue", "Expected total", "Sellout date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6b6b70]"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const avgPrice = ev.revenue / (ev.ticketsSold || 1);
                  const expectedTotal =
                    ev.revenue + (ev.capacity - ev.ticketsSold) * avgPrice;
                  return (
                    <tr key={ev.id} className="border-t border-[#ececec]">
                      <td className="px-4 py-3 font-bold">{ev.name}</td>
                      <td className="px-4 py-3">{ev.ticketsSold.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {(ev.capacity - ev.ticketsSold).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{fmtKes(ev.revenue)}</td>
                      <td className="px-4 py-3 font-bold text-[#f33959]">
                        {fmtKes(Math.round(expectedTotal))}
                      </td>
                      <td className="px-4 py-3">{ev.forecastSellout}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── delete confirmation modal ── */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">
          Delete event{deleteTarget === "bulk" && selectedIds.length > 1 ? "s" : ""}
        </p>
        <h3 className="mt-2 text-2xl font-bold">{deleteModalTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
          This action cannot be undone. All ticket data and intelligence reports
          for {deleteTarget === "bulk" ? "the selected events" : "this event"} will
          be permanently removed.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            disabled={isDeleting}
            className="flex-1 rounded-full border border-[#ececec] bg-white py-3 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={executeDelete}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#f33959] py-3 text-sm font-bold text-white transition hover:bg-[#d92847] disabled:opacity-70"
          >
            {isDeleting ? <Spinner /> : null}
            {isDeleting ? "Deleting\u2026" : "Delete"}
          </button>
        </div>
      </Modal>
    </AppShell>
  );
}
