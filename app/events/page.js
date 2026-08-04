import Link from "next/link";
import EventsSearch from "@/components/events-search";
import { PublicHeader } from "@/components/PublicHeader";
import { fetchPublicEvents } from "@/lib/events-client";

async function getInitialEvents() {
  const payload = await fetchPublicEvents({ page: 1, limit: 6 });
  return Array.isArray(payload?.data) ? payload.data : payload.data || [];
}

export default async function EventsPage() {
  const events = await getInitialEvents();
  const categories = Array.from(new Set(events.map((event) => event.category).filter(Boolean)));

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fafafa] text-[#0f0f10]">
      <PublicHeader />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <p className="text-base font-bold text-[#f33959]">All events</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Search events and compare tickets.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#6b6b70] sm:text-lg sm:leading-8">Find concerts, holiday plans, business events, family days, and nightlife with clean event pages and ticket classes.</p>
          
          {/* Simple category filter pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link 
              href="/events" 
              className="rounded-full bg-[#f33959] px-4 py-2 text-sm font-semibold text-white"
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/events?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-[#ececec] bg-white px-4 py-2 text-sm font-semibold text-[#6b6b70] hover:bg-[#f4f4f5]"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <EventsSearch events={events} />
        </div>
      </section>
    </main>
  );
}