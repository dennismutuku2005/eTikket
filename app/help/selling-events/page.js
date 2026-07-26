import Link from "next/link";

export default function SellingEventsHelpPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-8 text-[#0f0f10] sm:px-6">
      <section className="mx-auto max-w-3xl rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
        <p className="text-base font-bold text-[#f33959]">Selling events</p>
        <h1 className="mt-2 text-4xl font-bold">List your event on eTikket.</h1>
        <div className="mt-5 grid gap-3 text-base leading-7 text-[#6b6b70]">
          <p>Use the organizer view to prepare an event, ticket classes, pricing, and gate check-in flow.</p>
          <p>Buyers see the public event page first and only enter checkout when ready to pay.</p>
          <p>Organizer dashboards stay separate from the public website.</p>
        </div>
        <Link href="/organizer" className="mt-6 inline-flex rounded-full bg-[#f33959] px-5 py-3 font-bold text-white">Open organizer view</Link>
      </section>
    </main>
  );
}
