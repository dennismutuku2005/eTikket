import Image from "next/image";
import Link from "next/link";
export default function RegisterPage() {
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

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 text-center shadow-[0_2px_8px_rgba(15,15,16,0.06)] sm:p-10">
          <div className="inline-flex rounded-full bg-[#fde8ec] px-4 py-2 text-sm font-semibold text-[#d92847]">
            No account needed to buy tickets
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Registration is for organizers only.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#6b6b70]">
            Ticket buyers can checkout as guests — no sign-up required. If you want to create and sell events, sign in to the organizer dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/organizer/login" className="rounded-full bg-[#f33959] px-6 py-3 text-base font-bold text-white hover:bg-[#d92847]">
              Organizer login
            </Link>
            <Link href="/events" className="rounded-full border border-[#ececec] px-6 py-3 text-base font-bold hover:bg-[#f4f4f5]">
              Browse events
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            ["Guest checkout", "Pick tickets and pay with M-Pesa. No account needed."],
            ["QR ticket entry", "Get your QR code instantly after payment."],
            ["Organizer dashboard", "Sign in to create events and track sales."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[20px] border border-[#ececec] bg-white p-5">
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6b6b70]">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

