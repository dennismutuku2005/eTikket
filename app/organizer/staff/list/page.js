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
        <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">Staff and access</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">View active staff assignments, roles, and the events they can manage.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/organizer/staff/createnew")}
              className="inline-flex items-center justify-center rounded-full bg-[#f33959] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
            >
              Add staff member
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-[#0f0f10]">
              <thead className="bg-[#fafafa] text-[#6b6b70]">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Name</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                  <th className="px-5 py-3.5 font-bold">Assigned events</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((member) => (
                  <tr key={member.name} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                    <td className="px-5 py-4 font-bold text-[#0f0f10]">{member.name}</td>
                    <td className="px-5 py-4 text-[#6b6b70]">{member.role}</td>
                    <td className="px-5 py-4 text-[#6b6b70]">{member.events}</td>
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
