import Image from "next/image";
import Link from "next/link";

export default function AuthChoicePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <Link href="/events" className="rounded-full bg-[#f33959] px-4 py-2 text-sm font-bold text-white">Browse events</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 text-center shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <p className="text-base font-bold text-[#f33959]">No account needed to buy tickets</p>
          <h1 className="mt-2 text-5xl font-bold leading-tight">Guest checkout is always available.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#6b6b70]">
            You can buy tickets instantly without signing up. Registration is only for organizers who want to create and manage events.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Link href="/events" className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition hover:-translate-y-0.5 hover:border-[#fbd0d8] hover:shadow-[0_8px_24px_rgba(15,15,16,0.12)]">
            <h2 className="text-3xl font-bold">Browse events</h2>
            <p className="mt-3 text-base leading-7 text-[#6b6b70]">Find events, pick tickets, and pay with M-Pesa. No registration needed.</p>
            <span className="mt-5 inline-flex rounded-full bg-[#f33959] px-5 py-3 text-base font-bold text-white">Browse events</span>
          </Link>
          <Link href="/organizer/login" className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition hover:-translate-y-0.5 hover:border-[#fbd0d8] hover:shadow-[0_8px_24px_rgba(15,15,16,0.12)]">
            <h2 className="text-3xl font-bold">Organizer dashboard</h2>
            <p className="mt-3 text-base leading-7 text-[#6b6b70]">Create events, manage ticket classes, track sales, and scan guests at the gate.</p>
            <span className="mt-5 inline-flex rounded-full bg-[#f33959] px-5 py-3 text-base font-bold text-white">Organizer login</span>
          </Link>
        </div>
      </section>
    </main>
  );
} 

