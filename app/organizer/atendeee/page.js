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
  const pieSegments = [
    { label: "VIP", value: 42, color: "from-emerald-500 to-emerald-400" },
    { label: "General", value: 31, color: "from-slate-700 to-slate-500" },
    { label: "Advance", value: 27, color: "from-cyan-500 to-sky-400" },
  ];

  return (
    <AppShell
      role="Organizer"
      title="Attendees"
      subtitle="See who bought tickets, who checked in, and who still needs scanning at the gate."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total attendees", value: "8,420" },
                { label: "Checked in", value: "6,188" },
                { label: "Pending", value: "2,232" },
                { label: "Repeat visits", value: "126" },
              ].map((item) => (
                <div key={item.label} className="rounded-[16px] bg-[#fafafa] border border-[#ececec] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-[#0f0f10]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[16px] border border-[#ececec] bg-[#fafafa] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#0f0f10]">Check-in trend</h2>
                  <p className="mt-0.5 text-xs text-[#6b6b70]">Attendance growth this week</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">+18%</span>
              </div>

              <div className="mt-5 flex h-40 items-end gap-3">
                {graphBars.map((bar) => (
                  <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-28 w-full items-end rounded-[12px] bg-white p-1 border border-[#ececec]">
                      <div className="w-full rounded-[8px] bg-[#f33959]" style={{ height: `${bar.value}%` }} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#ececec] bg-white shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <div className="border-b border-[#ececec] p-6">
              <h2 className="text-lg font-bold text-[#0f0f10]">Ticket usage log</h2>
              <p className="mt-0.5 text-xs text-[#6b6b70]">Complete list of tickets scanned at venue entry points.</p>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full text-left text-sm text-[#0f0f10]">
                <thead className="sticky top-0 z-10 bg-[#fafafa] text-[#6b6b70]">
                  <tr>
                    <th className="px-5 py-3 font-bold">Name</th>
                    <th className="px-5 py-3 font-bold">Ticket</th>
                    <th className="px-5 py-3 font-bold">Code</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Scanned</th>
                  </tr>
                </thead>
                <tbody>
                  {attendeeRows.map((row) => (
                    <tr key={row.code} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                      <td className="px-5 py-3.5 font-bold text-[#0f0f10]">{row.name}</td>
                      <td className="px-5 py-3.5 text-[#6b6b70]">{row.ticket}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[#0f0f10]">{row.code}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${row.status === "Used" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#6b6b70]">{row.scannedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Attendance</p>
                <h3 className="mt-1 text-lg font-bold text-[#0f0f10]">Daily entry flow</h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Live</span>
            </div>

            <div className="mt-4 rounded-[16px] border border-[#ececec] bg-[#111113] p-4 text-white">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">Entry curve</p>
                <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-white">Live scan</span>
              </div>
              <div className="mt-4 flex h-36 items-end gap-2">
                {areaPoints.map((point, index) => (
                  <div key={`${point}-${index}`} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex h-24 w-full items-end rounded-lg bg-white/10 p-0.5">
                      <div className="w-full rounded bg-[#f33959]" style={{ height: `${point}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-white/70">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Ticket mix</p>
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#f33959_0_42%,#111113_42%_73%,#6b6b70_73%_100%)] p-3">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#0f0f10]">100%</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b6b70]">tickets</p>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-2">
                {[
                  { label: "VIP", value: "42%", color: "bg-[#f33959]" },
                  { label: "General", value: "31%", color: "bg-[#111113]" },
                  { label: "Advance", value: "27%", color: "bg-[#6b6b70]" },
                ].map((segment) => (
                  <div key={segment.label} className="flex items-center justify-between rounded-[12px] bg-[#fafafa] border border-[#ececec] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${segment.color}`} />
                      <span className="text-xs font-bold text-[#0f0f10]">{segment.label}</span>
                    </div>
                    <span className="text-xs font-bold text-[#6b6b70]">{segment.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
