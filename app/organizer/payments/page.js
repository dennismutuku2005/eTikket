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
            <div key={item.label} className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
              <p className="text-sm font-bold text-[#6b6b70]">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{item.value}</p>
              <p className="mt-1 text-xs text-[#6b6b70]">{item.description}</p>
            </div>
          ))}
        </div>

        <section className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">Transaction log</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">Latest paid and pending entries with M-Pesa reference codes.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-[#ececec] bg-white px-4 py-2 text-xs font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
            >
              Export report
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-[#0f0f10]">
              <thead className="bg-[#fafafa] text-[#6b6b70]">
                <tr>
                  <th className="px-5 py-3.5 text-left font-bold">Event</th>
                  <th className="px-5 py-3.5 text-left font-bold">Type</th>
                  <th className="px-5 py-3.5 text-left font-bold">Amount</th>
                  <th className="px-5 py-3.5 text-left font-bold">Paid by</th>
                  <th className="px-5 py-3.5 text-left font-bold">M-Pesa code</th>
                  <th className="px-5 py-3.5 text-left font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.mpesa} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                    <td className="px-5 py-4 font-bold text-[#0f0f10]">{tx.event}</td>
                    <td className="px-5 py-4 text-[#6b6b70]">{tx.type}</td>
                    <td className="px-5 py-4 font-bold text-[#f33959]">{tx.amount}</td>
                    <td className="px-5 py-4 text-[#6b6b70]">{tx.payer}</td>
                    <td className="px-5 py-4 font-mono text-[#0f0f10]">{tx.mpesa}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tx.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
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
