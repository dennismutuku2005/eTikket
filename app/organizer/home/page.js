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

  const maxBarValue = Math.max(...barData.map((item) => item.value));
  const maxAreaValue = Math.max(...revenuePoints.map((item) => item.value));

  return (
    <AppShell
      role="Organizer"
      title={`Welcome back, ${session.name}`}
      subtitle="Monitor active events, sold-out shows, and KES revenue in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Active events</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">14</p>
          <p className="mt-1 text-sm text-slate-600">Live events now.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Sold out events</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">7</p>
          <p className="mt-1 text-sm text-slate-600">Fully booked shows.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Data admins</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">24</p>
          <p className="mt-1 text-sm text-slate-600">Dashboard users.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">KES revenue</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">KES 1.2M</p>
          <p className="mt-1 text-sm text-slate-600">This month.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">KES revenue trend</h2>
              <p className="mt-1 text-sm text-slate-500">Income movement over the last 7 days.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">KES</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-slate-950/5 p-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenuePoints} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}K`} />
                <Tooltip formatter={(value) => [`${value}K`, "Revenue"]} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-600">
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
              <h2 className="text-xl font-semibold">Bar chart</h2>
              <p className="mt-1 text-sm text-slate-500">Daily KES bookings this week.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Bar</span>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}K`} />
                <Tooltip formatter={(value) => [`${value}K`, "Bookings"]} />
                <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Area graph</h2>
            <p className="mt-1 text-sm text-slate-500">Bookings and KES flow.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Area</span>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-slate-950/5 p-4">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenuePoints} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}K`} />
              <Tooltip formatter={(value) => [`${value}K`, "Events"]} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#areaColor)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
