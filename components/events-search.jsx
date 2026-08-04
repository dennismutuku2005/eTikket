"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function EventsSearch({ events: initialEvents = [] }) {
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(initialEvents.length);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const payload = await apiRequest(`/events?page=1&limit=6&search=${encodeURIComponent(query)}&category=${encodeURIComponent(category === "All" ? "" : category)}`);
        const items = Array.isArray(payload?.data) ? payload.data : payload;
        setEvents(items);
        setPage(1);
        setHasMore(items.length >= 6);
        setTotal(payload?.total ?? items.length);
      } catch {
        setEvents(initialEvents);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [category, query]);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const payload = await apiRequest(`/events?page=${nextPage}&limit=6&search=${encodeURIComponent(query)}&category=${encodeURIComponent(category === "All" ? "" : category)}`);
      const items = Array.isArray(payload?.data) ? payload.data : payload;
      setEvents((current) => [...current, ...items]);
      setPage(nextPage);
      setHasMore(items.length === 6 && current.length + items.length < (payload?.total ?? Number.MAX_SAFE_INTEGER));
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => ["All", ...Array.from(new Set(events.map((event) => event.category).filter(Boolean)))], [events]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory = category === "All" || event.category === category;
      const matchesQuery = [event.title, event.venue || event.location, event.description, event.host_name || event.host]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, events, query]);

  return (
    <div>
      <div className="rounded-[20px] border border-[#ececec] bg-white p-4 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#6b6b70]">Search events</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-[52px] w-full rounded-full border border-transparent bg-[#f4f4f5] px-5 text-base outline-none focus:border-[#f33959] focus:bg-white"
            placeholder="Search by event, host, or location"
          />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? "bg-[#111113] text-white" : "bg-[#f4f4f5] text-[#6b6b70] hover:text-[#0f0f10]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const imageSrc = event.cover_image_base64 ? `data:image/png;base64,${event.cover_image_base64}` : event.image || "/sideimage.png";
          const location = event.venue || event.location || "Venue pending";
          const date = event.event_date || event.date || "TBA";
          const price = event.price_label || event.price || "Check availability";
          return (
            <Link key={event.slug || event.id} href={`/events/${event.slug || event.id}`} className="rounded-[20px] border border-[#ececec] bg-white p-3 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,15,16,0.12)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#111113]">
                <Image src={imageSrc} alt="" fill sizes="(max-width: 768px) 100vw, 360px" className={`object-cover ${event.status === "Sold out" ? "grayscale" : ""}`} />
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/45" />
                <span className={`absolute left-3 top-3 rounded-full px-4 py-2 text-sm font-bold ${event.status === "Sold out" ? "bg-[#a3a3a8] text-white" : "bg-white text-[#f33959]"}`}>{event.status}</span>
                <span className="absolute right-3 top-3 rounded-full bg-[#111113] px-4 py-2 text-sm font-bold text-white">{price}</span>
              </div>
              <div className="p-2">
                <p className="text-sm font-bold text-[#f33959]">{event.category}</p>
                <h2 className="mt-1 text-xl font-bold">{event.title}</h2>
                <p className="mt-2 text-base leading-6 text-[#6b6b70]">{location} - {date}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6b6b70]">{event.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-[#ececec] bg-white p-8 text-center">
          <h2 className="text-2xl font-bold">No events found</h2>
          <p className="mt-2 text-base text-[#6b6b70]">Try another search or category.</p>
        </div>
      ) : null}

      {hasMore && filteredEvents.length > 0 ? (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={loadMore} className="rounded-full bg-[#111113] px-5 py-2.5 text-sm font-bold text-white" disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
