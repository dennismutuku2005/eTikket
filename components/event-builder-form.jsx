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
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Event title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="Enter event name"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition"
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
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Date</span>
            <input
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="Friday, 8 August"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Time</span>
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="8:00 PM"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Location</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="KICC, Nairobi"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Host</span>
            <input
              value={host}
              onChange={(event) => setHost(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="Event organizer"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Price label</span>
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="From KSh 1,200"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition"
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
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Remaining tickets</span>
            <input
              value={remainingTickets}
              onChange={(event) => setRemainingTickets(Number(event.target.value))}
              type="number"
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="560"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Cover image URL</span>
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="/sideimage.png or image URL"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Latitude</span>
            <input
              value={lat}
              onChange={(event) => setLat(Number(event.target.value))}
              type="number"
              step="0.00001"
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="-1.2921"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Longitude</span>
            <input
              value={lng}
              onChange={(event) => setLng(Number(event.target.value))}
              type="number"
              step="0.00001"
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="36.8219"
            />
          </label>
        </div>

        <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-[#0f0f10]">Ticket classes</p>
            <button
              type="button"
              onClick={addTicket}
              className="rounded-full bg-[#111113] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0f0f10]"
            >
              Add class
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {tickets.map((ticket, index) => (
              <div key={`${ticket.name}-${index}`} className="rounded-[16px] border border-[#ececec] bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Name</span>
                    <input
                      value={ticket.name}
                      onChange={(event) => handleTicketChange(index, "name", event.target.value)}
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Price (KSh)</span>
                    <input
                      value={ticket.price}
                      onChange={(event) => handleTicketChange(index, "price", event.target.value)}
                      type="number"
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Description</span>
                    <input
                      value={ticket.description}
                      onChange={(event) => handleTicketChange(index, "description", event.target.value)}
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Available quantity</span>
                    <input
                      value={ticket.available}
                      onChange={(event) => handleTicketChange(index, "available", event.target.value)}
                      type="number"
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeTicket(index)}
                  className="mt-3 text-xs font-bold text-[#f33959] transition hover:underline"
                >
                  Remove class
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-[#f33959] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#d92847]"
        >
          {mode}
        </button>

        {message ? <p className="rounded-[14px] bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p> : null}
      </form>

      <aside className="space-y-6">
        <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <p className="text-sm font-bold text-[#0f0f10]">Event preview</p>
          <div className="mt-3 overflow-hidden rounded-[16px] bg-[#111113] relative aspect-16/10">
            <img src={imageUrl} alt="Event cover" className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-[#6b6b70]">
            <p className="font-bold text-[#0f0f10] text-base">{title || "Event title"}</p>
            <p>{category} · {date} · {time}</p>
            <p>{location}</p>
            <p>{host ? `Hosted by ${host}` : "Organizer name"}</p>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <p className="text-sm font-bold text-[#0f0f10]">Location pin</p>
          <div className="mt-3 rounded-[16px] border border-[#ececec] bg-[#fafafa] p-4 text-sm text-[#6b6b70]">
            <p className="font-bold text-[#0f0f10]">Coordinates</p>
            <p className="mt-1 text-xs">Lat: {lat} | Lng: {lng}</p>
            <div className="mt-3 rounded-[12px] bg-white p-3 border border-[#ececec]">
              <p className="font-bold text-[#0f0f10] text-xs">Map preview</p>
              <p className="mt-1 text-xs text-[#6b6b70]">Pin location will display on the public event page.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <p className="text-sm font-bold text-[#0f0f10]">Ticket summary</p>
          <div className="mt-3 space-y-3">
            {previewTickets.map((ticket) => (
              <div key={ticket.name} className="rounded-[14px] bg-[#f4f4f5] p-3 text-xs text-[#6b6b70]">
                <p className="font-bold text-[#0f0f10] text-sm">{ticket.name}</p>
                <p className="mt-0.5">{ticket.description}</p>
                <p className="mt-2 font-bold text-[#f33959]">KSh {ticket.price.toLocaleString()} · {ticket.available} available</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
