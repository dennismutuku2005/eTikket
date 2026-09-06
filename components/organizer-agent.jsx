"use client";

import { useState, useEffect, useRef } from "react";
import { BACKEND_URL } from "@/lib/api";
import { getClientSession } from "@/lib/client-auth";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  FiCopy,
  FiActivity,
  FiZap,
} from "react-icons/fi";

function stripEmojis(str) {
  if (!str || typeof str !== "string") return str;
  return str
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FC}\u{25FB}\u{25FA}\u{25F9}\u{25F8}]/gu,
      ""
    )
    .trim();
}

/**
 * Robust Inline Markdown Parser (handles **bold**, *italic*, `code`, [link](url))
 * Prevents stray asterisks and improperly unescaped tokens.
 */
function renderInlineMarkdown(text) {
  if (!text) return null;
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*([^*]+?)\*|`([^`]+?)`|\[([^\]]+?)\]\(([^)]+?)\))/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // Bold
      parts.push(
        <strong key={`${match.index}-bold`} className="font-bold text-[#0f0f10]">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Italic
      parts.push(
        <em key={`${match.index}-italic`} className="italic text-[#343438]">
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      // Inline Code
      parts.push(
        <code
          key={`${match.index}-code`}
          className="rounded-md bg-[#f4f4f5] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#0f0f10] border border-[#ececec]"
        >
          {match[4]}
        </code>
      );
    } else if (match[5] && match[6]) {
      // Link
      parts.push(
        <a
          key={`${match.index}-link`}
          href={match[6]}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[#f33959] underline hover:text-[#d92847]"
        >
          {match[5]}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Clean & Accurate Block Markdown Renderer
 * Properly isolates headings, bullet lists, numbered steps, and tables.
 */
function FormattedMarkdown({ content }) {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ node, ...props }) => <ul {...props} className="my-2 list-disc space-y-1 pl-5" />,
        ol: ({ node, ...props }) => <ol {...props} className="my-2 list-decimal space-y-1 pl-5" />,
        p: ({ node, ...props }) => <p {...props} className="leading-relaxed" />,
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noreferrer" className="font-bold text-[#f33959] underline hover:text-[#d92847]" />
        ),
      }}
    >
      {stripEmojis(content)}
    </ReactMarkdown>
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
        "### Organizer Operations Intelligence\n\nI am connected to your live organizer dashboard. How can I assist your events today?\n\n- **Live Metrics:** Check revenue collected today and recent orders.\n- **Event Deep Dive:** Analyze ticket tier sales, pacing, and door scan rates.\n- **Executive Reports:** Generate financial summaries and sales projections.",
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
      toast.error("Organizer session expired. Please log in again.");
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
        content: "Here are your organizer metrics.",
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      console.error("Organizer Copilot error:", err);
      toast.error("Copilot connection error. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I had trouble retrieving your organizer metrics. Please check your connection and try asking again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (actionText) => {
    handleSendMessage(actionText);
  };

  const handleCopyReport = (content) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast.success("Executive report copied to clipboard.");
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "### Organizer Operations Intelligence\n\nChat history reset. Select an action below or ask any question regarding your events, ticket tiers, or gate attendance.",
        cardData: null,
      },
    ]);
    toast.info("Conversation cleared.");
  };

  const modalContent = (
    <div
      className={`${
        isExpanded
          ? "w-full max-w-4xl h-[85vh] max-h-195"
          : "w-[calc(100vw-2rem)] max-w-115 h-165 max-h-[85vh]"
      } flex flex-col rounded-3xl border border-[#ececec] bg-white shadow-2xl overflow-hidden transition-all duration-300 font-sans`}
    >
      {/* Header - Styled to match eTikket brand */}
      <div className="flex items-center justify-between border-b border-[#ececec] bg-[#111113] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f33959] font-bold text-white shadow-inner">
            <FiZap className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight flex items-center gap-2">
              Organizer AI Copilot
            </h3>
            <p className="text-xs text-white/70">
              {session?.name ? `${session.name} • Live Operations` : "Authenticated Organizer"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            title="Clear Chat History"
            aria-label="Clear Chat"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            title={isExpanded ? "Dock to corner" : "Expand to center"}
            aria-label="Toggle Expand Modal"
          >
            {isExpanded ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close Copilot"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quick Action Chips in eTikket Brand Style */}
      <div className="flex items-center gap-2 overflow-x-auto bg-[#fafafa] p-3 border-b border-[#ececec] scrollbar-none text-xs">
        <button
          onClick={() => handleChipClick("Show me today's sales and revenue collected today")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-bold text-[#0f0f10] shadow-2xs hover:border-[#f33959] hover:bg-[#f33959] hover:text-white transition flex items-center gap-1.5"
        >
          <FiClock className="text-[#f33959] group-hover:text-white" /> Today's Sales
        </button>
        <button
          onClick={() => handleChipClick("Generate executive sales report for my events")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-bold text-[#0f0f10] shadow-2xs hover:border-[#f33959] hover:bg-[#f33959] hover:text-white transition flex items-center gap-1.5"
        >
          <FiFileText className="text-[#f33959]" /> Executive Report
        </button>
        <button
          onClick={() => handleChipClick("Show live gate check-in and gate attendance stats")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-bold text-[#0f0f10] shadow-2xs hover:border-[#f33959] hover:bg-[#f33959] hover:text-white transition flex items-center gap-1.5"
        >
          <FiUsers className="text-[#f33959]" /> Gate Attendance
        </button>
        <button
          onClick={() => handleChipClick("Show sales breakdown for all my events")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-bold text-[#0f0f10] shadow-2xs hover:border-[#f33959] hover:bg-[#f33959] hover:text-white transition flex items-center gap-1.5"
        >
          <FiBarChart2 className="text-[#f33959]" /> Events Breakdown
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
                isExpanded ? "max-w-[80%]" : "max-w-[92%]"
              } rounded-[20px] px-4.5 py-3.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#111113] text-white rounded-br-xs font-medium shadow-sm"
                  : "bg-white text-[#0f0f10] border border-[#ececec] shadow-2xs rounded-bl-xs"
              }`}
            >
              <FormattedMarkdown content={msg.content} />
            </div>

            {/* Embedded Rich Metric Cards */}
            {msg.cardData && (
              <div className={`mt-3 w-full ${isExpanded ? "max-w-[85%]" : "max-w-[95%]"}`}>
                {/* 1. Today's Revenue & Sales Card */}
                {msg.cardData.type === "today_sales" && msg.cardData.today && (
                  <div className="rounded-[18px] border border-[#ececec] bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#0f0f10] flex items-center gap-1.5">
                        <FiClock className="text-[#f33959]" /> Today's Live Sales ({msg.cardData.today.date})
                      </span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Revenue Today</p>
                        <p className="text-sm font-extrabold text-[#f33959] mt-0.5">
                          KES {Number(msg.cardData.today.revenueToday).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Orders Today</p>
                        <p className="text-sm font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.today.ordersToday}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Tickets Sold</p>
                        <p className="text-sm font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.today.ticketsToday}
                        </p>
                      </div>
                    </div>

                    {msg.cardData.today.recentTodayOrders?.length > 0 && (
                      <div className="pt-1 space-y-1.5">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Recent Orders Today</p>
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {msg.cardData.today.recentTodayOrders.map((o) => (
                            <div
                              key={o.id}
                              className="flex items-center justify-between rounded-xl bg-[#fafafa] p-2 text-xs border border-[#ececec]"
                            >
                              <div>
                                <p className="font-bold text-[#0f0f10]">{o.buyer_name || "Guest"}</p>
                                <p className="text-[10px] text-[#6b6b70]">{o.event_title}</p>
                              </div>
                              <span className="font-bold text-[#f33959]">
                                KES {Number(o.total_amount).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Specific Event Analytics Card */}
                {msg.cardData.type === "specific_event" && msg.cardData.detail && (
                  <div className="rounded-[18px] border border-[#ececec] bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#0f0f10]">
                          {msg.cardData.detail.event.title}
                        </h4>
                        <p className="text-[10px] text-[#6b6b70]">
                          {msg.cardData.detail.event.venue || "TBA"} • {msg.cardData.detail.event.status}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f33959]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#f33959]">
                        {msg.cardData.detail.event.price_label || "Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Gross Revenue</p>
                        <p className="text-sm font-extrabold text-[#f33959] mt-0.5">
                          KES {Number(msg.cardData.detail.analytics.totalRevenue).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[10px] font-bold text-[#6b6b70]">Revenue Today</p>
                        <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                          KES {Number(msg.cardData.detail.analytics.revenueToday).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {msg.cardData.detail.analytics.ticketTiers?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-bold text-[#6b6b70] flex items-center gap-1">
                          <FiTag className="text-[#f33959]" /> Ticket Tiers Sold
                        </p>
                        <div className="space-y-1.5">
                          {msg.cardData.detail.analytics.ticketTiers.map((t, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-[#fafafa] p-2 rounded-xl text-xs border border-[#ececec]"
                            >
                              <span className="font-semibold text-[#0f0f10]">{t.tier_name}</span>
                              <span className="font-bold text-[#f33959]">
                                {t.sold_qty} sold (KES {Number(t.tier_revenue).toLocaleString()})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Overview Dashboard Card */}
                {msg.cardData.type === "organizer_overview" && msg.cardData.overview && (
                  <div className="rounded-[18px] border border-[#ececec] bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#0f0f10] flex items-center gap-1.5">
                        <FiDollarSign className="text-[#f33959]" /> Performance Overview
                      </span>
                      <span className="rounded-full bg-[#111113] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                        Active Account
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Gross Revenue</p>
                        <p className="text-base font-extrabold text-[#f33959] mt-0.5">
                          KES {Number(msg.cardData.overview.totalRevenue).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Tickets Sold</p>
                        <p className="text-base font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.overview.totalTicketsSold}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Active Shows</p>
                        <p className="text-base font-extrabold text-[#0f0f10] mt-0.5">
                          {msg.cardData.overview.activeEvents}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#fafafa] p-3 border border-[#ececec]">
                        <p className="text-[11px] font-bold text-[#6b6b70]">Gate Attendance</p>
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
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#0f0f10] p-1 flex items-center gap-1.5">
                      <FiPieChart className="text-[#f33959]" /> Your Events Breakdown
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {msg.cardData.events.map((evt) => (
                        <div
                          key={evt.id}
                          className="flex items-center justify-between rounded-xl bg-[#fafafa] p-2.5 border border-[#ececec] text-xs hover:border-[#f33959] transition"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-bold text-[#0f0f10] truncate">{evt.title}</p>
                            <p className="text-[10px] text-[#6b6b70] truncate">{evt.venue || "TBA"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-[#f33959]">
                              KES {Number(evt.revenue_generated || 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-[#6b6b70] font-semibold">
                              {evt.tickets_sold} tickets sold
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Gate Attendance Card */}
                {msg.cardData.type === "organizer_gate" && msg.cardData.summary && (
                  <div className="rounded-[18px] border border-[#ececec] bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#0f0f10] flex items-center gap-1.5">
                        <FiUsers className="text-[#f33959]" /> Gate Entrance Status
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200">
                        <p className="text-[11px] font-bold text-emerald-800">Checked In</p>
                        <p className="text-lg font-extrabold text-emerald-700">
                          {msg.cardData.summary.checkedInCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200">
                        <p className="text-[11px] font-bold text-amber-800">Pending Entrance</p>
                        <p className="text-lg font-extrabold text-amber-700">
                          {msg.cardData.summary.pendingCount}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Executive Report Quick Action */}
                {msg.cardData.type === "organizer_report" && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => handleCopyReport(msg.content)}
                      className="rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-xs font-bold text-[#0f0f10] shadow-2xs hover:bg-[#f4f4f5] transition flex items-center gap-1.5"
                    >
                      <FiCopy className="text-[#f33959]" /> Copy Report Markdown
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 rounded-[20px] rounded-bl-xs bg-white border border-[#ececec] px-4 py-3 text-xs text-[#0f0f10] shadow-sm w-fit">
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f33959] text-white">
              <FiActivity className="h-3.5 w-3.5 animate-spin" />
            </div>
            <span className="font-semibold text-[#0f0f10]">Copilot is analyzing stats</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f33959] animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#f33959] animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#f33959] animate-bounce"></span>
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
            className="flex-1 rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2.5 text-xs text-[#0f0f10] focus:border-[#f33959] focus:bg-white focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f33959] text-white hover:bg-[#d92847] disabled:opacity-40 transition"
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
            className="group relative flex items-center gap-3 rounded-full bg-linear-to-r from-[#f33959] to-[#d92847] px-5 py-3.5 text-white shadow-xl shadow-[#f33959]/25 transition hover:scale-105 active:scale-95"
            aria-label="Open Organizer Copilot"
          >
            <div className="relative">
              <FiZap className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </div>
            <span className="font-bold text-sm tracking-wide hidden sm:inline">Organizer Copilot</span>
          </button>
        )}
      </div>

      {/* Render Modal Container */}
      {isOpen &&
        (isExpanded ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 sm:p-6 transition-all duration-300">
            {modalContent}
          </div>
        ) : (
          <div className="fixed bottom-4 right-4 z-50">{modalContent}</div>
        ))}
    </>
  );
}
