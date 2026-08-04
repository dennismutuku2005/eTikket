"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = "etikket-session=; path=/; max-age=0; samesite=lax";
    router.replace("/organizer/login");
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <p className="text-sm uppercase text-slate-400">
        Logging out...
      </p>
    </main>
  );
}