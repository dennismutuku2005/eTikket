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
      router.replace("/organizer/login");
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
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-950">Sales summary</h2>
          </div>
          <div className="grid grid-cols-1 gap-px text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Gross sales", "KSh 1.8M"],
              ["Transactions", "4,216"],
              ["Pending payout", "KSh 248K"],
              ["Failed payments", "12"],
            ].map(([label, value]) => (
              <div key={label} className="bg-white px-6 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-950">Transaction log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Transaction</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Urban Fest Nairobi", "Ticket sale", "KSh 2,500", "Completed"],
                  ["Campus Night Live", "Ticket sale", "KSh 1,500", "Completed"],
                  ["Weekend Concert", "Payout", "Pending", "Pending"],
                ].map(([eventName, type, amount, status]) => (
                  <tr key={`${eventName}-${type}`} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-3">{eventName} - {type}</td>
                    <td className="whitespace-nowrap px-6 py-3 font-semibold text-slate-950">{amount}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-slate-500">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}