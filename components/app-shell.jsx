"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getClientSession } from "@/lib/client-auth";

const navItems = {
  Admin: [
    { label: "Overview", href: "/admin/home" },
    { label: "Organizer approvals", href: "/admin/home" },
    { label: "Platform settings", href: "/admin/home" },
  ],
  Organizer: [
    {
      label: "Overview",
      href: "/organizer/home",
    },
    {
      label: "Events",
      href: "/organizer/events",
      children: [
        { label: "All events", href: "/organizer/events" },
        { label: "Active events", href: "/organizer/events/active" },
        { label: "Sold out", href: "/organizer/events/soldout" },
        { label: "Create event", href: "/organizer/events/createnew" },
      ],
    },
    {
      label: "Payments",
      href: "/organizer/payments",
      children: [
        { label: "Payments overview", href: "/organizer/payments" },
        { label: "M-Pesa settings", href: "/organizer/payments/mpesa" },
      ],
    },
    {
      label: "Staff",
      href: "/organizer/staff",
      children: [{ label: "Staff overview", href: "/organizer/staff" }],
    },
    { label: "Attendees", href: "/organizer/atendeee" },
    { label: "Analytics", href: "/organizer/analytics" },
  ],
  User: [
    { label: "Dashboard", href: "/user/home" },
    { label: "Ticket payments", href: "/payment" },
    { label: "Browse events", href: "/events" },
  ],
};

export default function AppShell({ role, title, subtitle, children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const menu = navItems[role] ?? [];

  useEffect(() => {
    setSession(getClientSession());
  }, []);

  const avatarInitials = session?.name
    ? session.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
    : "EU";

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-[#ececec] bg-white shadow-sm transform transition duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex min-h-screen flex-col p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative h-10 w-28">
              <Image src="/eTikket.png" alt="eTikket logo" fill className="object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-[#ececec] bg-[#f4f4f5] px-3 py-1 text-xs font-bold text-[#0f0f10] transition hover:bg-[#ececec] md:hidden"
            >
              Close
            </button>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">{role} dashboard</p>
            <p className="mt-2 text-sm leading-6 text-[#6b6b70]">Quick access to the most important sections for your role.</p>
          </div>

          <nav className="mt-6 space-y-1">
            {menu.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <div key={item.href} className="space-y-1">
                  <Link
                    href={item.href}
                    className={`block rounded-full px-4 py-2.5 text-sm font-bold transition ${
                      isActive
                        ? "bg-[#f33959] text-white shadow-xs"
                        : "text-[#0f0f10] hover:bg-[#f4f4f5] hover:text-[#f33959]"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <div className="ml-4 space-y-1 border-l-2 border-[#ececec] pl-2">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block rounded-full px-4 py-2 text-xs font-bold transition ${
                              childActive
                                ? "bg-[#f4f4f5] text-[#f33959]"
                                : "text-[#6b6b70] hover:bg-[#f4f4f5] hover:text-[#0f0f10]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#ececec] pt-4 space-y-2">
            <Link
              href="/"
              className="block rounded-full px-4 py-2.5 text-sm font-bold text-[#6b6b70] transition hover:bg-[#f4f4f5] hover:text-[#0f0f10]"
            >
              Public home
            </Link>
            <Link
              href="/logout"
              className="block rounded-full px-4 py-2.5 text-sm font-bold text-[#6b6b70] transition hover:bg-[#f4f4f5] hover:text-[#f33959]"
            >
              Log out
            </Link>
          </div>
        </div>
      </aside>

      {menuOpen && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden" onClick={() => setMenuOpen(false)} />}

      <div className="ml-0 md:ml-72">
        <header className="sticky top-0 z-40 border-b border-[#ececec] bg-white/95 backdrop-blur px-4 py-3 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ececec] bg-white text-sm font-bold text-[#0f0f10] hover:bg-[#f4f4f5] md:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>

              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-[#0f0f10]">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-[#6b6b70] truncate max-w-md">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[#ececec] bg-white px-2 py-1.5 pr-4 shadow-xs">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111113] text-xs font-bold text-white">
                  {avatarInitials}
                </span>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-[#0f0f10]">{session?.name || "User"}</p>
                  <p className="text-xs text-[#6b6b70]">{session?.email || "guest@etikket.co.ke"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 block md:hidden">
            <h1 className="text-lg font-bold text-[#0f0f10]">{title}</h1>
            {subtitle && (
              <p className="text-xs text-[#6b6b70] truncate">{subtitle}</p>
            )}
          </div>
        </header>

        <div className="min-h-[calc(100vh-65px)] bg-[#fafafa] p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-none space-y-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}