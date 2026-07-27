import Image from "next/image";
import Link from "next/link";

const choices = [
  {
    title: "Register as user",
    description: "Buy tickets faster, keep ticket history, and access your QR tickets anytime.",
    href: "/register",
    action: "Create user account",
  },
  {
    title: "Register as organizer",
    description: "Create events, manage ticket classes, track sales, and scan guests at the gate.",
    href: "/organizer/register",
    action: "Start selling events",
  },
];

export default function AuthChoicePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <Link href="/login" className="rounded-full border border-[#ececec] px-4 py-2 text-sm font-bold transition hover:bg-[#f4f4f5]">Login</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-[20px] bg-white p-6 text-center shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <p className="text-base font-bold text-[#f33959]">Choose account type</p>
          <h1 className="mt-2 text-5xl font-bold leading-tight">How do you want to use eTikket?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#6b6b70]">
            Pick user if you are buying tickets. Pick seller if you want to create and manage events.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {choices.map((choice) => (
            <Link key={choice.title} href={choice.href} className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)] transition hover:-translate-y-0.5 hover:border-[#fbd0d8] hover:shadow-[0_8px_24px_rgba(15,15,16,0.12)]">
              <h2 className="text-3xl font-bold">{choice.title}</h2>
              <p className="mt-3 text-base leading-7 text-[#6b6b70]">{choice.description}</p>
              <span className="mt-5 inline-flex rounded-full bg-[#f33959] px-5 py-3 text-base font-bold text-white">{choice.action}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
gistger 
