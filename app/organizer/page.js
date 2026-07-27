import AppShell from "@/components/app-shell";
import Image from "next/image";
import Link from "next/link";

const organizerStats = [
  ["Fast setup", "Create an event page in minutes."],
  ["M-Pesa ready", "Collect ticket payments from guests."],
  ["QR check-in", "Scan tickets at the gate."],
];

export default function OrganizerPage() {
  return (
    <AppShell
      role="Organizer"
      title="Organizer dashboard"
      subtitle="Manage events, payments, and staff from one workspace."
    >
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex rounded-full bg-[#fde8ec] px-4 py-2 text-sm font-semibold text-[#d92847]">
            Organizer view
          </div>
          <div className="space-y-3">
            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Sell tickets and manage your event from eTikket.
            </h1>
            <p className="max-w-lg text-base leading-7 text-[#6b6b70]">
              Add your event details, ticket types, M-Pesa collection, and gate check-in tools from one simple workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/organizer/home" className="rounded-full bg-[#f33959] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d92847]">
              Open organizer dashboard
            </Link>
            <Link href="/" className="rounded-full border border-[#ececec] bg-white px-5 py-3 text-sm font-semibold transition hover:bg-[#f4f4f5]">
              Browse events
            </Link>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ececec] bg-white p-4 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <div className="relative aspect-16/10 overflow-hidden rounded-[20px] bg-[#111113]">
            <Image
              src="/sideimage.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/60" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-semibold text-white/80">Tonight at 8:00 PM</p>
              <h2 className="mt-1 text-2xl font-bold">Nairobi Glow Festival</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {organizerStats.map(([title, description]) => (
                  <div key={title} className="rounded-[14px] bg-white/90 p-3 text-[#0f0f10]">
                    <p className="text-sm font-bold">{title}</p>
                    <p className="mt-1 text-xs leading-4 text-[#6b6b70]">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
