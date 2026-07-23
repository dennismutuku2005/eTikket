"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function StaffListPage() {
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
      title="Staff list"
      subtitle="Review gate admins, scanner access, and which events each staff member can open."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-2">
        {[
          ["Gate Admin 01", "Nairobi Night Live"],
          ["Gate Admin 02", "Urban Fest Nairobi"],
          ["Gate Admin 03", "Weekend Concert"],
        ].map(([name, event]) => (
          <div key={name} className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{name}</p>
            <p className="mt-3 text-base font-semibold text-slate-900">{event}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
