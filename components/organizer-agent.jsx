"use client";

import { useState, useEffect, useRef } from "react";
import { BACKEND_URL } from "@/lib/api";
import { getClientSession } from "@/lib/client-auth";
import { toast } from "sonner";
import {
  FiTrendingUp,
  FiX,
  FiSend,
  FiCheckCircle,
  FiCalendar,
  FiPieChart,
  FiRefreshCw,
  FiMaximize2,
  FiMinimize2,
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiClock,
  FiTag,
} from "react-icons/fi";

function stripEmojis(str) {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FC}\u{25FB}\u{25FA}\u{25F9}\u{25F8}]/gu, '').trim();
}

/**
 * Lightweight Markdown Renderer for Organizer Messages
 */
function FormattedMarkdown({ content }) {
  if (!content) return null;

  const cleanContent = stripEmojis(content);
  const paragraphs = cleanContent.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n");
        return (
          <div key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => {
              const isTable = line.trim().startsWith("|");
              const isListItem = line.trim().startsWith("- ") || line.trim().startsWith("* ") || /^\d+\.\s/.test(line.trim());
              const cleanLine = isListItem ? line.trim().replace(/^[-*]\s+|^\d+\.\s+/, "") : line;

              if (isTable) {
                return (
                  <div key={lIdx} className="font-mono text-[11px] bg-indigo-950/40 text-indigo-100 p-1.5 rounded overflow-x-auto my-1 border border-indigo-500/20">
                    {line}
                  </div>
                );
              }

              const parts = [];
              const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`)/g;
              let match;
              let lastIndex = 0;

              while ((match = regex.exec(cleanLine)) !== null) {
                if (match.index > lastIndex) {
                  parts.push(cleanLine.substring(lastIndex, match.index));
                }

                if (match[2]) {
                  parts.push(
                    <strong key={match.index} className="font-bold">
                      {match[2]}
                    </strong>
                  );
                } else if (match[3]) {
                  parts.push(
                    <em key={match.index} className="italic">
                      {match[3]}
                    </em>
                  );
                } else if (match[4]) {
                  parts.push(
                    <code key={match.index} className="rounded bg-black/10 px-1 py-0.5 font-mono text-[11px]">
                      {match[4]}
                    </code>
                  );
                }
                lastIndex = regex.lastIndex;
              }

              if (lastIndex < cleanLine.length) {
                parts.push(cleanLine.substring(lastIndex));
              }

              return (
                <span
                  key={lIdx}
                  className={isListItem ? "flex items-start gap-1.5 my-1 pl-2 border-l-2 border-indigo-500" : ""}
                >
                  {isListItem && <span className="font-bold text-indigo-500">•</span>}
                  <span>{parts}</span>
                  {lIdx < lines.length - 1 && <br />}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function OrganizerAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to your **eTikket Organizer AI Copilot**. I can analyze your event revenue, today's live sales, specific event performance, ticket tiers, gate check-ins, and generate executive reports.\n\nHow can I assist your event operations today?",
      cardData: null,
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSession(getClientSession());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend = input) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    if (!session?.token) {
      toast.error("Organizer session expired. Please re-login.");
      return;
    }

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/agent/organizer-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantReply = data.reply || {
        role: "assistant",
        content: "Here is your organizer metrics report.",
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      console.error("Organizer Copilot error:", err);
      toast.error("Copilot connection error. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble retrieving your organizer metrics. Please try asking again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (actionText) => {
    handleSendMessage(actionText);
  };

  const modalContent = (
    <div
      className={`${
        isExpanded
          ? "w-full max-w-4xl h-[85vh] max-h-[780px]"
          : "w-[calc(100vw-2rem)] max-w-[460px] h-[660px] max-h-[85vh]"
      } flex flex-col rounded-[24px] border border-[#ececec] bg-white shadow-2xl overflow-hidden transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ececec] bg-linear-to-r from-indigo-950 via-slate-900 to-indigo-950 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white shadow-inner">
            <FiTrendingUp className="h-5 w-5 animate-pulse text-indigo-100" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight flex items-center gap-2">
              Organizer AI Copilot
            </h3>
            <p className="text-xs text-indigo-200">{session?.email || "Authenticated Organizer"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full p-2 text-indigo-200 transition hover:bg-white/10 hover:text-white"
            title={isExpanded ? "Dock to corner" : "Expand to center"}
            aria-label="Toggle Expand Modal"
          >
            {isExpanded ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-indigo-200 transition hover:bg-white/10 hover:text-white"
            aria-label="Close Copilot"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Organizer Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto bg-indigo-50/50 p-3 border-b border-[#ececec] scrollbar-none text-xs">
        <button
          onClick={() => handleChipClick("Show me today's sales and revenue collected today")}
          className="whitespace-nowrap rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 font-bold text-indigo-900 shadow-2xs hover:bg-indigo-600 hover:text-white transition flex items-center gap-1.5"
        >
          <FiClock /> Today's Sales
        </button>
        <button
          onClick={() => handleChipClick("Generate executive sales report for my events")}
          className="whitespace-nowrap rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 font-bold text-indigo-900 shadow-2xs hover:bg-indigo-600 hover:text-white transition flex items-center gap-1.5"
        >
          <FiFileText /> Executive Report
        </button>
        <button
          onClick={() => handleChipClick("Show live gate check-in and gate attendance stats")}
          className="whitespace-nowrap rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 font-bold text-indigo-900 shadow-2xs hover:bg-indigo-600 hover:text-white transition flex items-center gap-1.5"
        >
          <FiUsers /> Gate Attendance
        </button>
        <button
          onClick={() => handleChipClick("Show sales breakdown for all my events")}
          className="whitespace-nowrap rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 font-bold text-indigo-900 shadow-2xs hover:bg-indigo-600 hover:text-white transition flex items-center gap-1.5"
        >
          <FiBarChart2 /> Events Sales
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`${
                isExpanded ? "max-w-[80%]" : "max-w-[90%]"
              } rounded-[20px] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-xs font-medium"
                  : "bg-white text-[#0f0f10] border border-[#ececec] shadow-2xs rounded-bl-xs"
              }`}
            >
              <FormattedMarkdown content={msg.content} />
            </div>

            {/* Embedded Interactive Organizer Cards */}
            {msg.cardData && (
              <div className={`mt-3 w-full ${isExpanded ? "max-w-[85%]" : "max-w-[95%]"}`}>
                {/* 1. Today's Revenue & Sales Card */}
                {msg.cardData.type === "today_sales" && msg.cardData.today && (
                  <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <FiClock /> Today's Live Revenue ({msg.cardData.today.date})
                      </span>
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Today
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-xl bg-white p-2.5 border border-emerald-200">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Revenue Today</p>
                        <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                          KES {Number(msg.cardData.today.revenueToday).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-emerald-200">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Orders Today</p>
                        <p className="text-sm font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.today.ordersToday}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-emerald-200">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Tickets Today</p>
                        <p className="text-sm font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.today.ticketsToday}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Specific Event Analytics Card */}
                {msg.cardData.type === "specific_event" && msg.cardData.detail && (
                  <div className="rounded-[18px] border border-indigo-200 bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#ececec] pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#0f0f10]">
                          {msg.cardData.detail.event.title}
                        </h4>
                        <p className="text-[10px] text-[#6b6b70]">
                          {msg.cardData.detail.event.venue || "TBA"} • {msg.cardData.detail.event.status}
                        </p>
                      </div>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                        {msg.cardData.detail.event.price_label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-indigo-50 p-2.5 border border-indigo-100">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Event Gross Revenue</p>
                        <p className="text-sm font-extrabold text-indigo-700 mt-0.5">
                          KES {Number(msg.cardData.detail.analytics.totalRevenue).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-100">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Revenue Today</p>
                        <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                          KES {Number(msg.cardData.detail.analytics.revenueToday).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {msg.cardData.detail.analytics.ticketTiers?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-bold text-[#6b6b70] flex items-center gap-1">
                          <FiTag /> Ticket Tiers Sold
                        </p>
                        <div className="space-y-1">
                          {msg.cardData.detail.analytics.ticketTiers.map((t, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[#fafafa] p-1.5 rounded-lg text-[11px] border border-[#ececec]">
                              <span className="font-semibold text-[#0f0f10]">{t.tier_name}</span>
                              <span className="font-bold text-indigo-700">{t.sold_qty} sold (KES {Number(t.tier_revenue).toLocaleString()})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Overview Dashboard Card */}
                {msg.cardData.type === "organizer_overview" && msg.cardData.overview && (
                  <div className="rounded-[18px] border border-indigo-200 bg-indigo-50/60 p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <FiDollarSign /> Performance Summary
                      </span>
                      <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                        Live Data
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-white p-3 border border-indigo-100 shadow-2xs">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Gross Revenue</p>
                        <p className="text-base font-extrabold text-indigo-700 mt-0.5">
                          KES {Number(msg.cardData.overview.totalRevenue).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-indigo-100 shadow-2xs">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Tickets Sold</p>
                        <p className="text-base font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.overview.totalTicketsSold}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-indigo-100 shadow-2xs">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Active Events</p>
                        <p className="text-base font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.overview.activeEvents}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-indigo-100 shadow-2xs">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Gate Check-In</p>
                        <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                          {msg.cardData.overview.gateCheckIn?.checkInRatePercent || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Events Performance List Card */}
                {msg.cardData.type === "organizer_events" && msg.cardData.events && (
                  <div className="rounded-[18px] border border-[#ececec] bg-white p-3 shadow-sm space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 p-1 flex items-center gap-1.5">
                      <FiPieChart /> Your Events Breakdown
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {msg.cardData.events.map((evt) => (
                        <div
                          key={evt.id}
                          className="flex items-center justify-between rounded-xl bg-[#fafafa] p-2.5 border border-[#ececec] text-xs"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-bold text-[#0f0f10] truncate">{evt.title}</p>
                            <p className="text-[10px] text-[#6b6b70] truncate">{evt.venue || "TBA"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-indigo-700">
                              KES {Number(evt.revenue_generated || 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-[#6b6b70] font-semibold">
                              {evt.tickets_sold} tickets
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Gate Attendance Card */}
                {msg.cardData.type === "organizer_gate" && msg.cardData.summary && (
                  <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <FiUsers /> Gate Entrance Status
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-white p-3 border border-emerald-200">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Checked In</p>
                        <p className="text-lg font-extrabold text-emerald-600">
                          {msg.cardData.summary.checkedInCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-emerald-200">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Pending Entrance</p>
                        <p className="text-lg font-extrabold text-amber-600">
                          {msg.cardData.summary.pendingCount}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 rounded-[20px] rounded-bl-xs bg-white border border-[#ececec] px-4 py-3 text-xs text-[#0f0f10] shadow-sm w-fit">
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
              <FiTrendingUp className="h-3.5 w-3.5 animate-spin" />
            </div>
            <span className="font-semibold text-[#0f0f10]">Copilot is analyzing stats</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input */}
      <div className="border-t border-[#ececec] bg-white p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about today's sales, specific events, or check-ins..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2.5 text-xs text-[#0f0f10] focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Organizer Copilot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-700 to-slate-900 px-5 py-3.5 text-white shadow-xl shadow-indigo-900/30 transition hover:scale-105 active:scale-95"
            aria-label="Open Organizer Copilot"
          >
            <div className="relative">
              <FiTrendingUp className="h-6 w-6 text-indigo-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
            </div>
            <span className="font-bold text-sm tracking-wide hidden sm:inline">Organizer Copilot</span>
          </button>
        )}
      </div>

      {/* Render Modal Container */}
      {isOpen && (
        isExpanded ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 sm:p-6 transition-all duration-300">
            {modalContent}
          </div>
        ) : (
          <div className="fixed bottom-4 right-4 z-50">
            {modalContent}
          </div>
        )
      )}
    </>
  );
}
