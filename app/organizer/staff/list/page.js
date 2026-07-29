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

  const staffMembers = [
    { name: "Jane Mwangi", role: "Gate admin", events: "Nairobi Glow Festival, Campus Night Live" },
    { name: "Michael Otieno", role: "Ticket scanner", events: "Coast Holiday Market" },
    { name: "Aisha Kamau", role: "Support staff", events: "Family Food Fair, Founders Mixer" },
  ];

  return (
    <AppShell
      role="Organizer"
      title="Staff list"
      subtitle="Review gate admins, scanner access, and which events each staff member can open."
    >
      <div className="space-y-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Staff and access</h2>
              <p className="mt-2 text-sm text-slate-500">View active staff assignments, roles, and the events they can manage.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/organizer/staff/createnew")}
              className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Add staff member
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Assigned events</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((member) => (
                  <tr key={member.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{member.name}</td>
                    <td className="px-5 py-4">{member.role}</td>
                    <td className="px-5 py-4">{member.events}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
