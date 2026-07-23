"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerStaffPage() {
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
      title="Gate admins and staff"
      subtitle="Create gate admins, assign scanner access, and track who is checking tickets at each event."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Gate admins</p>
          <p className="mt-3 text-3xl font-semibold">24</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Scanner sessions</p>
          <p className="mt-3 text-3xl font-semibold">92</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Active venues</p>
          <p className="mt-3 text-3xl font-semibold">11</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Staff controls</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Create gate admin</div>
          <div className="rounded-2xl bg-slate-50 p-4">Assign event access</div>
          <div className="rounded-2xl bg-slate-50 p-4">QR scan permissions</div>
          <div className="rounded-2xl bg-slate-50 p-4">Activity log</div>
        </div>
      </div>
    </AppShell>
  );
}
