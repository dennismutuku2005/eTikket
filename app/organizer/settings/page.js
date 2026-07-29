"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function OrganizerSettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [mpesaMethod, setMpesaMethod] = useState("Paybill");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [accountName, setAccountName] = useState("");

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

    const storedConfig = window.localStorage.getItem("organizerMpesaConfig");
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      setMpesaMethod(parsed.type || "Paybill");
      setMpesaNumber(parsed.number || "");
      setAccountName(parsed.account || "");
    }
  }, [router]);

  if (!session) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const config = {
      type: mpesaMethod,
      number: mpesaNumber,
      account: accountName,
    };
    window.localStorage.setItem("organizerMpesaConfig", JSON.stringify(config));
    alert("MPESA settings saved.");
  }

  const currentConfig = {
    type: mpesaMethod,
    number: mpesaNumber || "Not set",
    account: accountName || "Not set",
  };

  return (
    <AppShell
      role="Organizer"
      title="Settings"
      subtitle="Update your MPESA paybill or till details and see the current saved configuration."
    >
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">MPESA payment info</h2>
              <p className="mt-2 text-sm text-slate-500">Edit your paybill or till number and account name for event ticket payments.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_0.95fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Current MPESA configuration</p>
              <dl className="mt-4 grid gap-4 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-900">Type</dt>
                  <dd className="mt-1">{currentConfig.type}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Paybill / Till number</dt>
                  <dd className="mt-1">{currentConfig.number}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Account name</dt>
                  <dd className="mt-1">{currentConfig.account}</dd>
                </div>
              </dl>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="grid gap-5">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">MPESA type</span>
                  <select
                    value={mpesaMethod}
                    onChange={(event) => setMpesaMethod(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                  >
                    <option>Paybill</option>
                    <option>Till</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Paybill / Till number</span>
                  <input
                    value={mpesaNumber}
                    onChange={(event) => setMpesaNumber(event.target.value)}
                    placeholder="Enter paybill or till number"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Account name</span>
                  <input
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    placeholder="Enter account name"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Save MPESA settings
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
