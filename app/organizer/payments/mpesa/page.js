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
        <section className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">M-Pesa payment routing</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">Update the paybill or till number and account name used for ticket payments.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-[#0f0f10]">M-Pesa type</span>
                    <select
                      value={mpesaMethod}
                      onChange={(event) => setMpesaMethod(event.target.value)}
                      className="mt-2 h-12 w-full rounded-[14px] border border-[#ececec] bg-white px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959]"
                    >
                      <option>Paybill</option>
                      <option>Till</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-[#0f0f10]">Paybill / Till number</span>
                    <input
                      value={mpesaNumber}
                      onChange={(event) => setMpesaNumber(event.target.value)}
                      placeholder="Enter paybill or till number"
                      className="mt-2 h-12 w-full rounded-[14px] border border-[#ececec] bg-white px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-bold text-[#0f0f10]">Account name</span>
                  <input
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    placeholder="Enter account name"
                    className="mt-2 h-12 w-full rounded-[14px] border border-[#ececec] bg-white px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959]"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#f33959] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
                >
                  Save M-Pesa settings
                </button>
              </form>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Current M-Pesa details</p>
                <dl className="mt-4 grid gap-4 text-sm text-[#6b6b70]">
                  <div>
                    <dt className="font-bold text-[#0f0f10]">Type</dt>
                    <dd className="mt-1 font-bold text-[#0f0f10]">{savedConfig.type}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#0f0f10]">Paybill / Till number</dt>
                    <dd className="mt-1 font-bold text-[#f33959]">{savedConfig.number || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#0f0f10]">Account name</dt>
                    <dd className="mt-1 font-bold text-[#0f0f10]">{savedConfig.account || "Not set"}</dd>
                  </div>
                </dl>
              </div>

            </aside>

          </div>
        </section>
      </div>
    </AppShell>
  );
}
