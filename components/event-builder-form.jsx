"use client";

import { useMemo, useState } from "react";

export default function EventBuilderForm({ eventToEdit }) {
  const [title, setTitle] = useState(eventToEdit?.title || "");
  const [category, setCategory] = useState(eventToEdit?.category || "Music");
  const [date, setDate] = useState(eventToEdit?.date || "");
  const [time, setTime] = useState(eventToEdit?.time || "");
  const [location, setLocation] = useState(eventToEdit?.location || "");
  const [host, setHost] = useState(eventToEdit?.host || "");
  const [price, setPrice] = useState(eventToEdit?.price || "From KSh 1,000");
  const [status, setStatus] = useState(eventToEdit?.status || "Draft");
  const [remainingTickets, setRemainingTickets] = useState(eventToEdit?.remainingTickets || 200);
  const [imageUrl, setImageUrl] = useState(eventToEdit?.image || "/sideimage.png");
  const [lat, setLat] = useState(eventToEdit?.mapCoordinates?.lat || -1.2921);
  const [lng, setLng] = useState(eventToEdit?.mapCoordinates?.lng || 36.8219);
  const [tickets, setTickets] = useState(
    eventToEdit?.tickets || [
      { name: "General", description: "Standard entry", price: 1200, available: 200 },
    ],
  );
  const [message, setMessage] = useState("");

  const mode = eventToEdit ? "Update event" : "Create event";

  const previewTickets = useMemo(
    () => tickets.slice(0, 3),
    [tickets],
  );

  function handleTicketChange(index, field, value) {
    setTickets((current) =>
      current.map((ticket, ticketIndex) =>
        ticketIndex === index ? { ...ticket, [field]: field === "price" || field === "available" ? Number(value) : value } : ticket,
      ),
    );
  }

  function addTicket() {
    setTickets((current) => [...current, { name: "New class", description: "Ticket description", price: 1200, available: 100 }]);
  }

  function removeTicket(index) {
    setTickets((current) => current.filter((_, ticketIndex) => ticketIndex !== index));
  }

  function saveEvent(event) {
    event.preventDefault();
    setMessage(`${mode} saved in this demo view. Refresh to reset.`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.85fr]">
      <form className="space-y-6" onSubmit={saveEvent}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Event title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="Enter event name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
            >
              <option>Music</option>
              <option>Holiday</option>
              <option>Nightlife</option>
              <option>Family</option>
              <option>Business</option>
              <option>Concert</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Date</span>
            <input
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="Friday, 8 August"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Time</span>
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="8:00 PM"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Location</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="KICC, Nairobi"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Host</span>
            <input
              value={host}
              onChange={(event) => setHost(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="Event organizer"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Price label</span>
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="From KSh 1,200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
            >
              <option>Draft</option>
              <option>Live</option>
              <option>Selling fast</option>
              <option>New</option>
              <option>VIP available</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Remaining tickets</span>
            <input
              value={remainingTickets}
              onChange={(event) => setRemainingTickets(Number(event.target.value))}
              type="number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="560"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Cover image URL</span>
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="/sideimage.png or image URL"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Latitude</span>
            <input
              value={lat}
              onChange={(event) => setLat(Number(event.target.value))}
              type="number"
              step="0.00001"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="-1.2921"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Longitude</span>
            <input
              value={lng}
              onChange={(event) => setLng(Number(event.target.value))}
              type="number"
              step="0.00001"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
              placeholder="36.8219"
            />
          </label>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Ticket classes</p>
            <button
              type="button"
              onClick={addTicket}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add class
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {tickets.map((ticket, index) => (
              <div key={`${ticket.name}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
                    <input
                      value={ticket.name}
                      onChange={(event) => handleTicketChange(index, "name", event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Price</span>
                    <input
                      value={ticket.price}
                      onChange={(event) => handleTicketChange(index, "price", event.target.value)}
                      type="number"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
                    <input
                      value={ticket.description}
                      onChange={(event) => handleTicketChange(index, "description", event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Available</span>
                    <input
                      value={ticket.available}
                      onChange={(event) => handleTicketChange(index, "available", event.target.value)}
                      type="number"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeTicket(index)}
                  className="mt-4 text-sm font-semibold text-rose-600 transition hover:text-rose-800"
                >
                  Remove ticket class
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
        >
          {mode}
        </button>

        {message ? <p className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      </form>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Event preview</p>
          <div className="mt-4 overflow-hidden rounded-3xl bg-slate-100">
            <div className="h-60 w-full overflow-hidden bg-slate-200">
              <img src={imageUrl} alt="Event cover" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{title || "Event title"}</p>
            <p>{category} · {date} · {time}</p>
            <p>{location}</p>
            <p>{host ? `Hosted by ${host}` : "Organizer name"}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Google Maps pin</p>
          <div className="mt-4 rounded-3xl bg-white p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Coordinates</p>
            <p className="mt-2">Latitude {lat}</p>
            <p>Longitude {lng}</p>
            <div className="mt-4 h-40 rounded-3xl bg-slate-950/5 p-4">
              <p className="font-semibold text-slate-900">Map preview</p>
              <p className="mt-2 text-sm text-slate-500">This preview shows the event pin location when you publish your event.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Ticket summary</p>
          <div className="mt-4 space-y-3">
            {previewTickets.map((ticket) => (
              <div key={ticket.name} className="rounded-3xl bg-slate-100 p-4 text-sm">
                <p className="font-semibold text-slate-900">{ticket.name}</p>
                <p>{ticket.description}</p>
                <p className="mt-2 text-slate-500">KSh {ticket.price} · {ticket.available} available</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
