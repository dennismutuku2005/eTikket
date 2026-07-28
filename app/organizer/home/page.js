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

  const CustomTooltip = ({ active, payload, label, suffix }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-2xl border border-pink-100 bg-white px-3 py-2 text-xs">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-pink-600">{payload[0].value}{suffix}</p>
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
          <div key={card.label} className="rounded-3xl border border-pink-100 bg-white p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-pink-100 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Revenue trend</h2>
              <p className="mt-1 text-sm text-slate-500">Income movement over the last 7 days.</p>
            </div>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">KES</span>
          </div>

          <div className="mt-6 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenuePoints} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#fce7f3" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}K`} />
                <Tooltip content={<CustomTooltip suffix="K" />} cursor={{ stroke: "#fbcfe8" }} />
                <Line type="monotone" dataKey="value" stroke="#db2777" strokeWidth={3} dot={{ r: 4, fill: "#db2777", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-pink-50 pt-4 text-sm text-slate-600">
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

        <div className="rounded-[1.75rem] border border-pink-100 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Daily bookings</h2>
              <p className="mt-1 text-sm text-slate-500">Bookings recorded this week.</p>
            </div>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">Bar</span>
          </div>

          <div className="mt-6 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid stroke="#fce7f3" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value}K`} />
                <Tooltip content={<CustomTooltip suffix="K" />} cursor={{ fill: "#fdf2f8" }} />
                <Bar dataKey="value" fill="#ec4899" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-pink-100 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Bookings flow</h2>
            <p className="mt-1 text-sm text-slate-500">Tickets booked over the last 7 days.</p>
          </div>
          <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">Area</span>
        </div>

        <div className="mt-6 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ticketPoints} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#fce7f3" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<CustomTooltip suffix=" tickets" />} cursor={{ stroke: "#fbcfe8" }} />
              <Area type="monotone" dataKey="value" stroke="#db2777" fill="url(#areaColor)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}