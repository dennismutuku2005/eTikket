"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerMpesaPage() {
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
      title="M-Pesa configuration"
      subtitle="Set the paybill, till, callbacks, and ticket payment rules for your events."
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Paybill integration</h2>
              <p className="mt-2 text-sm text-slate-500">Configure your M-Pesa paybill settings and webhook endpoints for ticket payments.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Live</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Paybill</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">123456</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Till</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">789012</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Callback URL</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">https://etikket.co.ke/api/mpesa/callback</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Webhook secret</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">••••••••</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Transaction rules</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Configure payment success callbacks and refund rules for event ticket purchases. This ensures accounting stays aligned with M-Pesa receipts.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[1.75rem] border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold text-slate-950">Recent M-Pesa receipts</h3>
            <table className="mt-4 w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ref: "PAY12345", amount: "KSh 2,500", event: "Nairobi Glow Festival", status: "Confirmed" },
                  { ref: "PAY12346", amount: "KSh 1,200", event: "Campus Night Live", status: "Confirmed" },
                  { ref: "PAY12347", amount: "KSh 1,500", event: "Coast Holiday Market", status: "Pending" },
                ].map((row) => (
                  <tr key={row.ref} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.ref}</td>
                    <td className="px-4 py-3">{row.amount}</td>
                    <td className="px-4 py-3">{row.event}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.status === "Confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">M-Pesa status</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">Connected</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your paybill and webhook are configured. Incoming ticket payments will automatically be marked as paid when the callback is received.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Setup guide</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-3xl bg-slate-50 p-4">Use the correct paybill for ticket payments and not the event vendor paybill.</li>
              <li className="rounded-3xl bg-slate-50 p-4">Verify callback URLs in the M-Pesa portal and keep secrets private.</li>
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
