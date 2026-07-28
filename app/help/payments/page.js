import Link from "next/link";

const faqs = [
  {
    q: "What payment methods are accepted?",
    a: "eTikket uses M-Pesa STK Push for ticket payments. When you proceed to checkout, an M-Pesa payment request is sent to your phone. Enter your M-Pesa PIN to complete the purchase.",
  },
  {
    q: "How does M-Pesa STK Push work?",
    a: "After you enter your details in checkout, a payment request pops up on your M-Pesa registered phone. Enter your PIN to authorize the payment. The transaction completes instantly and you receive your QR ticket.",
  },
  {
    q: "What if the STK Push does not appear on my phone?",
    a: "Make sure your phone is on and has network coverage. Check that you entered the correct M-Pesa registered phone number. If the request still does not come, try checking out again or contact support.",
  },
  {
    q: "Is there a minimum or maximum payment amount?",
    a: "M-Pesa has standard transaction limits. Ticket prices are set by organizers, and as long as the amount falls within M-Pesa limits, the payment will process normally.",
  },
  {
    q: "Can I pay with cash or card?",
    a: "Currently, eTikket only supports M-Pesa payments. This keeps the checkout flow simple and quick for everyone.",
  },
  {
    q: "Do free tickets require payment details?",
    a: "No. Free tickets (KSh 0) do not require any payment. Just enter your name and phone number to reserve your ticket, and you will receive a QR code for entry.",
  },
  {
    q: "What happens if a payment fails?",
    a: "If the M-Pesa payment fails, your ticket is not issued. You can try again by going back to the event page and proceeding through checkout again. Make sure you have sufficient M-Pesa balance.",
  },
  {
    q: "How do organizers receive their payouts?",
    a: "Organizers configure their M-Pesa payout settings in the organizer dashboard. Payouts are processed according to the platform's settlement schedule.",
  },
];

export default function PaymentsHelpPage() {
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
          <p className="text-base font-bold text-[#f33959]">Payments & M-Pesa</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">Pay with M-Pesa.</h1>
          <p className="mt-4 text-lg leading-8 text-[#6b6b70]">
            M-Pesa STK Push makes checkout fast. Enter your number, approve the payment on your phone, and get your QR ticket instantly.
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
