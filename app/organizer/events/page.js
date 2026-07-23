"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerEventsPage() {
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
      title="Events"
      subtitle="Create events, edit details, and monitor ticket stock across every event you manage."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Live events</p>
          <p className="mt-3 text-3xl font-semibold">14</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Draft events</p>
          <p className="mt-3 text-3xl font-semibold">5</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Sold out</p>
          <p className="mt-3 text-3xl font-semibold">3</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Event management</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Create new event</div>
          <div className="rounded-2xl bg-slate-50 p-4">Edit existing event</div>
          <div className="rounded-2xl bg-slate-50 p-4">Ticket stock</div>
          <div className="rounded-2xl bg-slate-50 p-4">Publish / unpublish</div>
        </div>
      </div>
    </AppShell>
  );
}
