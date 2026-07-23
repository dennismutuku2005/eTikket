"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function UserHomePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const clientSession = getClientSession();

    if (!clientSession) {
      router.replace("/login");
      return;
    }

    if (clientSession.role !== "user") {
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
      role="User"
      title={`Welcome back, ${session.name}`}
      subtitle="View your tickets, download QR codes, and track event purchases in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Active tickets</p>
          <p className="mt-3 text-3xl font-semibold">4</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Saved events</p>
          <p className="mt-3 text-3xl font-semibold">9</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Tickets used</p>
          <p className="mt-3 text-3xl font-semibold">11</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Upcoming events</p>
          <p className="mt-3 text-3xl font-semibold">6</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">User actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Open my tickets</div>
          <div className="rounded-2xl bg-slate-50 p-4">Download QR code</div>
          <div className="rounded-2xl bg-slate-50 p-4">Browse events</div>
          <div className="rounded-2xl bg-slate-50 p-4">Payment history</div>
        </div>
      </div>
    </AppShell>
  );
}