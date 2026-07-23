"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerPaymentsPage() {
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
      title="Payments"
      subtitle="Review payouts, ticket sales, and transaction history for every event."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Gross sales</p>
          <p className="mt-3 text-3xl font-semibold">KSh 1.8M</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Transactions</p>
          <p className="mt-3 text-3xl font-semibold">4,216</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending payout</p>
          <p className="mt-3 text-3xl font-semibold">KSh 248K</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Failed payments</p>
          <p className="mt-3 text-3xl font-semibold">12</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Transaction log</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <span>Urban Fest Nairobi - Ticket sale</span>
            <span className="font-semibold text-slate-900">KSh 2,500</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <span>Campus Night Live - Ticket sale</span>
            <span className="font-semibold text-slate-900">KSh 1,500</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <span>Weekend Concert - Payout</span>
            <span className="font-semibold text-rose-500">Pending</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
