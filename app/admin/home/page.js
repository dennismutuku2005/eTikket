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
      subtitle="Oversee organizers, review platform activity, and keep the platform running smoothly."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Organizers</p>
          <p className="mt-3 text-3xl font-semibold">48</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Events live</p>
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
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Admin actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Create and review organizers</div>
          <div className="rounded-2xl bg-slate-50 p-4">Approve payouts</div>
          <div className="rounded-2xl bg-slate-50 p-4">Monitor fraud flags</div>
          <div className="rounded-2xl bg-slate-50 p-4">Platform settings</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:col-span-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Organizer approvals</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>Campus concerts LTD</span>
              <span className="font-semibold text-rose-500">Pending</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>Nairobi Nights Hub</span>
              <span className="font-semibold text-emerald-500">Approved</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>Coast Events Group</span>
              <span className="font-semibold text-rose-500">Pending</span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Platform performance</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Ticket sales growth</span>
                <span>72%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-rose-500" style={{ width: "72%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Payment success</span>
                <span>96%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-slate-950" style={{ width: "96%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}