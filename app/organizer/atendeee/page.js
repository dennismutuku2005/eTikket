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

  return (
    <AppShell
      role="Organizer"
      title="Attendees"
      subtitle="See who bought tickets, who checked in, and who still needs scanning at the gate."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total attendees</p>
          <p className="mt-3 text-3xl font-semibold">8,420</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Checked in</p>
          <p className="mt-3 text-3xl font-semibold">6,188</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending scan</p>
          <p className="mt-3 text-3xl font-semibold">2,232</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Repeat visits</p>
          <p className="mt-3 text-3xl font-semibold">126</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Attendee list</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <span>Grace W.</span>
            <span className="font-semibold text-slate-900">Checked in</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <span>Brian K.</span>
            <span className="font-semibold text-rose-500">Pending</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <span>Mercy A.</span>
            <span className="font-semibold text-slate-900">Checked in</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
