"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function SoldOutEventsPage() {
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
      title="Sold out events"
      subtitle="Review events that are full and ready for waitlists or added capacity."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
        {[
          ["VIP Sundowner", "Sold out"],
          ["New Year Bash", "Sold out"],
          ["Exclusive Launch", "Sold out"],
        ].map(([name, status]) => (
          <div key={name} className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{name}</p>
            <p className="mt-3 text-3xl font-semibold text-rose-500">{status}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
