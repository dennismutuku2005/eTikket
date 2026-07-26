import Image from "next/image";
import Link from "next/link";
import { getPublicEvent, publicEvents } from "@/lib/public-events";

export function generateStaticParams() {
  return publicEvents.map((event) => ({ slug: event.slug }));
}

export default async function CheckoutPage({ params }) {
  const { slug } = await params;
  const event = getPublicEvent(slug);
  const firstTicket = event.tickets[0];
  const isFreeEvent = event.tickets.some((ticket) => ticket.price === 0);

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <Link href={`/events/${event.slug}`} className="rounded-full border border-[#ececec] px-4 py-2 text-sm font-bold hover:bg-[#f4f4f5]">Back to event</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.78fr]">
        <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <p className="text-base font-bold text-[#f33959]">Checkout</p>
          <h1 className="mt-2 text-4xl font-bold">{isFreeEvent ? "Reserve your free ticket" : "Pay for your ticket"}</h1>
          <p className="mt-3 text-base leading-7 text-[#6b6b70]">
            {isFreeEvent ? "This event is free. Reserve your ticket and keep the QR code for entry." : "No account needed. Enter your details and continue with M-Pesa STK Push."}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-[14px] border border-[#ececec] bg-[#fafafa] p-4">
            <div>
              <p className="font-bold">Buying as guest</p>
              <p className="mt-1 text-sm leading-6 text-[#6b6b70]">Fast checkout, no account needed.</p>
            </div>
            <Link href="/login" className="shrink-0 text-sm font-bold text-[#f33959] hover:text-[#d92847]">Login instead</Link>
          </div>

          <form className="mt-5 grid gap-4">
            {["Full name", "Phone number for M-Pesa", "Email address optional"].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm font-bold text-[#6b6b70]">{label}</span>
                <input className="h-13 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-base outline-none focus:border-[#f33959] focus:bg-white" placeholder={label} />
              </label>
            ))}
            <label className="flex items-start gap-3 rounded-[14px] bg-[#fafafa] p-4 text-sm leading-6 text-[#6b6b70]">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-[#f33959]" />
              <span>
                By buying or reserving a ticket, you agree with our{" "}
                <Link href="/terms" className="font-bold text-[#f33959]">terms and services</Link>
                {" "}and{" "}
                <Link href="/privacy-policy" className="font-bold text-[#f33959]">privacy policy</Link>.
              </span>
            </label>
            <button type="button" className="mt-2 h-13 rounded-full bg-[#f33959] px-5 text-base font-bold text-white hover:bg-[#d92847]">
              {isFreeEvent ? "Reserve free ticket" : "Pay now with M-Pesa"}
            </button>
          </form>
        </div>

        <aside className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <div className="relative aspect-16/10 overflow-hidden rounded-[20px] bg-[#111113]">
            <Image src={event.image} alt="" fill sizes="420px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-b from-black/5 to-black/50" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">{event.title}</h2>
          <p className="mt-2 text-base leading-7 text-[#6b6b70]">{event.date} - {event.location}</p>
          <div className="mt-4 rounded-[14px] bg-[#f4f4f5] p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold">{firstTicket?.name ?? "Ticket"}</span>
              <span className="font-bold">{(firstTicket?.price ?? 0) === 0 ? "Free" : `KSh ${(firstTicket?.price ?? 0).toLocaleString()}`}</span>
            </div>
            <p className="mt-2 text-sm text-[#6b6b70]">Guest checkout keeps the ticket purchase quick and direct.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}