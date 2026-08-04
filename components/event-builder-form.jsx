"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiCheckCircle, FiUploadCloud, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { apiRequestAuth, apiUpload, AuthError, handleAuthError, BACKEND_URL } from "@/lib/api";
import { getClientSession } from "@/lib/client-auth";
import EventMap from "@/components/event-map";

const CATEGORIES = ["Music", "Holiday", "Nightlife", "Family", "Business", "Concert", "Sports", "Arts", "Food"];
const STATUSES = ["Draft", "Live", "Selling fast", "New", "VIP available", "Sold out"];

export default function EventBuilderForm({ eventToEdit, onSaved }) {
  const router = useRouter();
  const [title, setTitle] = useState(eventToEdit?.title || "");
  const [description, setDescription] = useState(eventToEdit?.description || "");
  const [category, setCategory] = useState(eventToEdit?.category || "Music");
  const [date, setDate] = useState(eventToEdit?.event_date ? eventToEdit.event_date.slice(0, 10) : "");
  const [time, setTime] = useState(eventToEdit?.event_time?.slice(0, 5) || "");
  const [location, setLocation] = useState(eventToEdit?.venue || "");
  const [host, setHost] = useState(eventToEdit?.host_name || "");
  const [price, setPrice] = useState(eventToEdit?.price_label || "From KSh 1,000");
  const [status, setStatus] = useState(eventToEdit?.status || "Draft");
  const [lat, setLat] = useState(eventToEdit?.latitude || -1.2921);
  const [lng, setLng] = useState(eventToEdit?.longitude || 36.8219);
  const [tickets, setTickets] = useState(
    [{ name: "General", description: "Standard entry", price: 1200, available: 200 }]
  );
  const [ticketsLoaded, setTicketsLoaded] = useState(!eventToEdit); // for edit mode, wait for fetch

  // When editing, load existing ticket types from the database
  useEffect(() => {
    if (!eventToEdit?.id) return;
    const session = getClientSession();
    if (!session?.token) return;
    apiRequestAuth(`/event-ticket-types/${eventToEdit.id}`, session.token)
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setTickets(rows.map((r) => ({
            name: r.name,
            description: r.description || "",
            price: Number(r.price) || 0,
            available: Number(r.available_quantity) || 0,
          })));
        }
      })
      .catch(() => { /* keep default */ })
      .finally(() => setTicketsLoaded(true));
  }, [eventToEdit?.id]);

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    eventToEdit?.cover_image_url
      ? `${BACKEND_URL}${eventToEdit.cover_image_url}`
      : eventToEdit?.cover_image_base64 || null,
  );
  const [savedImageUrl, setSavedImageUrl] = useState(eventToEdit?.cover_image_url || null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mode = eventToEdit ? "Update event" : "Create event";

  const previewTickets = useMemo(() => tickets.slice(0, 3), [tickets]);

  function handleTicketChange(index, field, value) {
    setTickets((cur) =>
      cur.map((t, i) =>
        i === index ? { ...t, [field]: field === "price" || field === "available" ? Number(value) : value } : t,
      ),
    );
  }

  function addTicket() {
    setTickets((cur) => [...cur, { name: "New class", description: "Ticket description", price: 1200, available: 100 }]);
  }

  function removeTicket(index) {
    setTickets((cur) => cur.filter((_, i) => i !== index));
  }

  function handleImagePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
    setSavedImageUrl(null); // reset saved URL, need to re-upload
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setSavedImageUrl(null);
  }

  async function saveEvent(e) {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      toast.error("Event title and venue are required.");
      return;
    }

    const session = getClientSession();
    if (!session?.token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setIsSaving(true);
    let coverImageUrl = savedImageUrl;
    let newlyUploadedUrl = null;

    // Upload image if a new file was chosen
    if (imageFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResult = await apiUpload("/uploads/event-image", session.token, formData);
        coverImageUrl = uploadResult.url;
        newlyUploadedUrl = uploadResult.url;
        setSavedImageUrl(coverImageUrl);
        toast.success("Image uploaded!");
      } catch (uploadErr) {
        toast.error(`Image upload failed: ${uploadErr.message}`);
        setUploading(false);
        setIsSaving(false);
        return;
      }
      setUploading(false);
    }

    const payload = {
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") + (eventToEdit ? "" : `-${Date.now()}`),
      description: description.trim(),
      category,
      event_date: date || null,
      event_time: time || null,
      venue: location.trim(),
      host_name: host.trim(),
      price_label: price.trim(),
      status,
      cover_image_url: coverImageUrl,
      latitude: lat,
      longitude: lng,
    };

    try {
      let eventId = eventToEdit?.id;
      if (eventToEdit) {
        await apiRequestAuth(`/events/${eventToEdit.id}`, session.token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Event updated!");
      } else {
        const created = await apiRequestAuth("/events", session.token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        eventId = created.id;
        toast.success("Event created!");
      }

      // Save ticket types (replace all)
      if (eventId && tickets.length > 0) {
        try {
          await apiRequestAuth(`/event-ticket-types/${eventId}`, session.token, {
            method: "PUT",
            body: JSON.stringify(tickets),
          });
        } catch (ticketErr) {
          if (ticketErr instanceof AuthError) { handleAuthError("organizer"); return; }
          toast.error(`Event saved but ticket types failed: ${ticketErr.message}`);
        }
      }

      if (onSaved) {
        onSaved();
      } else {
        router.push("/organizer/events");
      }
    } catch (err) {
      if (err instanceof AuthError) { handleAuthError("organizer"); return; }
      toast.error(err.message || "Failed to save event.");

      // If a new image file was uploaded but event creation/update failed, clean up the file on server
      if (newlyUploadedUrl) {
        try {
          await apiRequestAuth("/uploads/event-image", session.token, {
            method: "DELETE",
            body: JSON.stringify({ url: newlyUploadedUrl }),
          });
          setSavedImageUrl(eventToEdit?.cover_image_url || null);
        } catch {
          // ignore cleanup errors
        }
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.85fr]">
      <form className="space-y-6" onSubmit={saveEvent}>
        {/* Title + Category */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Event title *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="Enter event name"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>

        {/* Description */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition resize-none"
            placeholder="Describe your event..."
          />
        </label>

        {/* Date + Time */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition"
            />
          </label>
        </div>

        {/* Location + Host */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Venue *</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="KICC, Nairobi"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Host name</span>
            <input
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="Event organizer"
            />
          </label>
        </div>

        {/* Price + Status */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Price label</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
              placeholder="From KSh 1,200"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0f0f10]">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-12 w-full rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white transition"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>


        {/* Cover image upload */}
        <div className="rounded-[18px] border border-[#ececec] bg-[#fafafa] p-4">
          <p className="text-sm font-bold text-[#0f0f10]">Cover image</p>
          <p className="mt-1 text-xs text-[#6b6b70]">Upload a JPG or PNG. Max 10 MB. Saved to the backend server.</p>

          {imagePreview ? (
            <div className="relative mt-3">
              <img
                src={imagePreview}
                alt="Cover preview"
                className="h-44 w-full rounded-[14px] object-cover border border-[#ececec]"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white"
              >
                <FiX size={14} className="text-[#f33959]" />
              </button>
              {savedImageUrl && (
                <span className="absolute bottom-2 left-2 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold text-white">
                  ✓ Saved
                </span>
              )}
            </div>
          ) : (
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-[14px] border-2 border-dashed border-[#ececec] bg-white px-4 py-8 transition hover:border-[#f33959]">
              <FiUploadCloud size={28} className="text-[#6b6b70]" />
              <p className="mt-2 text-sm font-bold text-[#0f0f10]">Click to upload image</p>
              <p className="mt-1 text-xs text-[#6b6b70]">JPG, PNG, WebP up to 10 MB</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            </label>
          )}
        </div>

        {/* Interactive Map Pinning */}
        <div className="rounded-[18px] border border-[#ececec] bg-[#fafafa] p-4 space-y-4">
          <div>
            <span className="block text-sm font-bold text-[#0f0f10]">Venue map pin</span>
            <span className="text-xs text-[#6b6b70]">Click anywhere on the map or drag the red pin to set the exact venue location.</span>
          </div>

          <EventMap
            lat={lat}
            lng={lng}
            venue={location || "Venue location"}
            editable={true}
            onChange={({ lat: newLat, lng: newLng }) => {
              setLat(newLat);
              setLng(newLng);
            }}
          />

          <details className="text-xs text-[#6b6b70] cursor-pointer">
            <summary className="font-bold hover:text-[#0f0f10]">Manual coordinates adjustment</summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#0f0f10]">Latitude</span>
                <input
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  type="number"
                  step="0.00001"
                  className="h-10 w-full rounded-[12px] border border-[#ececec] bg-white px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#0f0f10]">Longitude</span>
                <input
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  type="number"
                  step="0.00001"
                  className="h-10 w-full rounded-[12px] border border-[#ececec] bg-white px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959]"
                />
              </label>
            </div>
          </details>
        </div>

        {/* Ticket classes */}
        <div className="rounded-[20px] border border-[#ececec] bg-[#fafafa] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#0f0f10]">Ticket classes</p>
              <p className="text-xs text-[#6b6b70]">Add and manage ticket tiers for this event.</p>
            </div>
            <button
              type="button"
              onClick={addTicket}
              className="inline-flex items-center gap-2 rounded-full bg-[#111113] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0f0f10]"
            >
              <FiPlus size={16} />
              Add class
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {tickets.map((ticket, index) => (
              <div key={index} className="rounded-[16px] border border-[#ececec] bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Name</span>
                    <input
                      value={ticket.name}
                      onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Price (KSh)</span>
                    <input
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                      type="number"
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Description</span>
                    <input
                      value={ticket.description}
                      onChange={(e) => handleTicketChange(index, "description", e.target.value)}
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0f0f10]">Available</span>
                    <input
                      value={ticket.available}
                      onChange={(e) => handleTicketChange(index, "available", e.target.value)}
                      type="number"
                      className="h-10 w-full rounded-[12px] border border-[#ececec] bg-[#fafafa] px-3 text-xs text-[#0f0f10] outline-none focus:border-[#f33959] focus:bg-white"
                    />
                  </label>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => removeTicket(index)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#f33959] px-3 py-1.5 text-xs font-bold text-[#f33959] transition hover:bg-[#f33959] hover:text-white"
                  >
                    <FiTrash2 size={12} />
                    Remove class
                  </button>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <FiCheckCircle size={12} />
                    Active tier
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving || uploading}
          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#f33959] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#d92847] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FiPlus size={18} />
          {uploading ? "Uploading image…" : isSaving ? "Saving…" : mode}
        </button>
      </form>

      {/* Preview sidebar */}
      <aside className="space-y-6">
        <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <p className="text-sm font-bold text-[#0f0f10]">Event preview</p>
          <div className="mt-3 overflow-hidden rounded-[16px] bg-[#f4f4f5] border border-[#ececec] relative aspect-video flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Event cover preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-[#6b6b70]">
                <FiUploadCloud size={24} className="mb-1 text-[#6b6b70]" />
                <span className="text-xs font-bold">No cover image uploaded</span>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2 text-sm text-[#6b6b70]">
            <p className="font-bold text-[#0f0f10] text-base">{title || "Event title"}</p>
            <p>{category} · {date} {time}</p>
            <p>{location || "Venue"}</p>
            <p>{host ? `Hosted by ${host}` : "Organizer name"}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#ececec]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70] mb-2">Venue Map Pin Preview</p>
            <EventMap
              lat={lat}
              lng={lng}
              venue={location || "Venue"}
              editable={false}
            />
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ececec] bg-white p-5">
          <p className="text-sm font-bold text-[#0f0f10]">Ticket summary</p>
          <div className="mt-3 space-y-3">
            {previewTickets.map((ticket, i) => (
              <div key={i} className="rounded-[14px] bg-[#f4f4f5] p-3 text-xs text-[#6b6b70]">
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
