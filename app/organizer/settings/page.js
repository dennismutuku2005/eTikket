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
        <section className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f10]">M-Pesa payment info</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">Edit your paybill or till number and account name for event ticket payments.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_0.95fr]">
            <div className="rounded-[16px] border border-[#ececec] bg-[#fafafa] p-5">
              <p className="text-sm font-bold text-[#0f0f10]">Current M-Pesa configuration</p>
              <dl className="mt-4 grid gap-4 text-sm text-[#6b6b70]">
                <div>
                  <dt className="font-bold text-[#0f0f10]">Type</dt>
                  <dd className="mt-0.5 font-bold text-[#0f0f10]">{currentConfig.type}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Paybill / Till number</dt>
                  <dd className="mt-0.5 font-bold text-[#f33959]">{currentConfig.number}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#0f0f10]">Account name</dt>
                  <dd className="mt-0.5 font-bold text-[#0f0f10]">{currentConfig.account}</dd>
                </div>
              </dl>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[16px] border border-[#ececec] bg-white p-5">
              <div className="grid gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-[#0f0f10]">M-Pesa type</span>
                  <select
                    value={mpesaMethod}
                    onChange={(event) => setMpesaMethod(event.target.value)}
                    className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition"
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
                    className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#0f0f10]">Account name</span>
                  <input
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    placeholder="Enter account name"
                    className="mt-1.5 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-[#f33959] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d92847]"
                >
                  Save M-Pesa settings
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
