import Image from "next/image";
import Link from "next/link";
import EventsSearch from "@/components/events-search";
import { publicEvents } from "@/lib/public-events";

export default function EventsPage() {
  const categories = Array.from(new Set(publicEvents.map((event) => event.category)));

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/holiday" className="rounded-full px-4 py-2 text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10]">Holidays</Link>
            <Link href="/help" className="hidden rounded-full px-4 py-2 text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10] sm:inline-flex">Help</Link>
            <Link href="/login" className="rounded-full border border-[#ececec] px-4 py-2 hover:bg-[#f4f4f5]">Login</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <p className="text-base font-bold text-[#f33959]">All events</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Search events and compare tickets.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#6b6b70] sm:text-lg sm:leading-8">Find concerts, holiday plans, business events, family days, and nightlife with clean event pages and ticket classes.</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[16px] border border-[#ececec] bg-white p-4 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">Categories</p>
              <h2 className="mt-1 text-lg font-bold">Browse by mood</h2>
              <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0">
                {categories.map((category) => (
                  <a 
                    key={category} 
                    href="#events-list" 
                    className="min-w-36 snap-start rounded-[12px] bg-[#f4f4f5] px-4 py-3 text-center lg:min-w-0"
                  >
                    <p className="text-sm font-semibold">{category}</p>
                    <p className="mt-0.5 text-xs text-[#6b6b70]">
                      {publicEvents.filter((e) => e.category === category).length} events
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </aside>
          
          <div id="events-list">
            <EventsSearch events={publicEvents} />
          </div>
        </div>
      </section>
    </main>
  );
}