"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiLoader, FiCalendar, FiMapPin, FiCompass } from "react-icons/fi";
import { apiRequest, BACKEND_URL } from "@/lib/api";
import { PublicHeader } from "@/components/PublicHeader";

function getImageSrc(event) {
  if (!event) return "/sideimage.png";
  if (event.cover_image_url) return `${BACKEND_URL}${event.cover_image_url}`;
  if (event.cover_image_base64) return event.cover_image_base64;
  return "/sideimage.png";
}

function formatShortDate(dateStr) {
  if (!dateStr) return "TBC";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" });
}

export default function HolidayPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiRequest("/events?limit=100");
        const list = response?.data || [];
        // Filter events for Holiday, Family, or Music categories
        const filtered = list.filter((event) =>
          ["Holiday", "Family", "Music"].includes(event.category)
        );
        setEvents(filtered);
      } catch (err) {
        console.error("Failed to load events:", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          
          {/* Banner Card */}
          <div className="rounded-[24px] border border-[#ececec] bg-white p-6 sm:p-8 shadow-[0_4px_16px_rgba(15,15,16,0.04)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f33959]/10 px-3 py-1 text-xs font-bold text-[#f33959]">
              <FiCompass size={12} /> Holiday Outings
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0f0f10]">
              Plan the next holiday outing.
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg leading-7 text-[#6b6b70]">
              Explore family days, beach markets, outdoor concerts, and festive experiences directly loaded from our active local event schedule.
            </p>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="mt-12 flex flex-col items-center justify-center py-12">
              <FiLoader size={32} className="animate-spin text-[#f33959]" />
              <p className="mt-3 text-sm font-bold text-[#6b6b70]">Fetching active listings…</p>
            </div>
          ) : events.length === 0 ? (
            <div className="mt-12 text-center py-12 border border-dashed border-[#ececec] rounded-[24px] bg-white p-8">
              <span className="text-4xl">🏝️</span>
              <h3 className="mt-4 text-lg font-bold text-[#0f0f10]">No Outings Scheduled</h3>
              <p className="mt-2 text-sm text-[#6b6b70] max-w-sm mx-auto">
                There are currently no active events matching Holiday, Family, or Music categories. Check back later or create one!
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const img = getImageSrc(event);
                const date = formatShortDate(event.event_date);
                const price = event.price_label || "Free";

                return (
                  <Link
                    key={event.id || event.slug}
                    href={`/events/${event.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[24px] border border-[#ececec] bg-white p-3 shadow-[0_4px_12px_rgba(15,15,16,0.03)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,15,16,0.08)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[#111113]">
                      <img
                        src={img}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "/sideimage.png"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Category tag */}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-bold text-[#f33959] shadow-sm">
                        {event.category}
                      </span>
                      
                      {/* Price tag */}
                      <span className="absolute right-3 top-3 rounded-full bg-[#111113]/90 backdrop-blur px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        {price}
                      </span>
                    </div>

                    <div className="mt-4 px-2 pb-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-[#0f0f10] group-hover:text-[#f33959] transition-colors line-clamp-1">
                          {event.title}
                        </h2>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-[#6b6b70]">
                          <FiMapPin size={13} className="text-[#6b6b70]/80" />
                          <span className="truncate">{event.venue}</span>
                        </p>
                      </div>
                      <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#f33959]">
                        <FiCalendar size={13} />
                        <span>{date}</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </section>
      </main>
    </>
  );
}
