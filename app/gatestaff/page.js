"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GateStaffRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/gatestaff/login");
  }, [router]);

  return null;
}
