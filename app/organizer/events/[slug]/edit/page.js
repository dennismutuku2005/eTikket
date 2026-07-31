import EventBuilderForm from "@/components/event-builder-form";
import AppShell from "@/components/app-shell";
import { publicEvents } from "@/lib/public-events";

export function generateStaticParams() {
  return publicEvents.map((event) => ({ slug: event.slug }));
}

export default function OrganizerEventEditPage({ params }) {
  const event = publicEvents.find((item) => item.slug === params.slug) || publicEvents[0];

  return (
    <AppShell
      role="Organizer"
      title={`Edit ${event.title}`}
      subtitle="Update event details, ticket pricing, and venue information."
    >
      <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
        <EventBuilderForm eventToEdit={event} />
      </div>
    </AppShell>
  );
}
