"use client";

import { useEffect, useRef, useState } from "react";
import { FiMapPin, FiNavigation } from "react-icons/fi";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("SSR environment");
    if (window.L) return resolve(window.L);

    // Load CSS if not loaded
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    // Load JS if not loaded
    const existingScript = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.L));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function EventMap({ lat = -1.2921, lng = 36.8219, venue = "", editable = false, onChange }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const numLat = Number(lat) || -1.2921;
  const numLng = Number(lng) || 36.8219;

  // Initialize Leaflet map
  useEffect(() => {
    let active = true;

    loadLeaflet()
      .then((L) => {
        if (!active || !mapContainerRef.current) return;

        // Create custom red pin icon
        const redIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `<div style="background-color:#f33959;width:24px;height:24px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.3);transform:translate(-50%,-50%);"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        // Initialize map instance if not existing
        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [numLat, numLng],
            zoom: 14,
            scrollWheelZoom: editable,
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);

          const marker = L.marker([numLat, numLng], {
            icon: redIcon,
            draggable: editable,
          }).addTo(map);

          if (venue) {
            marker.bindPopup(`<b>${venue}</b>`).openPopup();
          }

          if (editable && onChange) {
            // Click anywhere on map to reposition pin
            map.on("click", (e) => {
              const { lat: newLat, lng: newLng } = e.latlng;
              marker.setLatLng([newLat, newLng]);
              onChange({ lat: Number(newLat.toFixed(6)), lng: Number(newLng.toFixed(6)) });
            });

            // Drag marker to adjust location
            marker.on("dragend", () => {
              const position = marker.getLatLng();
              onChange({ lat: Number(position.lat.toFixed(6)), lng: Number(position.lng.toFixed(6)) });
            });
          }

          mapInstanceRef.current = map;
          markerRef.current = marker;
        } else {
          // Update center and marker position
          mapInstanceRef.current.setView([numLat, numLng], mapInstanceRef.current.getZoom());
          if (markerRef.current) {
            markerRef.current.setLatLng([numLat, numLng]);
            if (venue) {
              markerRef.current.bindPopup(`<b>${venue}</b>`);
            }
          }
        }

        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn("Leaflet map load error:", err);
      });

    return () => {
      active = false;
    };
  }, [numLat, numLng, editable, venue]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(6));
        const newLng = Number(pos.coords.longitude.toFixed(6));
        setIsGettingLocation(false);
        if (onChange) onChange({ lat: newLat, lng: newLng });
      },
      () => {
        setIsGettingLocation(false);
        alert("Unable to retrieve your location.");
      },
      { timeout: 10000 },
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${numLat},${numLng}`;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-[18px] border border-[#ececec] bg-[#f4f4f5]">
        <div ref={mapContainerRef} className="h-56 w-full z-0" />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f5] text-xs font-bold text-[#6b6b70]">
            Loading interactive map…
          </div>
        )}

        {editable && (
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isGettingLocation}
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0f0f10] shadow-sm transition hover:bg-white backdrop-blur-xs disabled:opacity-60"
          >
            <FiNavigation size={12} className={isGettingLocation ? "animate-spin" : ""} />
            {isGettingLocation ? "Locating…" : "Use my location"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6b6b70]">
        <div className="flex items-center gap-1.5 font-bold text-[#0f0f10]">
          <FiMapPin size={14} className="text-[#f33959]" />
          <span>Lat: {numLat.toFixed(5)} | Lng: {numLng.toFixed(5)}</span>
        </div>
        {editable ? (
          <span className="text-[11px] text-[#6b6b70]">💡 Click anywhere on the map or drag the pin to position</span>
        ) : (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#f33959] hover:underline"
          >
            Open in Google Maps ↗
          </a>
        )}
      </div>
    </div>
  );
}
