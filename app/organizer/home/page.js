"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerHomePage() {
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
      title={`Welcome back, ${session.name}`}
      subtitle="Create events, scan QR codes at the venue, and watch ticket sales update in real time."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Upcoming events</p>
          <p className="mt-3 text-3xl font-semibold">12</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Check-ins today</p>
          <p className="mt-3 text-3xl font-semibold">1,408</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Sales today</p>
          <p className="mt-3 text-3xl font-semibold">KSh 248K</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Scan queue</p>
          <p className="mt-3 text-3xl font-semibold">3</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Organizer actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Create event</div>
          <div className="rounded-2xl bg-slate-50 p-4">Open QR scanner</div>
          <div className="rounded-2xl bg-slate-50 p-4">View attendees</div>
          <div className="rounded-2xl bg-slate-50 p-4">Sales and payouts</div>
        </div>
      </div>
    </AppShell>
  );
}