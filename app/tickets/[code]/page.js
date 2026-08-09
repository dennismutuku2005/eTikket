"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiDownload, FiCheckCircle, FiXCircle, FiCalendar, FiMapPin, FiClock, FiShield, FiLoader } from "react-icons/fi";
import { apiRequest, BACKEND_URL } from "@/lib/api";
import { toast } from "sonner";

export default function PublicTicketPage() {
  const { code } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    (async () => {
      try {
        const data = await apiRequest(`/tickets/${code}`);
        setTicket(data);
      } catch (err) {
        toast.error("Ticket not found or invalid.");
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const handleDownload = () => {
    if (!ticket?.qr_code) return;
    const link = document.createElement("a");
    link.href = ticket.qr_code;
    link.download = `ticket-${ticket.ticket_code}.png`;
    link.click();
    toast.success("QR code download started!");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-[#6b6b70]">
          <FiLoader size={28} className="animate-spin text-[#f33959]" />
          <p className="text-sm font-bold">Loading ticket details…</p>
        </div>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 text-center">
        <div className="text-5xl">🎟️</div>
        <h1 className="mt-4 text-2xl font-bold text-[#0f0f10]">Ticket Not Found</h1>
        <p className="mt-2 text-sm text-[#6b6b70] max-w-sm">
          We couldn't retrieve the details for this ticket. Please verify the link or contact the event host.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#f33959] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
        >
          Go back home
        </Link>
      </main>
    );
  }

  const isUsed = ticket.status === "checked_in";
  const isVoid = ticket.status === "void";
  const isActive = ticket.status === "issued" || ticket.status === "approved";

  const eventDate = ticket.event_date ? new Date(ticket.event_date).toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "Date TBC";

  return (
    <main className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-md">
        {/* Header Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img src="/eTikket.png" alt="eTikket Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {/* Main Ticket Card */}
        <div className="overflow-hidden rounded-[30px] border border-[#ececec] bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
          {/* Cover image area */}
          <div className="relative h-44 w-full bg-[#111113]">
            {ticket.cover_image_url ? (
              <img
                src={`${BACKEND_URL}${ticket.cover_image_url}`}
                alt={ticket.event_title}
                className="h-full w-full object-cover opacity-85"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#f33959] to-[#d92847] opacity-90" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isActive && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <FiCheckCircle size={12} /> Active
                </span>
              )}
              {isUsed && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-600/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <FiCheckCircle size={12} /> Checked In
                </span>
              )}
              {isVoid && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <FiXCircle size={12} /> Void
                </span>
              )}
            </div>

            {/* Event details on cover */}
            <div className="absolute bottom-4 left-5 right-5">
              <span className="rounded bg-[#f33959] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {ticket.ticket_type} Pass
              </span>
              <h2 className="mt-1.5 text-xl font-bold text-white truncate">{ticket.event_title}</h2>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            
            {/* Event meta list */}
            <div className="space-y-3.5 text-sm text-[#6b6b70] border-b border-[#f4f4f5] pb-5">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-[#f33959]" size={16} />
                <span>{eventDate}</span>
              </div>
              {ticket.event_time && (
                <div className="flex items-center gap-3">
                  <FiClock className="text-[#f33959]" size={16} />
                  <span>{ticket.event_time}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <FiMapPin className="text-[#f33959]" size={16} />
                <span className="truncate">{ticket.event_venue}</span>
              </div>
            </div>

            {/* QR Code container */}
            <div className="flex flex-col items-center justify-center py-2">
              {ticket.qr_code ? (
                <>
                  <div className="relative rounded-[24px] border-2 border-[#f4f4f5] bg-white p-3 shadow-md transition hover:scale-105 duration-300">
                    <img
                      src={ticket.qr_code}
                      alt="Ticket QR Code"
                      className="h-44 w-44 object-contain"
                    />
                    {isUsed && (
                      <div className="absolute inset-0 bg-white/80 rounded-[24px] flex flex-col items-center justify-center text-center p-4">
                        <span className="text-3xl">🚫</span>
                        <p className="text-xs font-bold text-slate-800 mt-2">USED TICKET</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleDownload}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-white px-5 py-2.5 text-xs font-bold text-[#0f0f10] shadow-sm transition hover:bg-[#f4f4f5] hover:border-[#cfcfcf]"
                  >
                    <FiDownload size={13} />
                    Download QR Code
                  </button>
                </>
              ) : (
                <p className="text-xs text-[#6b6b70]">No QR code available for this ticket.</p>
              )}
            </div>

            {/* Attendee details */}
            <div className="rounded-[18px] bg-[#fafafa] border border-[#ececec] p-4 text-sm">
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <span className="text-xs text-[#6b6b70] block">Attendee</span>
                  <span className="font-bold text-[#0f0f10]">{ticket.attendee_name || "Guest"}</span>
                </div>
                <div>
                  <span className="text-xs text-[#6b6b70] block">Ticket Code</span>
                  <span className="font-mono text-xs font-bold text-[#0f0f10]">{ticket.ticket_code}</span>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2.5 justify-center text-center text-[10px] text-[#9b9ba0]">
              <FiShield size={12} className="text-emerald-500 flex-shrink-0" />
              <span>Official eTikket verified security entry pass.</span>
            </div>

          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-bold text-[#f33959] hover:underline">
            ← Browse more events on eTikket
          </Link>
        </div>
      </div>
    </main>
  );
}
