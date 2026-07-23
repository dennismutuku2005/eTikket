"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerSettingsPage() {
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
      title="Settings"
      subtitle="Manage event defaults, notification preferences, and platform-level organizer settings."
    >
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Organizer settings</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">Event defaults</div>
          <div className="rounded-2xl bg-slate-50 p-4">Notification rules</div>
          <div className="rounded-2xl bg-slate-50 p-4">Payout preferences</div>
          <div className="rounded-2xl bg-slate-50 p-4">Account profile</div>
        </div>
      </div>
    </AppShell>
  );
}
