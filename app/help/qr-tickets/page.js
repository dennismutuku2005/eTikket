import Link from "next/link";

const faqs = [
  {
    q: "What is a QR ticket?",
    a: "A QR ticket is a unique QR code generated for each ticket purchase. It contains your ticket information and is scanned at the venue gate for entry. It is your digital proof of purchase.",
  },
  {
    q: "How do I get my QR ticket?",
    a: "After a successful payment, your QR ticket is displayed on the confirmation page. You can save it to your phone or take a screenshot to show at the gate.",
  },
  {
    q: "Can I use a screenshot of my QR ticket?",
    a: "Yes. A screenshot of your QR code works perfectly at the gate. Just make sure the image is clear and not damaged so the scanner can read it.",
  },
  {
    q: "What if I lose my QR ticket?",
    a: "If you lose access to your QR code, contact the event organizer. They can verify your purchase and help you get a replacement QR code.",
  },
  {
    q: "How is my QR ticket scanned at the gate?",
    a: "The gate admin uses a smartphone or tablet with the eTikket scanner tool. They scan your QR code, it validates the ticket, and you are let in. The scan is recorded instantly.",
  },
  {
    q: "Can someone else use my QR ticket?",
    a: "QR tickets are linked to the name and phone number used at checkout. The organizer may check ID at the gate. If you are transferring a ticket, contact the organizer.",
  },
  {
    q: "What happens if my QR code does not scan?",
    a: "If the QR code does not scan, the gate admin can manually verify your ticket using the name and phone number from your purchase. Make sure your screen brightness is high and the code is not damaged.",
  },
];

export default function QRTicketsHelpPage() {
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
          <p className="text-base font-bold text-[#f33959]">QR tickets & entry</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">Your QR code is your ticket.</h1>
          <p className="mt-4 text-lg leading-8 text-[#6b6b70]">
            After paying, your QR ticket is ready for the gate. Show it at entry and get scanned in seconds.
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
