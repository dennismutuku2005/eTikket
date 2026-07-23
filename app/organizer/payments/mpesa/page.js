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
      title="M-Pesa configuration"
      subtitle="Set the paybill, till, callbacks, and ticket payment rules for your events."
    >
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Connection settings</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Paybill number</div>
          <div className="rounded-2xl bg-slate-50 p-4">Till number</div>
          <div className="rounded-2xl bg-slate-50 p-4">Callback URL</div>
          <div className="rounded-2xl bg-slate-50 p-4">Webhook secret</div>
        </div>
      </div>
    </AppShell>
  );
}
