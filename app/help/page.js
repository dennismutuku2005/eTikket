import Image from "next/image";
import Link from "next/link";

const helpCards = [
  ["Buying tickets", "Choose an event, select a ticket class, and pay as a guest.", "/help/buying-tickets"],
  ["Selling events", "Create an organizer workspace and start listing events.", "/help/selling-events"],
  ["Payments", "M-Pesa checkout keeps the public buying flow quick and familiar.", "/checkout/nairobi-glow-festival"],
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <Link href="/events" className="rounded-full bg-[#f33959] px-4 py-2 text-sm font-bold text-white">Browse events</Link>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <p className="text-base font-bold text-[#f33959]">Help center</p>
          <h1 className="mt-2 text-5xl font-bold leading-tight">How can we help?</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6b6b70]">Quick support pages for ticket buyers and event organizers.</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {helpCards.map(([title, description, href]) => (
            <Link key={title} href={href} className="rounded-[20px] border border-[#ececec] bg-white p-5 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition hover:-translate-y-0.5">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-3 text-base leading-7 text-[#6b6b70]">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
