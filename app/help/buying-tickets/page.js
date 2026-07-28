import Link from "next/link";

const faqs = [
  {
    q: "Do I need an account to buy tickets?",
    a: "No. You can buy tickets as a guest. Just pick an event, choose your ticket class, enter your details, and pay with M-Pesa. No registration required.",
  },
  {
    q: "How do I find events?",
    a: "Browse the events page to see all upcoming events. You can filter by category — Music, Holiday, Nightlife, Family, Business, and more. Each event shows the date, time, location, and available ticket classes.",
  },
  {
    q: "What ticket classes are available?",
    a: "Events offer different ticket classes such as Advance, Normal, VIP, or Family. Each class has its own price and availability. Select the quantity you want for each class and proceed to checkout.",
  },
  {
    q: "Can I buy multiple tickets at once?",
    a: "Yes. On the event page, use the + and - buttons to select how many tickets you want for each class. The total updates automatically before you proceed to payment.",
  },
  {
    q: "What happens after I pay?",
    a: "After a successful M-Pesa payment, you will receive a QR ticket via the confirmation page. This QR code is your entry pass — show it at the gate for scanning.",
  },
  {
    q: "Can I get a refund?",
    a: "Refunds are managed by the event organizer, not by eTikket. Contact the organizer directly if you need to cancel or get a refund for a ticket purchase.",
  },
  {
    q: "What if the event is sold out?",
    a: "Sold-out events show zero remaining tickets and you cannot purchase them. Browse other available events for classes that still have tickets.",
  },
  {
    q: "How do I contact the event organizer?",
    a: "Event pages show the host name. For questions about seating, timing, or refunds, reach out to the organizer directly — they handle all event logistics.",
  },
];

export default function BuyingTicketsHelpPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <span className="text-xl font-bold tracking-tight">eTikket</span>
          </Link>
          <Link href="/help" className="text-sm font-semibold text-[#6b6b70] hover:text-[#0f0f10]">
            ← Back to help center
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)] sm:p-8">
          <p className="text-base font-bold text-[#f33959]">Buying tickets</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">Buy without logging in.</h1>
          <p className="mt-4 text-lg leading-8 text-[#6b6b70]">
            Open an event page, choose a ticket class, enter your details, and pay with M-Pesa. Your QR ticket is the entry pass for check-in at the venue.
          </p>

          <div className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[14px] border border-[#ececec] bg-[#fafafa] p-5">
                <h2 className="text-lg font-bold leading-snug text-[#0f0f10]">{faq.q}</h2>
                <p className="mt-3 text-base leading-7 text-[#6b6b70]">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/events" className="rounded-full bg-[#f33959] px-5 py-3 text-sm font-bold text-white hover:bg-[#d92847]">
              Browse events
            </Link>
            <Link href="/help" className="rounded-full border border-[#ececec] px-5 py-3 text-sm font-bold hover:bg-[#f4f4f5]">
              Help center
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
