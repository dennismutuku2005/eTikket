"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BACKEND_URL } from "@/lib/api";
import { formatEventDate } from "@/lib/formatters";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiUser,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiExternalLink,
  FiZap,
  FiMaximize2,
  FiMinimize2,
  FiChevronDown,
} from "react-icons/fi";

function stripEmojis(str) {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FC}\u{25FB}\u{25FA}\u{25F9}\u{25F8}]/gu, '').trim();
}

function renderInlineMarkdown(text, isUser = false) {
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
      parts.push(
        <strong key={`${match.index}-bold`} className={isUser ? "font-bold text-white" : "font-bold text-[#0f0f10]"}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <em key={`${match.index}-italic`} className={isUser ? "italic text-white/90" : "italic text-[#343438]"}>
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      parts.push(
        <code
          key={`${match.index}-code`}
          className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
            isUser ? "bg-white/20 text-white" : "bg-[#f4f4f5] text-[#0f0f10] border border-[#ececec]"
          }`}
        >
          {match[4]}
        </code>
      );
    } else if (match[5] && match[6]) {
      parts.push(
        <a
          key={`${match.index}-link`}
          href={match[6]}
          target="_blank"
          rel="noreferrer"
          className={`font-bold underline ${isUser ? "text-white" : "text-[#f33959] hover:text-[#d92847]"}`}
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
 * Clean & Accurate Block Markdown Renderer for Buyer Concierge
 */
function FormattedMarkdown({ content, isUser = false }) {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ node, ...props }) => <ul {...props} className="my-2 list-disc space-y-1 pl-5" />,
        ol: ({ node, ...props }) => <ol {...props} className="my-2 list-decimal space-y-1 pl-5" />,
        p: ({ node, ...props }) => <p {...props} className="leading-relaxed" />,
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noreferrer" className={isUser ? "font-bold underline" : "font-bold text-[#f33959] underline hover:text-[#d92847]"} />
        ),
      }}
    >
      {stripEmojis(content)}
    </ReactMarkdown>
  );

  const rawLines = stripEmojis(content).split("\n");
  const blocks = [];
  let index = 0;

  while (index < rawLines.length) {
    const line = rawLines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    // 1. Headings (#, ##, ###)
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      index += 1;
      continue;
    }

    // 2. Unordered List Items (- or * or •)
    if (/^([-*•])\s+(.+)/.test(trimmed)) {
      const items = [];
      while (index < rawLines.length) {
        const itemLine = rawLines[index].trim();
        const match = itemLine.match(/^([-*•])\s+(.+)/);
        if (!match) break;
        items.push(match[2]);
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // 3. Ordered List Items (1. 2. 3.)
    if (/^\d+\.\s+(.+)/.test(trimmed)) {
      const items = [];
      while (index < rawLines.length) {
        const itemLine = rawLines[index].trim();
        const match = itemLine.match(/^\d+\.\s+(.+)/);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    // 4. Standard Paragraph
    const paragraphLines = [trimmed];
    index += 1;
    while (
      index < rawLines.length &&
      rawLines[index].trim() &&
      !/^(#{1,3})\s|^([-*•]|\d+\.)\s+/.test(rawLines[index].trim())
    ) {
      paragraphLines.push(rawLines[index].trim());
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
  }

  return (
    <div className={`space-y-2 leading-relaxed text-[13px] ${isUser ? "text-white" : "text-[#343438]"}`}>
      {blocks.map((block, blockIndex) => {
        if (block.type === "heading") {
          return (
            <h4
              key={blockIndex}
              className={`mt-1 font-bold ${
                isUser ? "text-white text-sm" : "text-[#0f0f10] text-sm flex items-center gap-1.5"
              }`}
            >
              {!isUser && <span className="h-1.5 w-1.5 rounded-full bg-[#f33959]" />}
              {renderInlineMarkdown(block.text, isUser)}
            </h4>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={blockIndex} className="my-1.5 space-y-1 pl-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-[13px]">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isUser ? "bg-white" : "bg-[#f33959]"}`} />
                  <div className="flex-1 leading-normal">{renderInlineMarkdown(item, isUser)}</div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={blockIndex} className="my-1.5 space-y-1 pl-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-[13px]">
                  <span
                    className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isUser ? "bg-white/20 text-white" : "bg-[#f33959]/10 text-[#f33959]"
                    }`}
                  >
                    {itemIndex + 1}
                  </span>
                  <div className="flex-1 leading-normal pt-0.5">{renderInlineMarkdown(item, isUser)}</div>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex} className="leading-relaxed">
            {renderInlineMarkdown(block.text, isUser)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Paginated Clean Event Cards Component
 */
function EventCardsList({ events, isExpanded, onSelectEvent }) {
  const [visibleCount, setVisibleCount] = useState(4);

  if (!events || events.length === 0) return null;

  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  return (
    <div className="space-y-3 pt-1">
      <div className={`grid gap-3 ${isExpanded ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {visibleEvents.map((evt) => (
          <div
            key={evt.id}
            className="flex flex-col rounded-2xl border border-[#ececec] bg-white p-3 shadow-2xs hover:border-[#f33959] transition"
          >
            <div className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4f4f5] border border-[#ececec]">
                {evt.cover_image_url ? (
                  <img
                    src={`${BACKEND_URL}${evt.cover_image_url}`}
                    alt={evt.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-bold text-[#6b6b70]">
                    Event
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="rounded-full bg-[#f33959]/10 px-2 py-0.5 text-[10px] font-bold text-[#f33959]">
                  {evt.category || "Event"}
                </span>
                <h4 className="font-bold text-sm text-[#0f0f10] truncate mt-0.5">
                  {evt.title}
                </h4>
                <p className="text-xs text-[#6b6b70] flex items-center gap-1 mt-1">
                  <FiCalendar className="shrink-0" />
                  {formatEventDate(evt.event_date)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#f4f4f5] pt-2">
              <span className="font-bold text-sm text-[#0f0f10]">
                {evt.price_label || `KES ${evt.price || 0}`}
              </span>
              <button
                onClick={() => onSelectEvent(evt)}
                className="rounded-full bg-[#f33959] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#d92847] transition"
              >
                Select Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 4)}
          className="w-full rounded-xl border border-[#ececec] bg-white py-2 text-xs font-bold text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10] transition flex items-center justify-center gap-1"
        >
          Load More Events ({events.length - visibleCount} remaining)
          <FiChevronDown className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function EtikketAgent() {
  const pathname = usePathname();

  // Hide buyer AI Concierge agent on Organizer, Admin, and Gate Staff dashboard routes
  if (pathname?.startsWith("/organizer") || pathname?.startsWith("/admin") || pathname?.startsWith("/gatestaff")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello. I am your **eTikket AI Concierge**. I can help you search events, select tickets, validate your M-Pesa phone, trigger STK Push payment, and send your QR code ticket links via WhatsApp.\n\nHow can I assist you today?",
      cardData: null,
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketTiers, setTicketTiers] = useState([]);
  const [loadingTiers, setLoadingTiers] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    qty: 1,
    ticketTierId: "",
    ticketTypeName: "General",
    unitPrice: 0,
  });

  const [activeOrder, setActiveOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedEvent?.id) return;
    setLoadingTiers(true);
    fetch(`${BACKEND_URL}/api/event-ticket-types/${selectedEvent.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTicketTiers(data);
          const firstTier = data[0];
          setBookingDetails((prev) => ({
            ...prev,
            ticketTierId: firstTier.id,
            ticketTypeName: firstTier.name || "General",
            unitPrice: Number(firstTier.price) || 0,
          }));
        } else {
          const defaultPrice = Number(selectedEvent.price) || 0;
          setTicketTiers([{ id: "default", name: "General", price: defaultPrice }]);
          setBookingDetails((prev) => ({
            ...prev,
            ticketTierId: "default",
            ticketTypeName: "General",
            unitPrice: defaultPrice,
          }));
        }
      })
      .catch(() => {
        const defaultPrice = Number(selectedEvent.price) || 0;
        setTicketTiers([{ id: "default", name: "General", price: defaultPrice }]);
        setBookingDetails((prev) => ({
          ...prev,
          ticketTierId: "default",
          ticketTypeName: "General",
          unitPrice: defaultPrice,
        }));
      })
      .finally(() => setLoadingTiers(false));
  }, [selectedEvent?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading, paymentStatus]);

  const handleSendMessage = async (textToSend = input) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            selectedEventId: selectedEvent?.id,
            bookingDetails,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const assistantReply = data.reply || {
        role: "assistant",
        content: "I am having a brief issue connecting to my service, but I can still assist you with events.",
      };

      if (assistantReply.cardData?.type === "order_summary" && assistantReply.cardData.order) {
        setActiveOrder(assistantReply.cardData.order);
      }
      if ((assistantReply.cardData?.type === "booking_form" || assistantReply.cardData?.type === "single_event") && assistantReply.cardData.event) {
        setSelectedEvent(assistantReply.cardData.event);
      }

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      toast.error("Agent connection error. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble processing that request. Please try asking again or select an event below.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (actionText) => {
    handleSendMessage(actionText);
  };

  const handleSelectEvent = (evt) => {
    setSelectedEvent(evt);
    const selectMsg = `I would like to book tickets for "${evt.title}". Price: ${evt.price_label || "KES " + (evt.price || 0)}`;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: selectMsg },
      {
        role: "assistant",
        content: `You selected **${evt.title}** (${evt.price_label || "KES " + (evt.price || 0)}).\n\nPlease enter your Full Name, Email, M-Pesa Phone Number, and select your Ticket Class below to proceed:`,
        cardData: { type: "booking_form", event: evt },
      },
    ]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone) {
      toast.error("Please fill in all fields (Name, Email, Phone).");
      return;
    }

    setLoading(true);

    try {
      const valRes = await fetch(`${BACKEND_URL}/api/agent/validate-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: bookingDetails.phone }),
      });
      const valData = await valRes.json();

      if (!valData.valid) {
        toast.error(valData.message);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: valData.message,
          },
        ]);
        setLoading(false);
        return;
      }

      const orderRes = await fetch(`${BACKEND_URL}/api/agent/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          buyer_name: bookingDetails.name,
          buyer_email: bookingDetails.email,
          buyer_phone: valData.formatted,
          ticket_tier_id: bookingDetails.ticketTierId,
          ticket_type_name: bookingDetails.ticketTypeName,
          ticket_qty: Number(bookingDetails.qty) || 1,
        }),
      });

      const orderData = await orderRes.json();

      if (orderData.error) {
        toast.error(orderData.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Order creation failed: ${orderData.error}` },
        ]);
      } else {
        setActiveOrder(orderData);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Order created successfully. Order #${orderData.order_number}\nTotal Amount: **KES ${Number(orderData.total_amount).toLocaleString()}** for **${orderData.ticket_qty} ticket(s)**.\n\nReady to pay via M-Pesa STK Push?`,
            cardData: { type: "order_summary", order: orderData },
          },
        ]);
      }
    } catch (err) {
      toast.error("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayStk = async (orderToPay) => {
    setPaymentStatus("initiating");
    toast.info("Sending M-Pesa STK Push prompt to your phone...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/agent/pay-stk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderToPay.order_id || orderToPay.id,
          phone: orderToPay.buyer_phone,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setPaymentStatus("failed");
        toast.error(data.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `M-Pesa Payment Failed: ${data.error}` },
        ]);
      } else if (data.success) {
        setPaymentStatus("paid");
        toast.success("Payment Confirmed. Tickets dispatched.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `**Payment Received Successfully.**\n\nYour e-tickets have been generated and dispatched via WhatsApp to **${data.phone || bookingDetails.phone}**. You can also click the links below to view your QR codes directly:`,
            cardData: { type: "tickets_ready", result: data },
          },
        ]);
      }
    } catch (err) {
      setPaymentStatus("failed");
      toast.error("M-Pesa processing error.");
    }
  };

  const modalContent = (
    <div
      className={`${
        isExpanded
          ? "w-full max-w-3xl h-[85vh] max-h-190"
          : "w-[calc(100vw-2rem)] max-w-110 h-162.5 max-h-[85vh]"
      } flex flex-col rounded-3xl border border-[#ececec] bg-white shadow-2xl overflow-hidden transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ececec] bg-[#111113] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f33959] font-bold text-white shadow-inner">
            <FiZap className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight flex items-center gap-2">
              eTikket Concierge
            </h3>
            <p className="text-xs text-white/70">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
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
            aria-label="Close Agent Chat"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto bg-[#fafafa] p-3 border-b border-[#ececec] scrollbar-none text-xs">
        <button
          onClick={() => handleChipClick("Show me affordable events with lowest prices")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-semibold text-[#0f0f10] shadow-2xs hover:bg-[#f33959] hover:text-white hover:border-[#f33959] transition"
        >
          Affordable Events
        </button>
        <button
          onClick={() => handleChipClick("Show me top upcoming events in Kenya")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-semibold text-[#0f0f10] shadow-2xs hover:bg-[#f33959] hover:text-white hover:border-[#f33959] transition"
        >
          Top Events
        </button>
        <button
          onClick={() => handleChipClick("How do I pay with M-Pesa STK push?")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-semibold text-[#0f0f10] shadow-2xs hover:bg-[#f33959] hover:text-white hover:border-[#f33959] transition"
        >
          M-Pesa STK Pay
        </button>
        <button
          onClick={() => handleChipClick("Find music concerts")}
          className="whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 font-semibold text-[#0f0f10] shadow-2xs hover:bg-[#f33959] hover:text-white hover:border-[#f33959] transition"
        >
          Music Concerts
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
                isExpanded ? "max-w-[75%]" : "max-w-[88%]"
              } rounded-[20px] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#f33959] text-white rounded-br-xs font-medium"
                  : "bg-white text-[#0f0f10] border border-[#ececec] shadow-2xs rounded-bl-xs"
              }`}
            >
              <FormattedMarkdown content={msg.content} isUser={msg.role === "user"} />
            </div>

            {/* Render Embedded Rich Cards */}
            {msg.cardData && (
              <div className={`mt-3 w-full ${isExpanded ? "max-w-[85%]" : "max-w-[95%]"}`}>
                {/* 1. Paginated Events Cards */}
                {msg.cardData.type === "events_list" && msg.cardData.events && (
                  <EventCardsList
                    events={msg.cardData.events}
                    isExpanded={isExpanded}
                    onSelectEvent={handleSelectEvent}
                  />
                )}

                {/* 1b. Single Selected Event Card */}
                {msg.cardData.type === "single_event" && msg.cardData.event && (
                  <div className="rounded-[18px] border border-[#ececec] bg-white p-3.5 shadow-md space-y-2">
                    <div className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4f4f5] border border-[#ececec]">
                        {msg.cardData.event.cover_image_url ? (
                          <img
                            src={`${BACKEND_URL}${msg.cardData.event.cover_image_url}`}
                            alt={msg.cardData.event.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-bold text-[#6b6b70]">
                            Event
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="rounded-full bg-[#f33959]/10 px-2 py-0.5 text-[10px] font-bold text-[#f33959]">
                          {msg.cardData.event.category || "Selected Event"}
                        </span>
                        <h4 className="font-bold text-sm text-[#0f0f10] truncate mt-0.5">
                          {msg.cardData.event.title}
                        </h4>
                        <p className="text-xs text-[#6b6b70] flex items-center gap-1 mt-1">
                          <FiCalendar className="shrink-0" />
                          {formatEventDate(msg.cardData.event.event_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#f4f4f5] pt-2 mt-2">
                      <span className="font-bold text-sm text-[#0f0f10]">
                        {msg.cardData.event.price_label || `KES ${msg.cardData.event.price || 0}`}
                      </span>
                      <button
                        onClick={() => handleSelectEvent(msg.cardData.event)}
                        className="rounded-full bg-[#f33959] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#d92847] transition"
                      >
                        Book This Event
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Interactive Booking Form Card */}
                {msg.cardData.type === "booking_form" && (
                  <form
                    onSubmit={handleFormSubmit}
                    className="rounded-[18px] border border-[#ececec] bg-white p-4 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#f33959] flex items-center gap-1.5">
                        <FiUser /> Guest Ticket Details
                      </h4>
                      {bookingDetails.unitPrice * (Number(bookingDetails.qty) || 1) > 0 ? (
                        <span className="rounded-full bg-[#f33959]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#f33959]">
                          KES {(bookingDetails.unitPrice * (Number(bookingDetails.qty) || 1)).toLocaleString()}
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          Free
                        </span>
                      )}
                    </div>

                    {/* Ticket Class / Tier Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-[#6b6b70]">Ticket Class / Tier *</label>
                      {loadingTiers ? (
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#6b6b70]">
                          <FiRefreshCw className="animate-spin text-[#f33959]" /> Loading ticket classes...
                        </div>
                      ) : ticketTiers.length > 0 ? (
                        <select
                          value={bookingDetails.ticketTierId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedTier = ticketTiers.find((t) => String(t.id) === String(selectedId)) || ticketTiers[0];
                            setBookingDetails({
                              ...bookingDetails,
                              ticketTierId: selectedTier.id,
                              ticketTypeName: selectedTier.name,
                              unitPrice: Number(selectedTier.price) || 0,
                            });
                          }}
                          className="mt-1 w-full rounded-xl border border-[#ececec] bg-white px-3 py-2 text-xs font-semibold text-[#0f0f10] focus:border-[#f33959] focus:outline-none"
                        >
                          {ticketTiers.map((tier) => (
                            <option key={tier.id} value={tier.id}>
                              {tier.name} — {Number(tier.price) === 0 ? "Free" : `KES ${Number(tier.price).toLocaleString()}`}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          disabled
                          value="General Ticket"
                          className="mt-1 w-full rounded-xl border border-[#ececec] bg-[#f4f4f5] px-3 py-2 text-xs font-medium text-[#6b6b70]"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#6b6b70]">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dennis Mutuku"
                        value={bookingDetails.name}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#ececec] px-3 py-2 text-xs font-medium focus:border-[#f33959] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6b6b70]">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. buyer@example.com"
                        value={bookingDetails.email}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#ececec] px-3 py-2 text-xs font-medium focus:border-[#f33959] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-[#6b6b70]">M-Pesa Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="0712345678"
                          value={bookingDetails.phone}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-[#ececec] px-3 py-2 text-xs font-medium focus:border-[#f33959] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#6b6b70]">Tickets</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={bookingDetails.qty}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, qty: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-[#ececec] px-3 py-2 text-xs font-medium focus:border-[#f33959] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Total Amount Summary Box */}
                    <div className="flex items-center justify-between rounded-xl bg-[#fafafa] p-2.5 border border-[#ececec]">
                      <span className="text-xs font-bold text-[#6b6b70]">Total Amount:</span>
                      <span className="text-sm font-extrabold text-[#f33959]">
                        {bookingDetails.unitPrice * (Number(bookingDetails.qty) || 1) === 0
                          ? "Free"
                          : `KES ${(bookingDetails.unitPrice * (Number(bookingDetails.qty) || 1)).toLocaleString()}`}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-[#0f0f10] py-2.5 text-xs font-bold text-white hover:bg-black transition flex items-center justify-center gap-2"
                    >
                      {loading ? <FiRefreshCw className="animate-spin" /> : "Confirm Order & Continue"}
                    </button>
                  </form>
                )}

                {/* 3. Order Summary & STK Push Card */}
                {msg.cardData.type === "order_summary" && msg.cardData.order && (
                  <div className="rounded-[18px] border border-[#ececec] bg-white p-4 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-2">
                      <span className="font-bold text-xs text-[#6b6b70]">Order #{msg.cardData.order.order_number}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        Payment Pending
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#0f0f10]">
                      <p><strong>Event:</strong> {msg.cardData.order.event_title}</p>
                      <p><strong>Ticket Class:</strong> {msg.cardData.order.ticket_type || "General"} ({msg.cardData.order.ticket_qty} ticket(s))</p>
                      <p><strong>Buyer:</strong> {msg.cardData.order.buyer_name} ({msg.cardData.order.buyer_phone})</p>
                      <p><strong>Total Amount:</strong> <span className="font-bold text-sm text-[#f33959]">{Number(msg.cardData.order.total_amount) === 0 ? "Free" : `KES ${Number(msg.cardData.order.total_amount).toLocaleString()}`}</span></p>
                    </div>
                    {paymentStatus === "initiating" ? (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-amber-50/90 p-4 border border-amber-200/90 text-xs text-amber-900 shadow-sm">
                        <div className="flex items-center gap-2 font-bold text-amber-900">
                          <FiPhone className="h-4 w-4 animate-bounce text-amber-700" />
                          Awaiting M-Pesa PIN on {msg.cardData.order.buyer_phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                          <span>STK Push sent • Enter your PIN</span>
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-bounce"></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePayStk(msg.cardData.order)}
                        className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 py-3 text-xs font-bold text-white hover:from-emerald-700 hover:to-emerald-800 transition shadow-md flex items-center justify-center gap-2"
                      >
                        <FiCreditCard className="h-4 w-4" /> Pay KES {Number(msg.cardData.order.total_amount).toLocaleString()} via M-Pesa STK Push
                      </button>
                    )}
                  </div>
                )}

                {/* 4. Issued E-Tickets Card */}
                {msg.cardData.type === "tickets_ready" && msg.cardData.result && (
                  <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/50 p-4 shadow-md space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <FiCheckCircle className="h-5 w-5 text-emerald-600" />
                      Tickets Issued & Dispatched
                    </div>
                    <p className="text-xs text-[#6b6b70]">
                      WhatsApp confirmation with QR code ticket links sent to <strong>{bookingDetails.phone || msg.cardData.result.buyer_phone}</strong>.
                    </p>
                    <div className="space-y-2 pt-1">
                      {msg.cardData.result.tickets?.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-emerald-200 text-xs"
                        >
                          <div>
                            <p className="font-bold text-[#0f0f10]">{t.ticket_type} Ticket</p>
                            <p className="font-mono text-[10px] text-[#6b6b70]">{t.ticket_code}</p>
                          </div>
                          <a
                            href={t.url || `https://e-tikket.vercel.app/tickets/${t.ticket_code}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 rounded-lg bg-[#f33959] px-2.5 py-1.5 font-bold text-white text-[11px] hover:bg-[#d92847] transition"
                          >
                            View QR <FiExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 rounded-[20px] rounded-bl-xs bg-white border border-[#ececec] px-4 py-3 text-xs text-[#0f0f10] shadow-sm w-fit">
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f33959] text-white">
              <FiZap className="h-3.5 w-3.5 animate-spin" />
            </div>
            <span className="font-semibold text-[#0f0f10]">eTikket AI is thinking</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f33959] animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#f33959] animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#f33959] animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
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
            placeholder="Ask about events, book tickets, or verify phone..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2.5 text-xs text-[#0f0f10] focus:border-[#f33959] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 shrink-[#0] items-center justify-center rounded-full bg-[#f33959] text-white hover:bg-[#d92847] disabled:opacity-40 transition"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 rounded-full bg-linear-to-r from-[#f33959] to-[#d92847] px-5 py-3.5 text-white shadow-xl shadow-[#f33959]/25 transition hover:scale-105 active:scale-95"
            aria-label="Open eTikket AI Assistant"
          >
            <div className="relative">
              <FiMessageSquare className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <span className="font-bold text-sm tracking-wide hidden sm:inline">Ask AI Agent</span>
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
