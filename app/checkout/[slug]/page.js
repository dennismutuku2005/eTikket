import Image from "next/image";
import Link from "next/link";
import CheckoutForm from "@/components/checkout-form";
import { getPublicEvent, getPublicEvents } from "@/lib/public-events";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getPublicEvents().map((event) => ({ slug: event.slug }));
}

export default async function CheckoutPage({ params }) {
  const { slug } = await params;
  const event = getPublicEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <Link href={`/events/${event.slug}`} className="rounded-full border border-[#ececec] px-4 py-2 text-sm font-bold hover:bg-[#f4f4f5]">
            Back to event
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.78fr]">
        <CheckoutForm event={event} />

        <aside className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <div className="relative aspect-16/10 overflow-hidden rounded-[20px] bg-[#111113]">
            <Image src={event.image} alt={event.title} fill sizes="420px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-b from-black/5 to-black/50" />
          </div>

          <h2 className="mt-4 text-2xl font-bold">{event.title}</h2>
          <p className="mt-2 text-base leading-7 text-[#6b6b70]">{event.date} · {event.location}</p>

          <div className="mt-4 rounded-[14px] bg-[#f4f4f5] p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold">{event.tickets?.[0]?.name ?? "Ticket"}</span>
              <span className="font-bold text-[#f33959]">{event.tickets?.[0]?.price === 0 ? "Free" : `KSh ${event.tickets?.[0]?.price.toLocaleString()}`}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-[#6b6b70]">
              <span>Quantity: 1</span>
              {event.remainingTickets !== undefined && <span>{event.remainingTickets} remaining</span>}
            </div>
            <p className="mt-3 text-sm text-[#6b6b70] border-t border-[#e2e2e4] pt-3">
              Confirmed email and phone details are required to receive your ticket QR code.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#ececec] pt-4">
            <span className="font-bold">Total</span>
            <span className="text-xl font-bold text-[#f33959]">{event.tickets?.[0]?.price === 0 ? "Free" : `KSh ${event.tickets?.[0]?.price.toLocaleString()}`}</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
