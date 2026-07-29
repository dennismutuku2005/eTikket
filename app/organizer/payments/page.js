"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerPaymentsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  const transactions = [
    {
      event: "Urban Fest Nairobi",
      type: "Ticket sale",
      amount: "KSh 2,500",
      status: "Paid",
      payer: "+254 712 345 678",
      mpesa: "AB12CD34",
    },
    {
      event: "Campus Night Live",
      type: "Ticket sale",
      amount: "KSh 1,500",
      status: "Paid",
      payer: "+254 723 456 789",
      mpesa: "XY98ZT76",
    },
    {
      event: "Weekend Concert",
      type: "Payout",
      amount: "KSh 48,000",
      status: "Pending",
      payer: "MPESA payout",
      mpesa: "MPESA-8901",
    },
  ];

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
      subtitle="Review payouts, ticket sales, paid amounts, and MPESA codes in a clean organizer layout."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Gross sales", value: "KSh 1.8M", description: "Total revenue collected" },
            { label: "Transactions", value: "4,216", description: "Successful payments" },
            { label: "Pending payout", value: "KSh 248K", description: "Waiting to clear" },
            { label: "Failed payments", value: "12", description: "Declined or timed out" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Transaction log</h2>
              <p className="mt-2 text-sm text-slate-500">Latest paid and pending entries, with MPESA reference codes and paid amounts.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Export report
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Event</th>
                  <th className="px-6 py-3 text-left font-semibold">Type</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Paid by</th>
                  <th className="px-6 py-3 text-left font-semibold">MPESA code</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.mpesa} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-950">{tx.event}</td>
                    <td className="px-6 py-3 text-slate-700">{tx.type}</td>
                    <td className="px-6 py-3 font-semibold text-slate-950">{tx.amount}</td>
                    <td className="px-6 py-3 text-slate-700">{tx.payer}</td>
                    <td className="px-6 py-3 text-slate-700">{tx.mpesa}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tx.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {tx.status}
                      </span>
                    </td>
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
