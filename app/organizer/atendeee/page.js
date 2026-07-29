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
    { name: "Grace W.", ticket: "VIP", status: "Checked in" },
    { name: "Brian K.", ticket: "General", status: "Pending" },
    { name: "Mercy A.", ticket: "Advance", status: "Checked in" },
    { name: "Jonah T.", ticket: "Normal", status: "Pending" },
  ];

  return (
    <AppShell
      role="Organizer"
      title="Attendees"
      subtitle="See who bought tickets, who checked in, and who still needs scanning at the gate."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
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

          <div className="mt-6 overflow-x-auto rounded-[1.75rem] border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-950">Recent attendees</h2>
            <table className="mt-4 w-full text-left text-sm text-slate-700">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Ticket</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendeeRows.map((row) => (
                  <tr key={row.name} className="border-t border-slate-200">
                    <td className="px-4 py-3 text-slate-900">{row.name}</td>
                    <td className="px-4 py-3">{row.ticket}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      <span className={`rounded-full px-3 py-1 ${row.status === "Checked in" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Check-in support</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">Manage walk-up and prebooked guests</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Scan tickets at the gate, reassign check-in status, and refresh attendee counts live as the event runs.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Gate tools</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Bulk check-in</p>
                <p className="mt-1">Process groups faster with batch scanning.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Scan activity</p>
                <p className="mt-1">Track the number of scans per event and staff member.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
