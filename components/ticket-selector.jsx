"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { FiLoader } from "react-icons/fi";

export default function TicketSelector({ event }) {
  const [tickets, setTickets] = useState(event.tickets || []);
  const [loading, setLoading] = useState(!event.tickets || event.tickets.length === 0);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (event?.id) {
      apiRequest(`/event-ticket-types/${event.id}`)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((t) => ({
              id: t.id,
              name: t.name,
              description: t.description || "Standard ticket",
              price: Number(t.price) || 0,
              available: Number(t.available_quantity) || 0,
            }));
            setTickets(formatted);
            setQuantities(
              Object.fromEntries(formatted.map((t, idx) => [t.name, idx === 0 ? 1 : 0]))
            );
          } else if (event.tickets && event.tickets.length > 0) {
            setTickets(event.tickets);
            setQuantities(
              Object.fromEntries(event.tickets.map((t, idx) => [t.name, idx === 0 ? 1 : 0]))
            );
          }
        })
        .catch(() => {
          if (event.tickets && event.tickets.length > 0) {
            setTickets(event.tickets);
            setQuantities(
              Object.fromEntries(event.tickets.map((t, idx) => [t.name, idx === 0 ? 1 : 0]))
            );
          }
        })
        .finally(() => setLoading(false));
    } else if (event?.tickets) {
      setTickets(event.tickets);
      setQuantities(
        Object.fromEntries(event.tickets.map((t, idx) => [t.name, idx === 0 ? 1 : 0]))
      );
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [event]);

  const total = useMemo(
    () => tickets.reduce((sum, ticket) => sum + (ticket.price || 0) * (quantities[ticket.name] || 0), 0),
    [tickets, quantities],
  );
  const selectedCount = useMemo(
    () => tickets.reduce((sum, ticket) => sum + (quantities[ticket.name] || 0), 0),
    [tickets, quantities],
  );
  const isFreeSelection = selectedCount > 0 && total === 0;

  function updateQuantity(name, change) {
    setQuantities((current) => ({
      ...current,
      [name]: Math.max(0, Math.min(10, (current[name] || 0) + change)),
    }));
  }

  return (
    <div className="sticky top-24 rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_8px_24px_rgba(15,15,16,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-[#f33959]">Tickets</p>
          <h2 className="mt-1 text-2xl font-bold">Choose your ticket</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-xs font-bold text-[#6b6b70]">
            <FiLoader size={16} className="animate-spin text-[#f33959]" />
            Loading ticket tiers…
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-[14px] bg-[#f4f4f5] p-4 text-sm text-[#6b6b70]">
            No ticket classes available for this event yet.
          </div>
        ) : (
          tickets.map((ticket) => {
            const qty = quantities[ticket.name] || 0;
            return (
              <div
                key={ticket.id || ticket.name}
                className={`rounded-[14px] border p-4 transition ${
                  qty > 0 ? "border-[#f33959] bg-[#fde8ec]" : "border-transparent bg-[#f4f4f5]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0f0f10]">{ticket.name}</h3>
                    <p className="mt-1 text-sm text-[#6b6b70]">{ticket.description}</p>
                    <p className="mt-2 text-base font-bold text-[#0f0f10]">
                      {ticket.price === 0 ? "Free" : `KSh ${ticket.price.toLocaleString()}`}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#6b6b70]">{ticket.available} tickets available</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(ticket.name, -1)}
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#ececec] bg-white text-xl font-bold transition hover:bg-[#f4f4f5]"
                      aria-label={`Reduce ${ticket.name} tickets`}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-lg font-bold tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(ticket.name, 1)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-[#111113] text-xl font-bold text-white transition hover:bg-[#0f0f10]"
                      aria-label={`Add ${ticket.name} tickets`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5 rounded-[14px] bg-[#111113] p-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <span className="text-base text-white/70">Total</span>
          <span className="text-2xl font-bold">{isFreeSelection ? "Free" : `KSh ${total.toLocaleString()}`}</span>
        </div>
        <Link
          href={`/checkout/${event.slug}`}
          className={`mt-4 flex h-[52px] w-full items-center justify-center rounded-full px-5 text-base font-bold text-white transition ${
            selectedCount === 0 ? "pointer-events-none bg-[#f9c2cb]" : "bg-[#f33959] hover:bg-[#d92847]"
          }`}
        >
          {isFreeSelection ? "Get free ticket" : "Pay now"}
        </Link>
        <p className="mt-3 text-center text-xs leading-5 text-white/60">
          By buying a ticket you agree to our terms and services.
        </p>
      </div>
    </div>
  );
}
