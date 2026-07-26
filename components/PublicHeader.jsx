// components/PublicHeader.jsx
import Image from "next/image";
import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#ececec] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <nav className="flex items-center gap-5">
          <Link href="/" aria-label="eTikket home">
            <Image src="/eTikket.png" alt="eTikket" width={118} height={36} priority className="h-9 w-auto object-contain" />
          </Link>
          <div className="hidden items-center gap-1 rounded-full bg-[#f4f4f5] p-1 text-sm font-semibold text-[#6b6b70] sm:flex">
            <Link href="/events" className="rounded-full bg-white px-4 py-2 text-[#0f0f10] shadow-[0_2px_8px_rgba(15,15,16,0.06)]">Events</Link>
            <Link href="/holiday" className="rounded-full px-4 py-2 text-[#6b6b70] hover:text-[#0f0f10]">Holidays</Link>
          </div>
        </nav>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link href="/help" className="hidden rounded-full px-3 py-2 text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10] sm:inline-flex">Help</Link>
          <Link href="/login" className="rounded-full border border-[#ececec] px-4 py-2 hover:bg-[#f4f4f5]">Login</Link>
          <Link
            href="/organizer"
            className="rounded-full bg-[#f33959] px-4 py-2 text-white hover:bg-[#d92847]"
          >
            <span className="hidden sm:inline">Sell your events</span>
            <span className="sm:hidden">Sell events</span>
          </Link>
        </div>
      </div>
    </header>
  );
}