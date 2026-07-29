"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerAttendeesPage() {
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

  if (!session) {
    return null;
  }

  const attendeeRows = [
    { name: "Grace W.", ticket: "VIP", status: "Used", code: "TKT-1042", scannedAt: "09:12" },
    { name: "Brian K.", ticket: "General", status: "Unused", code: "TKT-1043", scannedAt: "—" },
    { name: "Mercy A.", ticket: "Advance", status: "Used", code: "TKT-1044", scannedAt: "10:03" },
    { name: "Jonah T.", ticket: "Normal", status: "Unused", code: "TKT-1045", scannedAt: "—" },
    { name: "Sasha M.", ticket: "VIP", status: "Used", code: "TKT-1046", scannedAt: "11:05" },
    { name: "Kevin O.", ticket: "General", status: "Unused", code: "TKT-1047", scannedAt: "—" },
    { name: "Lilian N.", ticket: "Advance", status: "Used", code: "TKT-1048", scannedAt: "12:17" },
    { name: "Owen P.", ticket: "Normal", status: "Unused", code: "TKT-1049", scannedAt: "—" },
    { name: "Diana S.", ticket: "VIP", status: "Used", code: "TKT-1050", scannedAt: "12:49" },
    { name: "Noah C.", ticket: "General", status: "Unused", code: "TKT-1051", scannedAt: "—" },
  ];

  const graphBars = [
    { label: "Mon", value: 40 },
    { label: "Tue", value: 62 },
    { label: "Wed", value: 52 },
    { label: "Thu", value: 71 },
    { label: "Fri", value: 84 },
    { label: "Sat", value: 96 },
  ];

  const areaPoints = [18, 28, 24, 36, 42, 48];

  return (
    <AppShell
      role="Organizer"
      title="Attendees"
      subtitle="See who bought tickets, who checked in, and who still needs scanning at the gate."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total attendees", value: "8,420" },
                { label: "Checked in", value: "6,188" },
                { label: "Pending", value: "2,232" },
                { label: "Repeat visits", value: "126" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Check-in trend</h2>
                  <p className="mt-1 text-sm text-slate-500">Attendance growth this week</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">+18%</span>
              </div>

              <div className="mt-5 flex h-44 items-end gap-3">
                {graphBars.map((bar) => (
                  <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end rounded-2xl bg-white p-1">
                      <div className="w-full rounded-xl bg-slate-900" style={{ height: `${bar.value}%` }} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Ticket usage log</h2>
              <p className="mt-1 text-sm text-slate-500">A long list of tickets that were used or left unused.</p>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="sticky top-0 z-10 bg-white text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Ticket</th>
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Scanned</th>
                  </tr>
                </thead>
                <tbody>
                  {attendeeRows.map((row) => (
                    <tr key={row.code} className="border-t border-slate-200">
                      <td className="px-5 py-3 text-slate-900">{row.name}</td>
                      <td className="px-5 py-3">{row.ticket}</td>
                      <td className="px-5 py-3 font-mono text-xs">{row.code}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === "Used" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">{row.scannedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Attendance</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">Daily entry flow</h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Live</span>
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4 shadow-sm">
              <div className="flex h-44 items-end gap-2">
                {areaPoints.map((point, index) => (
                  <div key={`${point}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end rounded-2xl bg-white/15 p-1 backdrop-blur-sm">
                      <div className="w-full rounded-xl bg-gradient-to-t from-emerald-400 via-emerald-300 to-cyan-300" style={{ height: `${point}%` }} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Ticket mix</p>
            <div className="mt-4 space-y-4">
              {[
                { label: "VIP", value: 42 },
                { label: "General", value: 31 },
                { label: "Advance", value: 27 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">{item.label}</span>
                    <span className="text-slate-500">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-slate-900" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
