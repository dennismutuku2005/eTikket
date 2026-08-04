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
        <div className="card-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">New staff member</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">
                Add a gate admin who can scan tickets and manage check-ins for your live events.
              </p>
            </div>
            <span className="rounded-full bg-[#f33959]/10 px-3 py-1 text-xs font-bold text-[#f33959]">
              Gate staff
            </span>
          </div>

          <form className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Full name</span>
              <input
                type="text"
                placeholder="e.g. Jane Mwangi"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Phone number</span>
              <input
                type="tel"
                placeholder="0722 123 456"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Role</span>
              <select className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition">
                <option>Ticket scanner</option>
                <option>Gate admin</option>
                <option>Event host</option>
                <option>Support staff</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Event access</span>
              <input
                type="text"
                placeholder="Nairobi Glow Festival, Campus Night Live"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#f33959] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d92847]"
            >
              Save staff member
            </button>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="card-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Tips</p>
            <h3 className="mt-2 text-lg font-bold text-[#0f0f10]">Invite staff with event permissions</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
              Staff can be assigned to one or more events. Use the event access field to list their assigned event names, and keep each scanner login limited to a single venue.
            </p>
          </div>

          <div className="card-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Audit</p>
            <div className="mt-4 space-y-3 text-sm text-[#6b6b70]">
              <div className="rounded-[14px] bg-[#fafafa] border border-[#ececec] p-4">
                <p className="font-bold text-[#0f0f10]">Audit-ready logs</p>
                <p className="mt-1 text-xs">Keep staff access assignments in one place for event gate audits.</p>
              </div>
              <div className="rounded-[14px] bg-[#fafafa] border border-[#ececec] p-4">
                <p className="font-bold text-[#0f0f10]">QR scanner access</p>
                <p className="mt-1 text-xs">Only authorized staff can scan tickets with the mobile gate app.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
