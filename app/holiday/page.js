import Image from "next/image";
import Link from "next/link";
import { getPublicEvents } from "@/lib/public-events";
import { PublicHeader } from "@/components/PublicHeader";

export default function HolidayPage() {
  const holidayEvents = getPublicEvents().filter((event) => ["Holiday", "Family", "Music"].includes(event.category));

  return (
    <>
      <PublicHeader />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <p className="text-base font-bold text-[#f33959]">Holiday events</p>
          <h1 className="mt-2 max-w-2xl text-5xl font-bold leading-tight">Plan the next holiday outing.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6b6b70]">Family days, beach markets, concerts, and festive experiences with clean cards and ticket pages.</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {holidayEvents.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="rounded-[20px] border border-[#ececec] bg-white p-3 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,15,16,0.12)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#111113]">
                <Image src={event.image} alt="" fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/10 to-black/45" />
                <span className="absolute left-3 top-3 rounded-full bg-white px-4 py-2 text-base font-bold text-[#f33959]">{event.category}</span>
                <span className="absolute right-3 top-3 rounded-full bg-[#111113] px-4 py-2 text-base font-bold text-white">{event.price}</span>
              </div>
              <div className="p-2">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p className="mt-2 text-base text-[#6b6b70]">{event.location} - {event.shortDate}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
