"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSimulation({ slug, event }) {
  const searchParams = useSearchParams();
  const initialFullName = searchParams.get("fullName") || "";
  const eventName = event?.title || searchParams.get("event") || "your event";
  const ticketName = searchParams.get("ticket") || event?.tickets?.[0]?.name || "ticket";
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [acceptedTerms] = useState(true);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const isFreeEvent = event?.tickets?.[0]?.price === 0;
  const [formError, setFormError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [status, setStatus] = useState("pending");

  const paymentId = useMemo(() => {
    const sanitized = slug.toUpperCase().replace(/[^A-Z0-9]/g, "");
    return `${sanitized}-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [slug]);

  useEffect(() => {
    if (!isPaying) return;

    const timer = window.setTimeout(() => {
      setStatus("paid");
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [isPaying]);

  function handleConfirm() {
    setFormError("");

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError("Full name, phone number, and email are required.");
      return;
    }

    setDetailsConfirmed(true);
  }

  function handlePay() {
    if (!detailsConfirmed) {
      setFormError("Please confirm your details before paying.");
      return;
    }

    setIsPaying(true);
  }

  return (
    <div className="relative grid gap-6">
      {isPaying && status !== "paid" ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f33959]/10 text-[#f33959]">
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-r-transparent" />
            </div>
            <p className="mt-4 text-lg font-semibold text-[#0f0f10]">Enter your M-Pesa PIN</p>
            <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
              A payment request has been sent to your phone. Enter your M-Pesa PIN to complete the transaction.
            </p>
            <p className="mt-4 rounded-2xl bg-[#f8fafc] p-4 text-sm text-[#0f5132]">
              Waiting for confirmation from your phone…
            </p>
          </div>
        </div>
      ) : null}
      <div className="rounded-[28px] border border-[#ececec] bg-white p-6 shadow-sm">
        <p className="text-base font-bold text-[#f33959]">Checkout</p>
        <h1 className="mt-2 text-4xl font-bold">
          {isFreeEvent ? "Reserve your free ticket" : "Confirm your payment details"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[#6b6b70]">
          {isFreeEvent
            ? "Confirm your details below so we can send your ticket information by email and phone."
            : "Confirm your details below to start the simulated payment flow. We require email and phone confirmation for ticket delivery."}
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-[20px] bg-[#f8fafc] p-5 text-sm text-[#6b6b70]">
            <p className="font-semibold text-[#0f0f10]">Purchasing</p>
            <p className="mt-2 text-lg font-semibold text-[#0f0f10]">{eventName}</p>
            <p className="mt-1 text-sm">Ticket: {ticketName}</p>
          </div>

          <div className="rounded-[20px] border bg-white">
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#6b6b70]">Full name *</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="h-13 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-base outline-none focus:border-[#f33959] focus:bg-white"
                  placeholder="Enter your full name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#6b6b70]">Phone number *</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-13 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-base outline-none focus:border-[#f33959] focus:bg-white"
                  placeholder="Enter your phone number"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#6b6b70]">Email address *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-13 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-base outline-none focus:border-[#f33959] focus:bg-white"
                  placeholder="Enter your email address"
                />
              </label>

              {formError ? (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-base text-red-700">{formError}</div>
              ) : null}

              {!detailsConfirmed ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="mt-2 h-13 w-full rounded-full bg-[#f33959] px-5 text-base font-bold text-white hover:bg-[#d92847] transition-colors"
                >
                  {isFreeEvent ? "Reserve ticket" : "Confirm details"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={status === "paid" || isPaying}
                  className="mt-2 h-13 w-full rounded-full bg-[#f33959] px-5 text-base font-bold text-white hover:bg-[#d92847] transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {status === "paid" ? "Paid" : isPaying ? "Paying…" : isFreeEvent ? "Reserve ticket" : "Pay now"}
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[20px] bg-[#fff5f7] p-5 text-sm leading-6 text-[#6b6b70]">
            {detailsConfirmed ? (
              isPaying ? (
                "STK push is sent to your phone. Approve the payment to complete the flow."
              ) : (
                "Details are confirmed. Tap Pay now to complete the M-Pesa simulation."
              )
            ) : (
              "After you confirm details, the payment button will appear so you can complete the M-Pesa simulation."
            )}
          </div>
        </div>
      </div>

      {status === "paid" ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d6f5e3] text-[#0f5132]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7">
                <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-[#0f5132]">Payment confirmed</p>
            <p className="mt-3 text-base leading-7 text-[#475569]">
              Your ticket QR code will be sent to the confirmed email and phone number.
            </p>
            <div className="mt-6 rounded-[20px] bg-[#f8fafc] p-4 text-sm leading-6 text-[#0f5132]">
              Thank you for your purchase. Keep your phone nearby for the confirmation message.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
