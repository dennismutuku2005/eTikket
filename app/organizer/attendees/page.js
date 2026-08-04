"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { FiCheckCircle, FiClock, FiSearch, FiUserCheck, FiUsers } from "react-icons/fi";

const PIE_COLORS = ["#f33959", "#111113", "#82ca9d", "#ffbb28", "#8884d8", "#0088fe"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[14px] border border-[#ececec] bg-white px-3.5 py-2.5 text-xs shadow-lg">
      <p className="font-bold text-[#0f0f10]">{label}</p>
      <p className="mt-1 font-bold text-[#f33959]">
        {payload[0].name ? `${payload[0].name}: ` : ""}
        {payload[0].value} check-ins
      </p>
    </div>
  );
};

export default function OrganizerAttendeesPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [data, setData] = useState({
    stats: { totalAttendees: 0, checkedIn: 0, pending: 0, repeatVisits: 0 },
    entryFlow: [],
    ticketMix: [],
    logs: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const s = getClientSession();
    if (!s) { router.replace("/organizer/login"); return; }
    if (s.role !== "organizer") { router.replace(getRoleHomePath(s.role)); return; }
    setSession(s);

    (async () => {
      try {
        const res = await apiRequestAuth("/tickets/organizer", s.token);
        if (res) setData(res);
      } catch (err) {
        if (err instanceof AuthError) { handleAuthError("organizer"); return; }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (!session) return null;

  const { stats, entryFlow, ticketMix, logs } = data;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !search.trim() ||
      log.name.toLowerCase().includes(search.toLowerCase()) ||
      log.code.toLowerCase().includes(search.toLowerCase()) ||
      log.ticket.toLowerCase().includes(search.toLowerCase()) ||
      (log.email && log.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "used" && log.status === "Used") ||
      (statusFilter === "unused" && log.status === "Unused");

    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell
      role="Organizer"
      title="Attendees"
      subtitle="See who bought tickets, who checked in, and who still needs scanning at the gate."
    >
      <div className="space-y-8">

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#6b6b70]">Total attendees</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f4f5] text-[#0f0f10]">
                <FiUsers size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">
              {loading ? "…" : stats.totalAttendees.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#6b6b70]">Issued tickets across events</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#6b6b70]">Checked in</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <FiUserCheck size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-600">
              {loading ? "…" : stats.checkedIn.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#6b6b70]">Scanned at venue gates</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#6b6b70]">Pending</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <FiClock size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-amber-600">
              {loading ? "…" : stats.pending.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#6b6b70]">Awaiting scanning</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#6b6b70]">Repeat visits</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <FiCheckCircle size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">
              {loading ? "…" : stats.repeatVisits.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#6b6b70]">Re-entries recorded</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Check-in trend AreaChart */}
          <div className="card-lg space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Check-in trend</p>
              <h3 className="text-lg font-bold text-[#0f0f10]">Attendance growth this week</h3>
            </div>

            <div className="h-64 w-full pt-2">
              {loading ? (
                <div className="h-full w-full animate-pulse rounded-[16px] bg-[#f4f4f5]" />
              ) : entryFlow.length === 0 || entryFlow.every((d) => d.scans === 0) ? (
                <div className="flex h-full items-center justify-center text-xs font-bold text-[#6b6b70]">
                  No scans recorded this week yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={entryFlow}>
                    <defs>
                      <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f33959" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f33959" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ececec" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b6b70", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b6b70", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="scans" stroke="#f33959" strokeWidth={3} fill="url(#scansGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Ticket Mix PieChart */}
          <div className="card-lg space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Ticket mix</p>
              <h3 className="text-lg font-bold text-[#0f0f10]">Breakdown by ticket class</h3>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              {loading ? (
                <div className="h-full w-full animate-pulse rounded-[16px] bg-[#f4f4f5]" />
              ) : ticketMix.length === 0 ? (
                <div className="text-xs font-bold text-[#6b6b70]">No ticket mix data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ticketMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {ticketMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} tickets`, name]}
                      contentStyle={{ borderRadius: "12px", borderColor: "#ececec" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {ticketMix.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-[#ececec]">
                {ticketMix.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-bold text-[#0f0f10]">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span>{item.name}: {item.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ticket Usage Log Table */}
        <div className="card-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#ececec] pb-5">
            <div>
              <h3 className="text-lg font-bold text-[#0f0f10]">Ticket usage log</h3>
              <p className="text-xs text-[#6b6b70]">Complete list of tickets issued and scanned at venue entry points.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6b70]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search attendee or code…"
                  className="h-10 w-full rounded-full border border-[#ececec] bg-[#fafafa] pl-9 pr-4 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-full border border-[#ececec] bg-[#fafafa] px-4 text-xs font-bold text-[#0f0f10] outline-none focus:border-[#f33959]"
              >
                <option value="all">All statuses</option>
                <option value="used">Used (Checked in)</option>
                <option value="unused">Unused (Pending)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="clean-table min-w-[700px] w-full">
              <thead className="bg-[#fafafa] text-[#6b6b70]">
                <tr>
                  <th className="px-5 py-3.5 text-left font-bold">Attendee Name</th>
                  <th className="px-5 py-3.5 text-left font-bold">Ticket Class</th>
                  <th className="px-5 py-3.5 text-left font-bold">Ticket Code</th>
                  <th className="px-5 py-3.5 text-left font-bold">Status</th>
                  <th className="px-5 py-3.5 text-left font-bold">Scanned Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#6b6b70]">
                      Loading ticket logs…
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#6b6b70]">
                      No ticket usage logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#0f0f10]">{log.name}</p>
                        {log.email && <p className="text-xs text-[#6b6b70]">{log.email}</p>}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#0f0f10]">{log.ticket}</td>
                      <td className="px-5 py-4 text-xs font-mono text-[#6b6b70]">{log.code}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            log.status === "Used"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#6b6b70]">{log.scanned}</td>
                    </tr>
                  ))
                ) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
