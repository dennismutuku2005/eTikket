"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function AdminHomePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const clientSession = getClientSession();

    if (!clientSession) {
      router.replace("/login");
      return;
    }

    if (clientSession.role !== "admin") {
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
      role="Admin"
      title={`Welcome back, ${session.name}`}
      subtitle="Manage the platform, oversee organizers, and monitor revenue in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Active events</p>
          <p className="mt-3 text-3xl font-semibold">128</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Tickets sold</p>
          <p className="mt-3 text-3xl font-semibold">24,920</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-3 text-3xl font-semibold">KSh 3.4M</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending payouts</p>
          <p className="mt-3 text-3xl font-semibold">7</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Admin actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Review organizers</div>
          <div className="rounded-2xl bg-slate-50 p-4">Approve payouts</div>
          <div className="rounded-2xl bg-slate-50 p-4">Monitor fraud flags</div>
          <div className="rounded-2xl bg-slate-50 p-4">System settings</div>
        </div>
      </div>
    </AppShell>
  );
}