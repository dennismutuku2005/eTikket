import Link from "next/link";

const faqs = [
  {
    q: "How do I start selling events?",
    a: "Go to the organizer dashboard and sign in with your organizer account. From there you can create events, set ticket classes, configure M-Pesa payments, and manage gate check-in.",
  },
  {
    q: "Do I need to register to sell tickets?",
    a: "Yes. Organizers need an account to access the dashboard, create events, and receive payouts. Ticket buyers do not need any account — they check out as guests.",
  },
  {
    q: "How do I create an event?",
    a: "From the organizer dashboard, navigate to Create new event. Add the event title, description, category, date, time, location, and cover image. Then set up your ticket classes with names, prices, and quantity limits.",
  },
  {
    q: "What ticket classes can I offer?",
    a: "You can create any ticket class — Advance, Normal, VIP, Family, or custom names. Each class has its own price and maximum quantity. You decide how many tickets are available for each class.",
  },
  {
    q: "How do I receive payments?",
    a: "Configure your M-Pesa integration in the organizer settings. When guests buy tickets, payments go through M-Pesa STK Push. Payouts are processed based on your configured settlement schedule.",
  },
  {
    q: "How does QR check-in work?",
    a: "Every ticket purchase generates a unique QR code. Create gate admin accounts from the staff section and assign them to events. Gate admins scan QR codes at the venue using a smartphone or tablet to validate entry.",
  },
  {
    q: "Can I track ticket sales in real time?",
    a: "Yes. The organizer dashboard shows active events, remaining tickets, revenue, and check-in stats. You can monitor sales per event and see who has checked in.",
  },
  {
    q: "How do I add gate admins?",
    a: "Go to Staff in the organizer dashboard. Create gate admin accounts by providing their name and phone number. Assign them to specific events so they can scan tickets at the gate.",
  },
  {
    q: "What happens if an event sells out?",
    a: "When all tickets for a class are sold, that class shows as sold out. You can add more capacity by editing the event, or create a waitlist if needed.",
  },
];

export default function SellingEventsHelpPage() {
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
          <p className="text-base font-bold text-[#f33959]">Selling events</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">List your event on eTikket.</h1>
          <p className="mt-4 text-lg leading-8 text-[#6b6b70]">
            Use the organizer dashboard to create events, set ticket classes, configure M-Pesa payments, and manage gate check-in. Buyers see the public event page and check out as guests.
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
            <Link href="/organizer/login" className="rounded-full bg-[#f33959] px-5 py-3 text-sm font-bold text-white hover:bg-[#d92847]">
              Open organizer dashboard
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
