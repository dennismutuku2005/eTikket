"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

const defaultConfig = {
  type: "Paybill",
  number: "",
  account: "",
};

export default function OrganizerMpesaPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [mpesaMethod, setMpesaMethod] = useState(defaultConfig.type);
  const [mpesaNumber, setMpesaNumber] = useState(defaultConfig.number);
  const [accountName, setAccountName] = useState(defaultConfig.account);
  const [savedConfig, setSavedConfig] = useState(defaultConfig);

  useEffect(() => {
    const clientSession = getClientSession();

    if (!clientSession) {
      router.replace("/organizer/login");
      return;
    }

    if (clientSession.role !== "organizer") {
      router.replace(getRoleHomePath(clientSession.role));
      return;
    }

    setSession(clientSession);

    const storedConfig = window.localStorage.getItem("organizerMpesaConfig");
    if (storedConfig) {
      try {
        const parsed = JSON.parse(storedConfig);
        setMpesaMethod(parsed.type || defaultConfig.type);
        setMpesaNumber(parsed.number || defaultConfig.number);
        setAccountName(parsed.account || defaultConfig.account);
        setSavedConfig({
          type: parsed.type || defaultConfig.type,
          number: parsed.number || defaultConfig.number,
          account: parsed.account || defaultConfig.account,
        });
      } catch (error) {
        console.error("Failed to parse saved MPESA config", error);
      }
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
    setSavedConfig(config);
    window.alert("MPESA settings saved.");
  }

  return (
    <AppShell
      role="Organizer"
      title="M-Pesa configuration"
      subtitle="Set the paybill or till number and account name for your ticket payments."
    >
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">M-Pesa payment routing</h2>
              <p className="mt-2 text-sm text-slate-500">Update the paybill or till number and account name used for ticket payments.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">MPESA type</span>
                    <select
                      value={mpesaMethod}
                      onChange={(event) => setMpesaMethod(event.target.value)}
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
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
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Account name</span>
                  <input
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    placeholder="Enter account name"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Save MPESA settings
                </button>
              </form>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Current MPESA details</p>
                <dl className="mt-6 grid gap-4 text-sm text-slate-600">
                  <div>
                    <dt className="font-semibold text-slate-900">Type</dt>
                    <dd className="mt-1 text-slate-950">{savedConfig.type}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">Paybill / Till number</dt>
                    <dd className="mt-1 text-slate-950">{savedConfig.number || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">Account name</dt>
                    <dd className="mt-1 text-slate-950">{savedConfig.account || "Not set"}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Setup guide</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="rounded-3xl bg-white p-4">Use the correct paybill for ticket payments and not the event vendor paybill.</li>
                  <li className="rounded-3xl bg-white p-4">Verify callback URLs in the M-Pesa portal and keep secrets private.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
