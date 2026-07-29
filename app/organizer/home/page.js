"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerHomePage() {
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

  const revenuePoints = [
    { label: "Mon", value: 48 },
    { label: "Tue", value: 62 },
    { label: "Wed", value: 55 },
    { label: "Thu", value: 70 },
    { label: "Fri", value: 90 },
    { label: "Sat", value: 82 },
    { label: "Sun", value: 96 },
  ];

  const barData = [
    { label: "Mon", value: 54 },
    { label: "Tue", value: 68 },
    { label: "Wed", value: 76 },
    { label: "Thu", value: 88 },
    { label: "Fri", value: 100 },
  ];

  const ticketPoints = [
    { label: "Mon", value: 32 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 38 },
    { label: "Thu", value: 52 },
    { label: "Fri", value: 71 },
    { label: "Sat", value: 64 },
    { label: "Sun", value: 80 },
  ];

  const statCards = [
    { label: "Active events", value: "14", note: "Live events now." },
    { label: "Sold out events", value: "7", note: "Fully booked shows." },
    { label: "Data admins", value: "24", note: "Dashboard users." },
    { label: "KES revenue", value: "KES 1.2M", note: "This month." },
  ];

  const recentPayments = [
    { id: "MPESA-6541", event: "Nairobi Glow Festival", ticket: "VIP", amount: "KES 8,900", status: "Paid", time: "2h ago" },
    { id: "MPESA-7793", event: "Coast Holiday Market", ticket: "Family", amount: "KES 1,600", status: "Paid", time: "5h ago" },
    { id: "MPESA-6118", event: "Campus Night Live", ticket: "Normal", amount: "KES 1,200", status: "Paid", time: "Yesterday" },
    { id: "MPESA-8420", event: "Family Food Fair", ticket: "Normal", amount: "KES 500", status: "Pending", time: "1d ago" },
  ];

  const CustomTooltip = ({ active, payload, label, suffix }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-[#f33959]">{payload[0].value}{suffix}</p>
      </div>
    );
  };

  return (
    <AppShell
      role="Organizer"
      title={`Welcome back, ${session.name}`}
      subtitle="Monitor active events, sold-out shows, and KES revenue in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Revenue trend</h2>
                <p className="mt-1 text-sm text-slate-500">Income movement over the last 7 days.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">KES</span>
            </div>

            <div className="mt-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenuePoints} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#eef2ff" vertical={false} />
                  <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}K`} />
                  <Tooltip content={<CustomTooltip suffix="K" />} cursor={{ stroke: "#f1f5f9" }} />
                  <Line type="monotone" dataKey="value" stroke="#f33959" strokeWidth={3} dot={{ r: 4, fill: "#f33959", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">KES 82K</p>
                <p>Today</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">KES 248K</p>
                <p>This week</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">KES 1.2M</p>
                <p>This month</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Daily bookings</h2>
                <p className="mt-1 text-sm text-slate-500">Bookings recorded this week.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Bar</span>
            </div>

            <div className="mt-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }} barCategoryGap="35%">
                  <CartesianGrid stroke="#eef2ff" vertical={false} />
                  <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}K`} />
                  <Tooltip content={<CustomTooltip suffix="K" />} cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="value" fill="#f33959" radius={[10, 10, 10, 10]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Recent payments</h2>
              <p className="mt-1 text-sm text-slate-500">Latest ticket payments from live events.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/organizer/payments")}
              className="inline-flex items-center justify-center rounded-full bg-[#f33959] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d92847]"
            >
              View payments
            </button>
          </div>

          <ul className="mt-6 space-y-3">
            {recentPayments.map((payment) => (
              <li key={payment.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{payment.event}</p>
                    <p className="mt-1 text-sm text-slate-500">{payment.ticket} ticket</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950">{payment.amount}</p>
                    <p className="mt-1 text-xs text-slate-500">{payment.time}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
                  <span className="text-slate-500">{payment.id}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {payment.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Bookings flow</h2>
            <p className="mt-1 text-sm text-slate-500">Tickets booked over the last 7 days.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Area</span>
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
              <CartesianGrid stroke="#eef2ff" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<CustomTooltip suffix=" tickets" />} cursor={{ stroke: "#f1f5f9" }} />
              <Area type="monotone" dataKey="value" stroke="#f33959" fill="url(#areaColor)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
