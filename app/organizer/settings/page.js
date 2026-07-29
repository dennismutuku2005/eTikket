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
      subtitle="Manage event defaults, get alerts sooner, and update organizer settings."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Organizer settings</h2>
              <p className="mt-2 text-sm text-slate-500">Update defaults, receive alerts sooner, and edit account details for your organizer profile.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Profile</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Event defaults", description: "Pre-fill categories, venues, and ticket settings." },
              { label: "Notification rules", description: "Choose how you receive sales and attendee alerts." },
              { label: "Payout preferences", description: "Set payout frequency and destination accounts." },
              { label: "Account profile", description: "Update your name, email, and organizer details." },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Quick actions</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-900 transition hover:bg-slate-100">
                Edit payout settings
              </button>
              <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-900 transition hover:bg-slate-100">
                Set ticket reminder emails
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Support</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Need help with settings or account setup? Open the support page for step-by-step guidance.</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
