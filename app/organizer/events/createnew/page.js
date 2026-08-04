"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import EventBuilderForm from "@/components/event-builder-form";
import { getRoleHomePath } from "@/lib/auth";
import { getClientSession } from "@/lib/client-auth";

export default function CreateNewEventPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const clientSession = getClientSession();

    if (!clientSession) {
      router.replace("/login");
      return;
    }

    if (clientSession.role !== "organizer") {
      router.replace(getRoleHomePath(clientSession.role));
      return;
    }

    setSession(clientSession);
  }, [router]);

  if (!session) {
    return null;
  }

  return (
    <AppShell
      role="Organizer"
      title="Create new event"
      subtitle="Start a new event, set ticket limits, and publish it once it is ready."
    >
      <div className="card-lg">
        <EventBuilderForm />
      </div>
    </AppShell>
  );
}
