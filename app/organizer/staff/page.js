"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerStaffPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState([
    {
      name: "Jane Mwangi",
      phone: "0722 123 456",
      password: "••••••••",
      events: "Nairobi Glow Festival, Campus Night Live",
      qrAccess: true,
    },
    {
      name: "Michael Otieno",
      phone: "0712 987 654",
      password: "••••••••",
      events: "Coast Holiday Market",
      qrAccess: true,
    },
    {
      name: "Aisha Kamau",
      phone: "0733 555 888",
      password: "••••••••",
      events: "Family Food Fair, Founders Mixer",
      qrAccess: false,
    },
  ]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    phone: "",
    password: "",
    events: "",
    qrAccess: true,
  });

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

  function handleCreateSubmit(event) {
    event.preventDefault();
    setStaffMembers((current) => [...current, newStaff]);
    setNewStaff({ name: "", phone: "", password: "", events: "", qrAccess: true });
    setIsCreateOpen(false);
  }

  return (
    <AppShell
      role="Organizer"
      title="Gate admins and staff"
      subtitle="Create gate admins, assign scanner access, and track who is checking tickets at each event."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Door staff</p>
            <p className="mt-3 text-3xl font-semibold">{staffMembers.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Scanner sessions</p>
            <p className="mt-3 text-3xl font-semibold">92</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Active venues</p>
            <p className="mt-3 text-3xl font-semibold">11</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Staff controls</h2>
              <p className="mt-2 text-sm text-slate-500">Create door staff, assign event scanner access, and review who can verify tickets at each venue.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Create door staff
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Password</th>
                  <th className="px-5 py-4 font-semibold">Assigned events</th>
                  <th className="px-5 py-4 font-semibold">QR scan access</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((member) => (
                  <tr key={member.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{member.name}</td>
                    <td className="px-5 py-4">{member.phone}</td>
                    <td className="px-5 py-4">{member.password ? "••••••••" : "Not set"}</td>
                    <td className="px-5 py-4">{member.events}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${member.qrAccess ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {member.qrAccess ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isCreateOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
              <div className="w-full max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">Create new gate admin</h3>
                    <p className="mt-2 text-sm text-slate-500">Add a staff member who can scan QR codes and verify tickets across events.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleCreateSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-900">Full name</span>
                      <input
                        value={newStaff.name}
                        onChange={(event) => setNewStaff((current) => ({ ...current, name: event.target.value }))}
                        placeholder="e.g. Jane Mwangi"
                        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-900">Phone number</span>
                      <input
                        value={newStaff.phone}
                        onChange={(event) => setNewStaff((current) => ({ ...current, phone: event.target.value }))}
                        placeholder="0722 123 456"
                        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Password</span>
                    <input
                      type="password"
                      value={newStaff.password}
                      onChange={(event) => setNewStaff((current) => ({ ...current, password: event.target.value }))}
                      placeholder="Enter password"
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Assigned event access</span>
                    <input
                      value={newStaff.events}
                      onChange={(event) => setNewStaff((current) => ({ ...current, events: event.target.value }))}
                      placeholder="Nairobi Glow Festival, Campus Night Live"
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </label>

                  <label className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                    <input
                      type="checkbox"
                      checked={newStaff.qrAccess}
                      onChange={(event) => setNewStaff((current) => ({ ...current, qrAccess: event.target.checked }))}
                      className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    Enable QR scan permissions
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Add gate staff
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
