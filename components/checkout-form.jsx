"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ event }) {
  const router = useRouter();
  const selectedTicket = useMemo(
    () => event.tickets?.[0] || { name: "Ticket", price: 0 },
    [event]
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState("");

  const isFreeEvent = selectedTicket.price === 0;

  function handleSubmit(evt) {
    evt.preventDefault();
    setFormError("");

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError("Full name, phone number, and email are required.");
      return;
    }

    if (!acceptedTerms) {
      setFormError("You must accept the terms to continue.");
      return;
    }

    const query = new URLSearchParams({
      event: event.title,
      fullName,
      email,
      phone,
      ticket: selectedTicket.name,
    }).toString();

    router.push(`/payment/${event.slug}?${query}`);
  }

  return (
    <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
      <p className="text-base font-bold text-[#f33959]">Checkout</p>
      <h1 className="mt-2 text-4xl font-bold">
        {isFreeEvent ? "Reserve your free ticket" : "Confirm your payment details"}
      </h1>
      <p className="mt-3 text-base leading-7 text-[#6b6b70]">
        {isFreeEvent
          ? "Confirm your details below so we can send your ticket information by email and phone."
          : "Confirm your details below to start the simulated payment flow. We require email and phone confirmation for ticket delivery."}
      </p>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#6b6b70]">Full name *</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-13 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-base outline-none focus:border-[#f33959] focus:bg-white"
            placeholder="Enter your full name"
            type="text"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#6b6b70]">Phone number *</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-13 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-base outline-none focus:border-[#f33959] focus:bg-white"
            placeholder="Enter your phone number"
            type="tel"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#6b6b70]">Email address *</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-13 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-base outline-none focus:border-[#f33959] focus:bg-white"
            placeholder="Enter your email address"
            type="email"
            required
          />
        </label>

        <label className="flex items-start gap-3 rounded-[14px] bg-[#fafafa] p-4 text-sm leading-6 text-[#6b6b70]">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[#f33959]"
          />
          <span>
            I agree to the <Link href="/terms" className="font-bold text-[#f33959]">terms</Link> and <Link href="/privacy-policy" className="font-bold text-[#f33959]">privacy policy</Link>.
          </span>
        </label>

        {formError ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-base text-red-700">{formError}</div>
        ) : null}

        <button
          type="submit"
          className="mt-2 h-13 rounded-full bg-[#f33959] px-5 text-base font-bold text-white hover:bg-[#d92847] transition-colors"
        >
          {isFreeEvent ? "Reserve free ticket" : `Continue to payment`}
        </button>
      </form>
    </div>
  );
}
