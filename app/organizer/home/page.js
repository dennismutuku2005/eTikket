"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerHomePage() {
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
      title={`Welcome back, ${session.name}`}
      subtitle="Create events, manage gate admins, configure M-Pesa, and monitor sales from one dashboard."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Active events</p>
          <p className="mt-3 text-3xl font-semibold">14</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Tickets remaining</p>
          <p className="mt-3 text-3xl font-semibold">8,240</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Gate admins</p>
          <p className="mt-3 text-3xl font-semibold">24</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">QR scans today</p>
          <p className="mt-3 text-3xl font-semibold">1,408</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Quick access</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Link href="/organizer/atendeee" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Attendees
          </Link>
          <Link href="/organizer/events" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Events
          </Link>
          <Link href="/organizer/events/active" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Active events
          </Link>
          <Link href="/organizer/events/soldout" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Sold out
          </Link>
          <Link href="/organizer/events/createnew" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Create new event
          </Link>
          <Link href="/organizer/payments" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Payments
          </Link>
          <Link href="/organizer/payments/mpesa" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            M-Pesa config
          </Link>
          <Link href="/organizer/staff" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Gate admins / staff
          </Link>
          <Link href="/organizer/staff/createnew" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Create staff
          </Link>
          <Link href="/organizer/staff/list" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Staff list
          </Link>
          <Link href="/organizer/settings" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Settings
          </Link>
          <Link href="/organizer/home" className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            Overview
          </Link>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Events and ticket stock</h2>
            <p className="mt-1 text-sm text-slate-500">Track remaining tickets for each event.</p>
          </div>
          <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600">
            Create new event
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {[
            ["Urban Fest Nairobi", "1,240 remaining", "82% sold"],
            ["Campus Night Live", "540 remaining", "74% sold"],
            ["Weekend Concert", "1,860 remaining", "61% sold"],
          ].map(([name, remaining, sold]) => (
            <div key={name} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-sm text-slate-500">{remaining}</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-rose-500" style={{ width: sold }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Organizer tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Create event</div>
          <div className="rounded-2xl bg-slate-50 p-4">Create gate admins</div>
          <div className="rounded-2xl bg-slate-50 p-4">Open QR scanner</div>
          <div className="rounded-2xl bg-slate-50 p-4">M-Pesa configuration</div>
          <div className="rounded-2xl bg-slate-50 p-4">Transactions</div>
          <div className="rounded-2xl bg-slate-50 p-4">Settings</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:col-span-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Sales and payouts</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Tickets sold today</span>
              <span className="font-semibold text-slate-900">1,284</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Revenue today</span>
              <span className="font-semibold text-slate-900">KSh 248K</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending payout</span>
              <span className="font-semibold text-slate-900">KSh 86K</span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Audience breakdown</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Men</span>
                <span>58%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-slate-950" style={{ width: "58%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Women</span>
                <span>42%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-rose-500" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}