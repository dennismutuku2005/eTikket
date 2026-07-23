"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getClientSession();

    router.replace(session ? getRoleHomePath(session.role) : "/login");
  }, [router]);

  return null;
}
