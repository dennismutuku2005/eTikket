"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiUsers, FiCamera, FiPlus } from "react-icons/fi";
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
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  function togglePassword(name) {
    setVisiblePasswords((s) => ({ ...s, [name]: !s[name] }));
  }

  return (
    <AppShell
      role="Organizer"
      title="Gate admins and staff"
      subtitle="Create gate admins, assign scanner access, and track who is checking tickets at each event."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f4f4f5] p-3 text-[#f33959]"><FiUsers size={18} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Door staff</p>
                <p className="mt-1 text-3xl font-bold text-[#0f0f10]">{staffMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f4f4f5] p-3 text-[#f33959]"><FiCamera size={18} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Scanner sessions</p>
                <p className="mt-1 text-3xl font-bold text-[#0f0f10]">92</p>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f4f4f5] p-3 text-[#f33959]"><FiLock size={18} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Active venues</p>
                <p className="mt-1 text-3xl font-bold text-[#0f0f10]">11</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">Staff controls</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">Create door staff, assign event scanner access, and review who can verify tickets at each venue.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f33959] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
            >
              <FiPlus size={16} />
              Create door staff
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#0f0f10]">
              <thead className="bg-[#fafafa] text-[#6b6b70]">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Name</th>
                  <th className="px-5 py-3.5 font-bold">Phone</th>
                  <th className="px-5 py-3.5 font-bold">Password</th>
                  <th className="px-5 py-3.5 font-bold">Assigned events</th>
                  <th className="px-5 py-3.5 font-bold">QR scan access</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((member) => (
                  <tr key={member.name} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                    <td className="px-5 py-4 font-bold text-[#0f0f10]">{member.name}</td>
                    <td className="px-5 py-4 text-[#6b6b70]">{member.phone}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs">{visiblePasswords[member.name] ? member.password : (member.password ? "••••••••" : "Not set")}</span>
                        <button
                          type="button"
                          onClick={() => togglePassword(member.name)}
                          className="text-[#6b6b70] hover:text-[#0f0f10]"
                          aria-label="Toggle password visibility"
                        >
                          {visiblePasswords[member.name] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#6b6b70]">{member.events}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${member.qrAccess ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {member.qrAccess ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isCreateOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
              <div className="w-full max-w-xl rounded-[24px] border border-[#ececec] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">Door staff setup</p>
                    <h3 className="mt-1 text-xl font-bold text-[#0f0f10]">Create new gate staff</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0f0f10] hover:bg-[#f4f4f5]"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-bold text-[#0f0f10]">Full name</span>
                      <input
                        value={newStaff.name}
                        onChange={(event) => setNewStaff((current) => ({ ...current, name: event.target.value }))}
                        placeholder="e.g. Jane Mwangi"
                        className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-[#0f0f10]">Phone number</span>
                      <input
                        value={newStaff.phone}
                        onChange={(event) => setNewStaff((current) => ({ ...current, phone: event.target.value }))}
                        placeholder="0722 123 456"
                        className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-bold text-[#0f0f10]">Password</span>
                    <div className="relative mt-1.5">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newStaff.password}
                        onChange={(event) => setNewStaff((current) => ({ ...current, password: event.target.value }))}
                        placeholder="Enter password"
                        className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 pr-12 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((s) => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b6b70] hover:text-[#0f0f10]"
                        aria-label="Toggle new password visibility"
                      >
                        {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-[#0f0f10]">Assigned event access</span>
                    <input
                      value={newStaff.events}
                      onChange={(event) => setNewStaff((current) => ({ ...current, events: event.target.value }))}
                      placeholder="Nairobi Glow Festival, Campus Night Live"
                      className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                    />
                  </label>

                  <label className="flex items-center gap-3 text-sm font-bold text-[#0f0f10]">
                    <input
                      type="checkbox"
                      checked={newStaff.qrAccess}
                      onChange={(event) => setNewStaff((current) => ({ ...current, qrAccess: event.target.checked }))}
                      className="h-4 w-4 rounded border-[#ececec] text-[#f33959] focus:ring-[#f33959]"
                    />
                    Enable QR scan permissions
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="rounded-full border border-[#ececec] bg-white px-5 py-2.5 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-[#f33959] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
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
