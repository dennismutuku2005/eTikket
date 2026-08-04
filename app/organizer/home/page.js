"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";

function fmtKes(n) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
  return `KES ${n}`;
}

const CustomTooltip = ({ active, payload, label, suffix }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[14px] border border-[#ececec] bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-bold text-[#0f0f10]">{label}</p>
      <p className="mt-0.5 font-bold text-[#f33959]">{payload[0].value}{suffix}</p>
    </div>
  );
};

export default function OrganizerHomePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

    (async () => {
      try {
        const [analyticsData, ordersData] = await Promise.all([
          apiRequestAuth("/analytics/summary", clientSession.token),
          apiRequestAuth("/orders/mine?limit=5", clientSession.token),
        ]);
        setAnalytics(analyticsData);
        setOrders(ordersData?.data || []);
      } catch (err) {
        if (err instanceof AuthError) { handleAuthError("organizer"); return; }
        console.warn("Dashboard data error:", err.message);
        // Show zeroed state on error
        setAnalytics({
          totalRevenue: 0,
          totalOrders: 0,
          totalTickets: 0,
          activeEvents: 0,
          soldOutEvents: 0,
          revenueByDay: [],
          bookingsByDay: [],
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (!session) return null;

  const statCards = [
    { label: "Active events", value: loading ? "…" : String(analytics?.activeEvents ?? 0), note: "Live events now." },
    { label: "Sold out events", value: loading ? "…" : String(analytics?.soldOutEvents ?? 0), note: "Fully booked shows." },
    { label: "Orders", value: loading ? "…" : String(analytics?.totalOrders ?? 0), note: "Total ticket orders." },
    { label: "KES revenue", value: loading ? "…" : fmtKes(analytics?.totalRevenue ?? 0), note: "All time revenue." },
  ];

  const revenuePoints = analytics?.revenueByDay?.length
    ? analytics.revenueByDay
    : [{ label: "—", value: 0 }];

  const ticketPoints = analytics?.bookingsByDay?.length
    ? analytics.bookingsByDay
    : [{ label: "—", value: 0 }];

  const barData = analytics?.bookingsByDay?.slice(0, 5)?.length
    ? analytics.bookingsByDay.slice(0, 5)
    : [{ label: "—", value: 0 }];

  return (
    <AppShell
      role="Organizer"
      title={`Welcome back, ${session.name}`}
      subtitle="Monitor active events, sold-out shows, and KES revenue in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="card">
            <p className="text-sm font-bold text-[#6b6b70]">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-[#0f0f10]">{card.value}</p>
            <p className="mt-1 text-xs text-[#6b6b70]">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="space-y-4">
          <div className="card-lg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0f0f10]">Revenue trend</h2>
                <p className="mt-1 text-sm text-[#6b6b70]">Income movement over the last 7 days.</p>
              </div>
              <span className="pill-muted">KES</span>
            </div>

            <div className="mt-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenuePoints} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#ececec" vertical={false} />
                  <XAxis dataKey="label" stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => fmtKes(v)} />
                  <Tooltip content={<CustomTooltip suffix=" KES" />} cursor={{ stroke: "#ececec" }} />
                  <Line type="monotone" dataKey="value" stroke="#f33959" strokeWidth={3} dot={{ r: 4, fill: "#f33959", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#ececec] pt-4 text-sm text-[#6b6b70]">
              <div>
                <p className="font-bold text-[#0f0f10]">{fmtKes(revenuePoints[revenuePoints.length - 1]?.value || 0)}</p>
                <p className="text-xs">Today</p>
              </div>
              <div>
                <p className="font-bold text-[#0f0f10]">{fmtKes(revenuePoints.reduce((s, r) => s + r.value, 0))}</p>
                <p className="text-xs">This week</p>
              </div>
              <div>
                <p className="font-bold text-[#0f0f10]">{fmtKes(analytics?.totalRevenue ?? 0)}</p>
                <p className="text-xs">All time</p>
              </div>
            </div>
          </div>

          <div className="card-lg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0f0f10]">Daily bookings</h2>
                <p className="mt-1 text-sm text-[#6b6b70]">Bookings recorded this week.</p>
              </div>
              <span className="pill-muted">Bar</span>
            </div>

            <div className="mt-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }} barCategoryGap="35%">
                  <CartesianGrid stroke="#ececec" vertical={false} />
                  <XAxis dataKey="label" stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip content={<CustomTooltip suffix=" orders" />} cursor={{ fill: "#f4f4f5" }} />
                  <Bar dataKey="value" fill="#f33959" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">Recent orders</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">Latest ticket orders across your events.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/organizer/payments")}
              className="btn-clean btn-primary text-xs"
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-[16px] bg-[#f4f4f5]" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-8 text-center text-sm text-[#6b6b70]">
              <p className="text-3xl">🎟️</p>
              <p className="mt-3 font-bold text-[#0f0f10]">No orders yet</p>
              <p className="mt-1">Orders will appear here after your first ticket sale.</p>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="surface-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#0f0f10]">{order.event_title || "Event"}</p>
                      <p className="mt-0.5 text-xs text-[#6b6b70]">{order.buyer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0f0f10]">KES {Number(order.total_amount).toLocaleString()}</p>
                      <p className="mt-0.5 text-xs text-[#6b6b70]">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#6b6b70]">
                    <span className="font-mono">{order.order_number}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.status === "completed" || order.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 card-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0f0f10]">Bookings flow</h2>
            <p className="mt-1 text-sm text-[#6b6b70]">Ticket orders over the last 7 days.</p>
          </div>
          <span className="pill-muted">Area</span>
        </div>

        <div className="mt-6 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ticketPoints} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f33959" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#f33959" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ececec" vertical={false} />
              <XAxis dataKey="label" stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#6b6b70" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<CustomTooltip suffix=" orders" />} cursor={{ stroke: "#ececec" }} />
              <Area type="monotone" dataKey="value" stroke="#f33959" fill="url(#areaColor)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
