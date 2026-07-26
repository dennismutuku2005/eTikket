import Link from "next/link";

export default function BuyingTicketsHelpPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-8 text-[#0f0f10] sm:px-6">
      <section className="mx-auto max-w-3xl rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
        <p className="text-base font-bold text-[#f33959]">Buying tickets</p>
        <h1 className="mt-2 text-4xl font-bold">Buy without logging in.</h1>
        <div className="mt-5 grid gap-3 text-base leading-7 text-[#6b6b70]">
          <p>Open an event page, choose Advance, Normal, VIP, or the available event ticket class.</p>
          <p>Press Pay now, enter guest details, and continue with M-Pesa checkout.</p>
          <p>Your QR ticket is the entry pass for check-in at the venue.</p>
        </div>
        <Link href="/events" className="mt-6 inline-flex rounded-full bg-[#f33959] px-5 py-3 font-bold text-white">Find events</Link>
      </section>
    </main>
  );
}
