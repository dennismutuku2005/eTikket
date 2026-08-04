"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";
import { toast } from "sonner";

function fmtKes(n) {
  const num = Number(n) || 0;
  if (num >= 1_000_000) return `KES ${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `KES ${(num / 1_000).toFixed(0)}K`;
  return `KES ${num}`;
}

export default function OrganizerPaymentsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const clientSession = getClientSession();
    if (!clientSession) { router.replace("/organizer/login"); return; }
    if (clientSession.role !== "organizer") { router.replace(getRoleHomePath(clientSession.role)); return; }
    setSession(clientSession);

    (async () => {
      try {
        const data = await apiRequestAuth("/orders/mine?limit=100", clientSession.token);
        setOrders(data?.data || []);
      } catch (err) {
        if (err instanceof AuthError) { handleAuthError("organizer"); return; }
        toast.error(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (!session) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const paidCount = orders.filter((o) => o.status === "completed" || o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const filtered = orders.filter((o) =>
    !search.trim() ||
    (o.buyer_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.event_title || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.order_number || "").toLowerCase().includes(search.toLowerCase()),
  );

  function exportCSV() {
    const header = "Order #,Event,Buyer,Email,Phone,Amount,Status,Date";
    const rows = orders.map((o) =>
      [o.order_number, o.event_title, o.buyer_name, o.buyer_email, o.buyer_phone,
       o.total_amount, o.status, new Date(o.created_at).toLocaleDateString()].join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
  }

  return (
    <AppShell
      role="Organizer"
      title="Payments"
      subtitle="Review all ticket orders and payments across your events."
    >
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Gross sales", value: loading ? "…" : fmtKes(totalRevenue), description: "Total revenue collected" },
            { label: "Transactions", value: loading ? "…" : String(orders.length), description: "Total orders" },
            { label: "Completed", value: loading ? "…" : String(paidCount), description: "Paid/completed orders" },
            { label: "Pending", value: loading ? "…" : String(pendingCount), description: "Awaiting payment" },
          ].map((item) => (
            <div key={item.label} className="card">
              <p className="text-sm font-bold text-[#6b6b70]">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{item.value}</p>
              <p className="mt-1 text-xs text-[#6b6b70]">{item.description}</p>
            </div>
          ))}
        </div>

        <section className="card-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">Transaction log</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">All ticket orders for events you manage.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders…"
                className="h-10 rounded-[12px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] transition"
              />
              <button
                type="button"
                onClick={exportCSV}
                className="btn-clean btn-secondary text-xs whitespace-nowrap"
              >
                Export CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 animate-pulse rounded-[14px] bg-[#f4f4f5]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-4xl">💳</p>
              <p className="mt-4 text-lg font-bold text-[#0f0f10]">{orders.length === 0 ? "No orders yet" : "No matching orders"}</p>
              <p className="mt-2 text-sm text-[#6b6b70]">
                {orders.length === 0 ? "Orders will appear here once buyers start purchasing tickets." : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="clean-table min-w-[800px] w-full">
                <thead className="bg-[#fafafa] text-[#6b6b70]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-bold">Order #</th>
                    <th className="px-5 py-3.5 text-left font-bold">Event</th>
                    <th className="px-5 py-3.5 text-left font-bold">Buyer</th>
                    <th className="px-5 py-3.5 text-left font-bold">Phone</th>
                    <th className="px-5 py-3.5 text-left font-bold">Amount</th>
                    <th className="px-5 py-3.5 text-left font-bold">Date</th>
                    <th className="px-5 py-3.5 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                      <td className="px-5 py-4 font-mono text-xs text-[#6b6b70]">{order.order_number}</td>
                      <td className="px-5 py-4 font-bold text-[#0f0f10]">{order.event_title || "—"}</td>
                      <td className="px-5 py-4 text-[#6b6b70]">
                        <p>{order.buyer_name}</p>
                        <p className="text-xs">{order.buyer_email}</p>
                      </td>
                      <td className="px-5 py-4 text-[#6b6b70]">{order.buyer_phone}</td>
                      <td className="px-5 py-4 font-bold text-[#f33959]">KES {Number(order.total_amount).toLocaleString()}</td>
                      <td className="px-5 py-4 text-[#6b6b70]">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          order.status === "completed" || order.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-[#f4f4f5] text-[#6b6b70]"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
