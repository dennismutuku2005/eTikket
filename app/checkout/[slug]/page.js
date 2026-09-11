"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiLoader, FiMinus, FiPlus, FiShield, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { apiRequest, BACKEND_URL } from "@/lib/api";
import { toast } from "sonner";

function getImageSrc(event) {
  if (!event) return null;
  if (event.cover_image_url) return `${BACKEND_URL}${event.cover_image_url}`;
  if (event.cover_image_base64) return event.cover_image_base64;
  return "/sideimage.png";
}

export default function CheckoutPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Event + tickets state
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [quantities, setQuantities] = useState({});

  // Buyer info state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Payment flow state
  const [step, setStep] = useState("details"); // "details" | "paying" | "success"
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [ticketsList, setTicketsList] = useState([]);

  // Load event + ticket types from backend
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        // 1. Always fetch the event for its title/image/date
        const eventData = await apiRequest(`/events/${slug}`);
        setEvent(eventData);

        // 2. Check if ticket selections were forwarded via URL param
        const rawParam = searchParams.get("tickets");
        if (rawParam) {
          try {
            const forwarded = JSON.parse(decodeURIComponent(rawParam));
            if (Array.isArray(forwarded) && forwarded.length > 0) {
              // Use the forwarded ticket list directly
              setTickets(forwarded.map((t) => ({
                id: t.id ?? t.name,
                name: t.name,
                description: t.description || "Standard entry",
                price: Number(t.price) || 0,
                available: Number(t.available) || 0,
              })));
              // Pre-populate quantities from forwarded selection
              setQuantities(
                Object.fromEntries(forwarded.map((t) => [t.id ?? t.name, Number(t.qty) || 0]))
              );
              return; // skip backend ticket fetch — we already have the data
            }
          } catch {
            // malformed param — fall through to backend fetch
          }
        }

        // 3. Fallback: fetch ticket types fresh from backend
        const ticketData = await apiRequest(`/event-ticket-types/${eventData.id || slug}`).catch(() => []);
        let tiers = [];
        if (Array.isArray(ticketData) && ticketData.length > 0) {
          tiers = ticketData.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description || "Standard entry",
            price: Number(t.price) || 0,
            available: Number(t.available_quantity) || 0,
          }));
        } else if (Array.isArray(eventData?.tickets) && eventData.tickets.length > 0) {
          tiers = eventData.tickets;
        }
        setTickets(tiers);
        if (tiers.length > 0) {
          setQuantities(Object.fromEntries(tiers.map((t, i) => [t.id ?? t.name, i === 0 ? 1 : 0])));
        }
      } catch {
        toast.error("Event not found.");
        router.replace("/events");
      } finally {
        setLoadingEvent(false);
      }
    })();
  }, [slug, router, searchParams]);

  // --- Computed values ---
  const selectedLines = useMemo(
    () => tickets.filter((t) => (quantities[t.id ?? t.name] || 0) > 0),
    [tickets, quantities]
  );
  const total = useMemo(
    () => tickets.reduce((sum, t) => sum + t.price * (quantities[t.id ?? t.name] || 0), 0),
    [tickets, quantities]
  );
  const totalQty = useMemo(
    () => tickets.reduce((sum, t) => sum + (quantities[t.id ?? t.name] || 0), 0),
    [tickets, quantities]
  );
  const isFree = total === 0 && totalQty > 0;

  function setQty(key, delta) {
    setQuantities((q) => ({ ...q, [key]: Math.max(0, Math.min(10, (q[key] || 0) + delta)) }));
  }

  // --- Step 1: Submit buyer details → create order → move to payment ---
  async function handleConfirm(e) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      toast.error("All fields are required.");
      return;
    }
    if (!acceptedTerms) {
      toast.error("You must accept the terms to continue.");
      return;
    }
    if (totalQty === 0) {
      toast.error("Please select at least one ticket.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create the order in the backend with the ticket selections
      const order = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          event_id: event.id,
          buyer_name: fullName.trim(),
          buyer_email: email.trim(),
          buyer_phone: phone.trim(),
          total_amount: total,
          currency: "KES",
          accepted_terms: true,
          tickets: selectedLines.map((t) => ({
            id: t.id,
            name: t.name,
            price: t.price,
            qty: quantities[t.id ?? t.name],
          })),
        }),
      });
      setOrderId(order.id);
      setOrderNumber(order.order_number);

      // Set state according to whether payment is needed
      setStep(isFree ? "reserving" : "paying");

      // 2. Initiate fulfillment / M-Pesa STK Push
      const paymentInit = await apiRequest("/payments/initiate", {
        method: "POST",
        body: JSON.stringify({
          order_id: order.id,
          phone: phone.trim(),
        }),
      });

      if (!paymentInit.ok || paymentInit.status !== "success") {
        throw new Error(paymentInit.message || (isFree ? "Failed to reserve ticket" : "Failed to complete payment"));
      }

      setTicketsList(paymentInit.tickets || []);
      setStep("success");
      toast.success(isFree ? "Free ticket reserved successfully!" : "Payment completed successfully!");
    } catch (err) {
      toast.error(err.message || "Could not complete transaction. Please try again.");
      setStep("details");
    } finally {
      setSubmitting(false);
    }
  }

  // --- Loading state ---
  if (loadingEvent) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#6b6b70]">
          <FiLoader size={28} className="animate-spin text-[#f33959]" />
          <p className="text-sm font-bold">Loading checkout…</p>
        </div>
      </main>
    );
  }

  if (!event) return null;

  const imgSrc = getImageSrc(event);
  const eventDate = event.event_date ? new Date(event.event_date).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" }) : "Date TBC";

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#ececec] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <img src="/eTikket.png" alt="eTikket" className="h-8 w-auto object-contain" />
          </Link>
          <Link
            href={`/events/${event.slug || slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-4 py-2 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
          >
            <FiArrowLeft size={14} />
            Back to event
          </Link>
        </div>
      </header>

      {/* ── Free Reservation overlay ────────────────────────────────── */}
      {step === "reserving" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f33959]/10">
              <span className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-[#f33959] border-r-transparent" />
            </div>
            <p className="mt-5 text-xl font-bold text-[#0f0f10]">Reserving your ticket</p>
            <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
              Generating your QR code ticket and sending confirmation to <span className="font-bold text-[#0f0f10]">{phone}</span>…
            </p>
          </div>
        </div>
      )}

      {/* ── M-Pesa STK overlay ──────────────────────────────────────── */}
      {step === "paying" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f33959]/10">
              <span className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-[#f33959] border-r-transparent" />
            </div>
            <p className="mt-5 text-xl font-bold text-[#0f0f10]">Enter your M-Pesa PIN</p>
            <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
              A payment request has been sent to <span className="font-bold text-[#0f0f10]">{phone}</span>. Enter your PIN to complete.
            </p>
            <div className="mt-5 rounded-[14px] bg-[#fafafa] px-4 py-3 text-xs text-[#6b6b70]">
              Waiting for confirmation from your phone…
            </div>
          </div>
        </div>
      )}

      {/* ── Success overlay ─────────────────────────────────────────── */}
      {step === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FiCheck size={28} />
            </div>
            <h2 className="mt-5 text-center text-2xl font-bold text-[#0f0f10]">
              {isFree ? "Ticket reserved!" : "Payment confirmed!"}
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-[#6b6b70]">
              Your ticket QR code will be sent to <span className="font-bold text-[#0f0f10]">{email}</span> and <span className="font-bold text-[#0f0f10]">{phone}</span>.
            </p>

            <div className="mt-6 space-y-2 rounded-2xl border border-[#ececec] bg-[#fafafa] p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6b6b70]">Order number</span>
                <span className="font-mono font-bold text-[#0f0f10]">{orderNumber || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b6b70]">Event</span>
                <span className="font-bold text-[#0f0f10] text-right max-w-[60%]">{event.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b6b70]">Amount paid</span>
                <span className="font-bold text-[#f33959]">{isFree ? "Free" : `KES ${total.toLocaleString()}`}</span>
              </div>
            </div>

            {ticketsList.length > 0 && (
              <div className="mt-6 border-t border-[#ececec] pt-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70] text-center mb-1">Your QR Tickets ({ticketsList.length})</p>
                <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
                  {ticketsList.map((t, idx) => (
                    <div key={idx} className="rounded-[20px] border border-[#ececec] bg-white p-4 shadow-xs flex flex-col items-center">
                      <p className="text-sm font-bold text-[#0f0f10]">{t.ticket_type} ticket</p>
                      <p className="text-xs text-[#6b6b70] mt-0.5">Code: {t.ticket_code}</p>
                      <div className="mt-3 rounded-2xl border border-[#ececec] bg-white p-2.5">
                        <img src={t.qr_code} alt={`Ticket ${idx + 1} QR Code`} className="h-36 w-36 object-contain" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6b6b70] text-center mt-2">Show these codes at the gate for entry verification.</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-full bg-[#f33959] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d92847]"
            >
              Back to home
            </button>
          </div>
        </div>
      )}

      {/* ── Main layout ─────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.85fr]">

        {/* ── Left: Checkout form ──────────────────────────────────── */}
        <div className="space-y-5">
          {/* Step label */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#f33959]">Checkout</p>
            <h1 className="mt-1 text-3xl font-bold text-[#0f0f10]">
              {isFree && totalQty > 0 ? "Reserve your free ticket" : "Confirm your details"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
              {isFree && totalQty > 0
                ? "Confirm your details below so we can send your ticket to your email and phone."
                : "Enter your details below. Your ticket QR code will be delivered to your email and phone number."}
            </p>
          </div>


          {/* Buyer details form */}
          <form className="card-lg space-y-4" onSubmit={handleConfirm}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Your details</p>
              <h2 className="mt-1 text-base font-bold text-[#0f0f10]">Where should we send your ticket?</h2>
            </div>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-[#0f0f10]">
                <FiUser size={13} /> Full name *
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#9b9ba0] focus:border-[#f33959] focus:bg-white transition"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-[#0f0f10]">
                <FiPhone size={13} /> Phone number *
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0722 123 456"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#9b9ba0] focus:border-[#f33959] focus:bg-white transition"
                required
              />
              <p className="mt-1 text-xs text-[#6b6b70]">M-Pesa payment request will be sent here.</p>
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-[#0f0f10]">
                <FiMail size={13} /> Email address *
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#9b9ba0] focus:border-[#f33959] focus:bg-white transition"
                required
              />
              <p className="mt-1 text-xs text-[#6b6b70]">Ticket QR code will be sent to this email.</p>
            </label>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3 rounded-[14px] border border-[#ececec] bg-[#fafafa] p-4 transition hover:bg-white">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#f33959]"
              />
              <span className="text-sm leading-6 text-[#6b6b70]">
                I agree to the{" "}
                <Link href="/terms" className="font-bold text-[#f33959] hover:underline">terms</Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-bold text-[#f33959] hover:underline">privacy policy</Link>.
              </span>
            </label>

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-[#6b6b70]">
              <FiShield size={13} className="text-emerald-600 shrink-0" />
              Confirmed email and phone details are required to receive your ticket QR code.
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting || totalQty === 0 || step === "success"}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#f33959] px-6 text-base font-bold text-white transition hover:bg-[#d92847] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <><FiLoader size={16} className="animate-spin" /> Processing…</>
              ) : totalQty === 0 ? (
                "Select a ticket to continue"
              ) : isFree ? (
                "Reserve free ticket"
              ) : (
                `Pay KES ${total.toLocaleString()}`
              )}
            </button>
          </form>
        </div>

        {/* ── Right: Order summary ─────────────────────────────────── */}
        <aside className="space-y-4">
          {/* Event card */}
          <div className="card-lg space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#f4f4f5]">
              <img
                src={imgSrc}
                alt={event.title}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = "/sideimage.png"; }}
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">{event.category}</p>
              <h2 className="mt-1 text-xl font-bold text-[#0f0f10]">{event.title}</h2>
              <p className="mt-1 text-sm text-[#6b6b70]">
                {eventDate}
                {event.event_time ? ` · ${event.event_time}` : ""}
                {event.venue ? ` · ${event.venue}` : ""}
              </p>
            </div>

            {/* Line items */}
            {selectedLines.length > 0 && (
              <div className="space-y-2 border-t border-[#ececec] pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Order summary</p>
                {selectedLines.map((t) => {
                  const key = t.id ?? t.name;
                  const qty = quantities[key] || 0;
                  return (
                    <div key={key} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-[#0f0f10]">
                        {t.name} <span className="text-[#6b6b70]">× {qty}</span>
                      </span>
                      <span className="font-bold text-[#0f0f10]">
                        {t.price === 0 ? "Free" : `KSh ${(t.price * qty).toLocaleString()}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between rounded-[14px] bg-[#111113] px-4 py-3">
              <span className="text-sm font-bold text-white/70">Total</span>
              <span className="text-xl font-bold text-white">
                {totalQty === 0 ? "—" : isFree ? "Free" : `KES ${total.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Help note */}
          <div className="rounded-2xl border border-[#ececec] bg-white px-4 py-3 text-xs leading-5 text-[#6b6b70]">
            <span className="font-bold text-[#0f0f10]">Need help? </span>
            Contact support at{" "}
            <a href="mailto:support@etikket.co.ke" className="font-bold text-[#f33959] hover:underline">
              support@etikket.co.ke
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
