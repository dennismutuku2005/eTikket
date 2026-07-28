import Link from "next/link";

const faqs = [
  {
    q: "Do I need an account to buy tickets?",
    a: "No. Ticket buyers can check out as guests without creating an account. Just pick your tickets, enter your details, and pay with M-Pesa.",
  },
  {
    q: "Who needs an account?",
    a: "Only event organizers and administrators need accounts. Organizer accounts provide access to the dashboard where you can create events, manage tickets, and track sales.",
  },
  {
    q: "How do I sign in as an organizer?",
    a: "Go to the organizer login page and enter your email or phone number and password. After signing in, you will be redirected to your organizer dashboard.",
  },
  {
    q: "I forgot my password. What can I do?",
    a: "This is a demo system. Contact the platform administrator to reset your password or use the demo credentials provided on the login page.",
  },
  {
    q: "How do I log out?",
    a: "From the organizer dashboard, click the Log out button in the header. You will be signed out and redirected to the login page.",
  },
  {
    q: "My session expired. What happened?",
    a: "Sessions last for 7 days. If you close your browser or your session expires, you will need to sign in again. Your data and events are preserved.",
  },
];

export default function AccountHelpPage() {
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
          <p className="text-base font-bold text-[#f33959]">Account & login</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">Accounts are for organizers.</h1>
          <p className="mt-4 text-lg leading-8 text-[#6b6b70]">
            Ticket buyers do not need an account. Only organizers and administrators sign in to manage events.
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
              Organizer login
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
