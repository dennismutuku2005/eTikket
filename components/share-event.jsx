"use client";

import { useEffect, useState } from "react";
import { IoShareOutline } from "react-icons/io5";

export default function ShareEvent({ title, className, iconOnly = false }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  async function share() {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${title} on eTikket`,
        text: `Check out this event: ${title}`,
        url: shareUrl,
      });
    } catch {
      // ignore cancel
    }
  }

  const ShareIcon = () => <IoShareOutline className="h-5 w-5" />;

  // If not mounted yet, render a placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`relative inline-flex ${className || ""}`}>
        <button className="inline-flex items-center justify-center rounded-full transition hover:opacity-80">
          <ShareIcon />
          {!iconOnly && <span className="ml-2 text-sm font-semibold">Share</span>}
        </button>
      </div>
    );
  }

  // After mounted, render the full component
  if (typeof navigator !== "undefined" && navigator.share) {
    return (
      <button
        type="button"
        onClick={share}
        className={`inline-flex items-center justify-center rounded-full transition hover:opacity-80 ${className || ""}`}
        aria-label="Share event"
      >
        <ShareIcon />
        {!iconOnly && <span className="ml-2 text-sm font-semibold">Share</span>}
      </button>
    );
  }

  // Fallback: copy link button with tooltip
  return (
    <div className={`relative inline-flex ${className || ""}`}>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center justify-center rounded-full transition hover:opacity-80"
        aria-label="Copy event link"
      >
        <ShareIcon />
        {!iconOnly && <span className="ml-2 text-sm font-semibold">Share</span>}
      </button>
      {showTooltip && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#111113] px-3 py-1.5 text-xs font-medium text-white shadow-sm">
          {copied ? "Link copied!" : "Copy link"}
        </span>
      )}
    </div>
  );
}