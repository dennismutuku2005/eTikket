"use client";

import { useEffect, useState } from "react";

export default function ShareEvent({ title }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
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

  return (
    <div className="mt-6 rounded-[14px] border border-[#ececec] bg-[#fafafa] p-5">
      <p className="text-sm font-semibold text-[#6b6b70]">Share this event</p>
      <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
        Share the event with friends so they can buy tickets quickly.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 border border-slate-200 transition hover:bg-slate-50"
        >
          {copied ? "Link copied" : "Copy link"}
        </button>
        {typeof navigator !== "undefined" && navigator.share ? (
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center justify-center rounded-full bg-[#f33959] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d92847]"
          >
            Share
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#94a3b8]">URL: {shareUrl || "Loading..."}</p>
    </div>
  );
}
