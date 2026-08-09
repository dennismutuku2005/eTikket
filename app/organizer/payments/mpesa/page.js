"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";
import { apiRequestAuth, AuthError, handleAuthError } from "@/lib/api";
import { toast } from "sonner";
import { FiLoader, FiCheck, FiPhone, FiCreditCard } from "react-icons/fi";

export default function OrganizerMpesaPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [mpesaType, setMpesaType] = useState("Paybill");
  const [number, setNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [savedConfig, setSavedConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const clientSession = getClientSession();
    if (!clientSession) { router.replace("/organizer/login"); return; }
    if (clientSession.role !== "organizer") { router.replace(getRoleHomePath(clientSession.role)); return; }
    setSession(clientSession);

    (async () => {
      try {
        const data = await apiRequestAuth("/organizer-settings/mpesa", clientSession.token);
        if (data) {
          setMpesaType(data.type || "Paybill");
          setNumber(data.number || "");
          setAccountName(data.account || "");
          setSavedConfig(data);
        }
      } catch (err) {
        if (err instanceof AuthError) { handleAuthError("organizer"); return; }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (!session) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!number.trim()) {
      toast.error(`${mpesaType === "Till" ? "Till number" : "Paybill number"} is required.`);
      return;
    }
    if (mpesaType === "Paybill" && !accountName.trim()) {
      toast.error("Account name is required for Paybill.");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequestAuth("/organizer-settings/mpesa", session.token, {
        method: "POST",
        body: JSON.stringify({
          type: mpesaType,
          number: number.trim(),
          account: mpesaType === "Paybill" ? accountName.trim() : "",
        }),
      });
      setSavedConfig({
        type: mpesaType,
        number: number.trim(),
        account: mpesaType === "Paybill" ? accountName.trim() : "",
      });
      toast.success("M-Pesa settings saved successfully.");
    } catch (err) {
      if (err instanceof AuthError) { handleAuthError("organizer"); return; }
      toast.error(err.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell
      role="Organizer"
      title="M-Pesa Settings"
      subtitle="Configure your M-Pesa payment details for receiving ticket payments from buyers."
    >
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Current config banner */}
        {!loading && savedConfig?.number && (
          <div className="flex items-center gap-4 rounded-[20px] border border-emerald-100 bg-emerald-50 px-5 py-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FiCheck size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-emerald-800">M-Pesa configured</p>
              <p className="mt-0.5 text-xs text-emerald-700 truncate">
                {savedConfig.type} · <span className="font-bold">{savedConfig.number}</span>
                {savedConfig.type === "Paybill" && savedConfig.account && ` · ${savedConfig.account}`}
              </p>
            </div>
          </div>
        )}

        <div className="card-lg">
          <div className="border-b border-[#ececec] pb-5">
            <h2 className="text-xl font-bold text-[#0f0f10]">M-Pesa payment routing</h2>
            <p className="mt-1 text-sm text-[#6b6b70]">
              Choose your M-Pesa type and enter the corresponding number. Buyers will pay to this account when purchasing tickets.
            </p>
          </div>

          {loading ? (
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-[14px] bg-[#f4f4f5]" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">

              {/* Type selector — cards */}
              <div>
                <p className="mb-3 text-sm font-bold text-[#0f0f10]">M-Pesa type</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Paybill card */}
                  <button
                    type="button"
                    onClick={() => setMpesaType("Paybill")}
                    className={`flex items-center gap-3 rounded-[16px] border-2 px-4 py-4 text-left transition ${
                      mpesaType === "Paybill"
                        ? "border-[#f33959] bg-[#fff2f4]"
                        : "border-[#ececec] bg-[#fafafa] hover:border-[#f33959]/40"
                    }`}
                  >
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${mpesaType === "Paybill" ? "bg-[#f33959] text-white" : "bg-[#f4f4f5] text-[#6b6b70]"}`}>
                      <FiCreditCard size={16} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${mpesaType === "Paybill" ? "text-[#f33959]" : "text-[#0f0f10]"}`}>Paybill</p>
                      <p className="text-xs text-[#6b6b70]">Business + account number</p>
                    </div>
                    {mpesaType === "Paybill" && (
                      <div className="ml-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#f33959]">
                        <FiCheck size={11} className="text-white" />
                      </div>
                    )}
                  </button>

                  {/* Till card */}
                  <button
                    type="button"
                    onClick={() => setMpesaType("Till")}
                    className={`flex items-center gap-3 rounded-[16px] border-2 px-4 py-4 text-left transition ${
                      mpesaType === "Till"
                        ? "border-[#f33959] bg-[#fff2f4]"
                        : "border-[#ececec] bg-[#fafafa] hover:border-[#f33959]/40"
                    }`}
                  >
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${mpesaType === "Till" ? "bg-[#f33959] text-white" : "bg-[#f4f4f5] text-[#6b6b70]"}`}>
                      <FiPhone size={16} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${mpesaType === "Till" ? "text-[#f33959]" : "text-[#0f0f10]"}`}>Till number</p>
                      <p className="text-xs text-[#6b6b70]">Buy goods number only</p>
                    </div>
                    {mpesaType === "Till" && (
                      <div className="ml-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#f33959]">
                        <FiCheck size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Number field — label changes based on type */}
              <label className="block">
                <span className="text-sm font-bold text-[#0f0f10]">
                  {mpesaType === "Till" ? "Till number *" : "Paybill number *"}
                </span>
                <p className="mt-0.5 text-xs text-[#6b6b70]">
                  {mpesaType === "Till"
                    ? "The buy-goods till number buyers will pay to."
                    : "The paybill business number buyers will pay to."}
                </p>
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder={mpesaType === "Till" ? "e.g. 123456" : "e.g. 522522"}
                  type="number"
                  min="0"
                  className="mt-2 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                  required
                />
              </label>

              {/* Account name — only shown for Paybill */}
              {mpesaType === "Paybill" && (
                <label className="block">
                  <span className="text-sm font-bold text-[#0f0f10]">Account name *</span>
                  <p className="mt-0.5 text-xs text-[#6b6b70]">
                    The account reference buyers enter when paying e.g. an order number or your business name.
                  </p>
                  <input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. eTikket or ORDER123"
                    className="mt-2 h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                    required
                  />
                </label>
              )}

              {/* Info box */}
              <div className="rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3 text-xs text-[#6b6b70]">
                {mpesaType === "Till" ? (
                  <>
                    <span className="font-bold text-[#0f0f10]">Till payment flow:</span> Buyer opens M-Pesa → Lipa na M-Pesa → Buy goods → enters your Till number → pays.
                  </>
                ) : (
                  <>
                    <span className="font-bold text-[#0f0f10]">Paybill payment flow:</span> Buyer opens M-Pesa → Lipa na M-Pesa → Paybill → enters your Paybill number → enters account name → pays.
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f33959] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#d92847] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? <FiLoader size={15} className="animate-spin" /> : <FiCheck size={15} />}
                {isSaving ? "Saving…" : "Save M-Pesa settings"}
              </button>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}
