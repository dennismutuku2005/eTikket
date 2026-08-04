"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiUsers, FiCamera, FiPlus, FiTrash2, FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";

const EMPTY_FORM = { full_name: "", email: "", phone: "", password: "", role: "gate_staff" };

export default function OrganizerStaffPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    const clientSession = getClientSession();
    if (!clientSession) { router.replace("/organizer/login"); return; }
    if (clientSession.role !== "organizer") { router.replace(getRoleHomePath(clientSession.role)); return; }
    setSession(clientSession);
    loadStaff(clientSession.token);
  }, [router]);

  async function loadStaff(token) {
    try {
      const data = await apiRequestAuth("/staff", token);
      setStaffMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof AuthError) { handleAuthError("organizer"); return; }
      toast.error(err.message || "Failed to load staff.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      toast.error("All fields are required.");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequestAuth("/staff", session.token, {
        method: "POST",
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password_hash: form.password, // backend should hash; for now stores as-is
          role: form.role,
        }),
      });
      toast.success(`Gate staff "${form.full_name}" created. They can now log in at /gatestaff/login.`);
      setForm(EMPTY_FORM);
      setIsCreateOpen(false);
      await loadStaff(session.token);
    } catch (err) {
      toast.error(err.message || "Failed to create staff member.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(staffId, staffName) {
    if (!confirm(`Remove "${staffName}" from your staff? They will lose gate access.`)) return;
    setDeletingId(staffId);
    try {
      await apiRequestAuth(`/staff/${staffId}`, session.token, { method: "DELETE" });
      toast.success("Staff member removed.");
      setStaffMembers((prev) => prev.filter((s) => s.id !== staffId));
    } catch (err) {
      toast.error(err.message || "Failed to delete staff.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!session) return null;

  return (
    <AppShell
      role="Organizer"
      title="Gate staff"
      subtitle="Create gate admins, assign scanner access, and track who checks tickets at each event."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f4f4f5] p-3 text-[#f33959]"><FiUsers size={18} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Organizer</p>
                <p className="mt-1 text-base font-bold text-[#0f0f10]">{session?.name}</p>
                <p className="mt-0.5 text-xs text-[#6b6b70]">{session?.email}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f4f4f5] p-3 text-[#f33959]"><FiUsers size={18} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Door staff</p>
                <p className="mt-1 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : staffMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f4f4f5] p-3 text-[#f33959]"><FiCamera size={18} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Gate staff</p>
                <p className="mt-1 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : staffMembers.filter((s) => s.role === "gate_staff").length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f4f4f5] p-3 text-[#f33959]"><FiLock size={18} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Gate admins</p>
                <p className="mt-1 text-3xl font-bold text-[#0f0f10]">{loading ? "…" : staffMembers.filter((s) => s.role === "gate_admin").length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">Staff members</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">
                Staff created here receive a user account and can log in at{" "}
                <span className="font-bold text-[#0f0f10]">/gatestaff/login</span> with their email and password.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="btn-clean btn-primary inline-flex items-center justify-center gap-2"
            >
              <FiPlus size={16} />
              Create door staff
            </button>
          </div>

          {loading ? (
            <div className="mt-8 space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-[14px] bg-[#f4f4f5]" />)}
            </div>
          ) : staffMembers.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-4xl">🚪</p>
              <p className="mt-4 text-lg font-bold text-[#0f0f10]">No gate staff yet</p>
              <p className="mt-2 text-sm text-[#6b6b70]">Create door staff so they can check tickets at your events.</p>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="btn-clean btn-primary mt-6 inline-flex items-center gap-2"
              >
                <FiPlus size={16} />
                Add your first staff
              </button>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="clean-table min-w-[640px] w-full">
                <thead>
                  <tr>
                    <th className="px-5 py-3.5 text-left font-bold text-[#6b6b70]">Name</th>
                    <th className="px-5 py-3.5 text-left font-bold text-[#6b6b70]">Email</th>
                    <th className="px-5 py-3.5 text-left font-bold text-[#6b6b70]">Phone</th>
                    <th className="px-5 py-3.5 text-left font-bold text-[#6b6b70]">Role</th>
                    <th className="px-5 py-3.5 text-left font-bold text-[#6b6b70]">Joined</th>
                    <th className="px-5 py-3.5 text-left font-bold text-[#6b6b70]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((member) => (
                    <tr key={member.id} className="border-t border-[#ececec] transition hover:bg-[#f4f4f5]">
                      <td className="px-5 py-4 font-bold text-[#0f0f10]">{member.full_name}</td>
                      <td className="px-5 py-4 text-[#6b6b70] text-sm">{member.email}</td>
                      <td className="px-5 py-4 text-[#6b6b70]">{member.phone}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${member.role === "gate_staff" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#6b6b70] text-xs">{member.created_at ? new Date(member.created_at).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(member.id, member.full_name)}
                          disabled={deletingId === member.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#f33959]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#f33959] transition hover:bg-[#fff2f4] disabled:opacity-50"
                        >
                          {deletingId === member.id ? <FiLoader size={12} className="animate-spin" /> : <FiTrash2 size={12} />}
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create staff modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-[24px] border border-[#ececec] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">Door staff setup</p>
                <h3 className="mt-1 text-xl font-bold text-[#0f0f10]">Create new gate staff</h3>
                <p className="mt-1 text-xs text-[#6b6b70]">They will be able to log in at /gatestaff/login with these credentials.</p>
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
                  <span className="text-sm font-bold text-[#0f0f10]">Full name *</span>
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Jane Mwangi"
                    className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-[#0f0f10]">Phone number *</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="0722 123 456"
                    className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-[#0f0f10]">Email *</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#0f0f10]">Password *</span>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Set a secure password"
                    className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 pr-12 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b6b70] hover:text-[#0f0f10]"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#0f0f10]">Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                >
                  <option value="gate_staff">Gate staff</option>
                  <option value="gate_admin">Gate admin</option>
                </select>
              </label>

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => { setIsCreateOpen(false); setForm(EMPTY_FORM); }}
                  className="rounded-full border border-[#ececec] bg-white px-5 py-2.5 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f33959] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d92847] disabled:opacity-50"
                >
                  {isSaving ? <FiLoader size={14} className="animate-spin" /> : null}
                  {isSaving ? "Creating…" : "Add gate staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
