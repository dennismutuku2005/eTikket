"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function CreateStaffPage() {
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

  return (
    <AppShell
      role="Organizer"
      title="Create staff"
      subtitle="Create gate admins and assign QR scanning permissions for each event."
    >
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">New staff member</h2>
              <p className="mt-2 text-sm text-slate-500">
                Add a gate admin who can scan tickets and manage check-ins for your live events.
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
              Gate staff
            </span>
          </div>

          <form className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
              <input
                type="text"
                placeholder="e.g. Jane Mwangi"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Phone number</span>
              <input
                type="tel"
                placeholder="0722 123 456"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Role</span>
              <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white">
                <option>Ticket scanner</option>
                <option>Gate admin</option>
                <option>Event host</option>
                <option>Support staff</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Event access</span>
              <input
                type="text"
                placeholder="Nairobi Glow Festival, Campus Night Live"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Save staff member
            </button>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Tips</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">Invite staff with event permissions</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Staff can be assigned to one or more events. Use the event access field to list their assigned event names, and keep each scanner login limited to a single venue.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Audit</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Audit-ready logs</p>
                <p className="mt-1">Keep staff access assignments in one place for event gate audits.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">QR scanner access</p>
                <p className="mt-1">Only authorized staff can scan tickets with the mobile gate app.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
