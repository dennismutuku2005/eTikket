"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";
import { toast } from "sonner";

export default function CreateStaffPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [isSaving, setIsSaving] = useState(false);

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

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.password) {
      toast.error("Please complete the name, email, phone, and password fields.");
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
          password_hash: form.password,
        }),
      });
      toast.success("Ticket scanner account created.");
      router.push("/organizer/staff");
    } catch (error) {
      if (error instanceof AuthError) {
        handleAuthError("organizer");
        return;
      }
      toast.error(error.message || "Failed to create staff account.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell
      role="Organizer"
      title="Create staff"
      subtitle="Create a ticket scanner account for your event entrance."
    >
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="card-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">New staff member</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">
                Add a staff member who can sign in and scan tickets at the gate.
              </p>
            </div>
            <span className="rounded-full bg-[#f33959]/10 px-3 py-1 text-xs font-bold text-[#f33959]">
              Gate staff
            </span>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Full name</span>
              <input
                name="full_name"
                value={form.full_name}
                onChange={updateField}
                type="text"
                placeholder="e.g. Jane Mwangi"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Phone number</span>
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                type="tel"
                placeholder="0722 123 456"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Email address</span>
              <input
                name="email"
                value={form.email}
                onChange={updateField}
                type="email"
                autoComplete="username"
                placeholder="scanner@example.com"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Login password</span>
              <input
                name="password"
                value={form.password}
                onChange={updateField}
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                required
              />
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#f33959] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d92847]"
            >
              {isSaving ? "Creating account..." : "Create ticket scanner"}
            </button>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="card-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Tips</p>
            <h3 className="mt-2 text-lg font-bold text-[#0f0f10]">Invite staff with event permissions</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
              Staff can be assigned to one or more events. Use the event access field to list their assigned event names, and keep each scanner login limited to a single venue.
            </p>
          </div>

          <div className="card-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Audit</p>
            <div className="mt-4 space-y-3 text-sm text-[#6b6b70]">
              <div className="rounded-[14px] bg-[#fafafa] border border-[#ececec] p-4">
                <p className="font-bold text-[#0f0f10]">Audit-ready logs</p>
                <p className="mt-1 text-xs">Keep staff access assignments in one place for event gate audits.</p>
              </div>
              <div className="rounded-[14px] bg-[#fafafa] border border-[#ececec] p-4">
                <p className="font-bold text-[#0f0f10]">QR scanner access</p>
                <p className="mt-1 text-xs">Only authorized staff can scan tickets with the mobile gate app.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
