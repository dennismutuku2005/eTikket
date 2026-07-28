import Link from "next/link";

const faqs = [
  {
    q: "What can I do from the organizer dashboard?",
    a: "The organizer dashboard gives you an overview of your events, ticket sales, revenue, and check-in stats. From here you can create events, manage ticket classes, configure M-Pesa, add gate admins, and track attendees.",
  },
  {
    q: "How do I view my events?",
    a: "Navigate to Events from the dashboard sidebar. You will see all your events — live, draft, and sold out. Click any event to edit details or view ticket stock.",
  },
  {
    q: "How do I track ticket sales?",
    a: "The dashboard home shows key numbers: active events, tickets remaining, gate admins, and QR scans today. The Payments section shows gross sales, transactions, and pending payouts.",
  },
  {
    q: "How do I create a new event?",
    a: "Go to Create new event from the dashboard. Fill in the event name, description, category, date, time, location, and upload a cover image. Then add your ticket classes with prices and quantities.",
  },
  {
    q: "Can I edit an event after publishing?",
    a: "Yes. You can edit event details, update ticket quantities, or change prices from the event management section. Changes reflect on the public event page immediately.",
  },
  {
    q: "How do I see who bought tickets?",
    a: "The Attendees section shows all ticket buyers, their names, phone numbers, and check-in status. You can see who has checked in and who is still pending at the gate.",
  },
  {
    q: "What is the difference between active and sold out events?",
    a: "Active events still have tickets available for purchase. Sold out events have reached zero available tickets. You can increase capacity or add more ticket classes to a sold out event.",
  },
  {
    q: "Can I have multiple organizers?",
    a: "Each organizer account is separate. If you need team members to help manage events, create gate admin accounts from the Staff section and assign them scanner access.",
  },
];

export default function OrganizerDashboardHelpPage() {
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
          <p className="text-base font-bold text-[#f33959]">Organizer dashboard</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">Manage everything from one place.</h1>
          <p className="mt-4 text-lg leading-8 text-[#6b6b70]">
            Create events, track sales, manage gate admins, and configure M-Pesa from the organizer dashboard.
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
