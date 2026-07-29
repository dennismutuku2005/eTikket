"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiCamera, FiCheckCircle, FiCode, FiLogOut, FiUsers } from "react-icons/fi";

const demoTickets = [
  {
    code: "TKT-1042",
    attendeeName: "Grace W.",
    eventName: "Urban Fest Nairobi",
    ticketType: "VIP",
    status: "Pending",
    scannedBy: "",
    scannedAt: "",
  },
  {
    code: "TKT-1043",
    attendeeName: "Brian K.",
    eventName: "Campus Night Live",
    ticketType: "General",
    status: "Pending",
    scannedBy: "",
    scannedAt: "",
  },
  {
    code: "TKT-1044",
    attendeeName: "Mercy A.",
    eventName: "Coast Holiday Market",
    ticketType: "Advance",
    status: "Pending",
    scannedBy: "",
    scannedAt: "",
  },
];

const staffDetails = {
  name: "Daniel Omondi",
  phone: "0712 345 678",
  role: "Gate staff",
};

export default function GateStaffNowPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ticketCode, setTicketCode] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Scan a ticket QR code to view details.");
  const [cameraError, setCameraError] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [sessionState, setSessionState] = useState({ status: "loading", isAuthenticated: false, sessionUser: null });

  const { status, isAuthenticated, sessionUser } = sessionState;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedSession = window.localStorage.getItem("etikket-gate-session");
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed?.role === "gate_staff") {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSessionState({ status: "ready", isAuthenticated: true, sessionUser: parsed });
          return;
        }
      }
    } catch {
      window.localStorage.removeItem("etikket-gate-session");
    }

    router.replace("/gatestaff/login");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionState({ status: "ready", isAuthenticated: false, sessionUser: null });
  }, [router]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function handleLookup(code) {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setStatusMessage("Enter or scan a ticket code first.");
      return null;
    }

    const ticket = demoTickets.find((item) => item.code.toUpperCase() === normalizedCode);

    if (!ticket) {
      setSelectedTicket(null);
      setStatusMessage("Ticket not found. Try another code.");
      return null;
    }

    setSelectedTicket(ticket);
    setStatusMessage(`Ticket found for ${ticket.attendeeName}.`);
    return ticket;
  }

  async function handleScanSubmit(event) {
    event.preventDefault();
    const ticket = await handleLookup(ticketCode);

    if (!ticket) {
      return;
    }
  }

  async function startCamera() {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not available on this device.");
      return;
    }

    try {
      setCameraError("");
      setIsScanning(true);
      setStatusMessage("Opening camera scanner...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (typeof window.BarcodeDetector !== "undefined") {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const scanLoop = async () => {
          if (!videoRef.current || !isCameraActive) {
            return;
          }

          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const scannedValue = barcodes[0].rawValue;
              setTicketCode(scannedValue);
              setStatusMessage(`QR scanned: ${scannedValue}`);
              const ticket = await handleLookup(scannedValue);
              if (ticket) {
                stopCamera();
              }
              return;
            }
          } catch {
            setCameraError("Camera could not read the QR code yet. Please try again.");
          }

          if (isCameraActive) {
            setTimeout(scanLoop, 800);
          }
        };

        setIsCameraActive(true);
        scanLoop();
      } else {
        setIsCameraActive(true);
        setStatusMessage("Camera is ready. Use the input field if your browser does not support QR scanning.");
      }
    } catch {
      setCameraError("Camera access was blocked. You can still enter the ticket code manually.");
      setIsCameraActive(false);
      setIsScanning(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    setIsScanning(false);
  }

  async function handleVerifyTicket() {
    if (!selectedTicket) {
      setStatusMessage("Lookup a ticket before marking it used.");
      return;
    }

    const updatedTicket = {
      ...selectedTicket,
      status: "Verified",
      scannedBy: `${staffDetails.name} • ${staffDetails.phone}`,
      scannedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setSelectedTicket(updatedTicket);
    setStatusMessage(`Verified and marked used for ${updatedTicket.attendeeName}.`);
  }

  async function handleUseDemoCode() {
    const ticket = await handleLookup(demoTickets[0].code);
    if (ticket) {
      setTicketCode(ticket.code);
    }
  }

  function handleLogout() {
    stopCamera();

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("etikket-gate-session");
    }

    setSessionState({ status: "ready", isAuthenticated: false, sessionUser: null });
    setTicketCode("");
    setSelectedTicket(null);
    setStatusMessage("Scan a ticket QR code to view details.");
    router.replace("/gatestaff/login");
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-6 text-center text-sm font-medium text-slate-600">
        Checking gate-staff access...
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-dvh overflow-y-auto bg-white text-slate-900">
      <div className="grid min-h-dvh w-full overflow-hidden lg:grid-cols-[1fr]">
        <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-50 px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-xl">
            <Image src="/eTikketwhite.png" alt="eTikket logo" width={140} height={42} priority className="h-auto w-32" />

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Gate staff check-in</h2>
                  <p className="mt-2 text-sm text-slate-500">Scan the QR code and verify the attendee instantly.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Live</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <FiLogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Signed in as</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{sessionUser?.name || staffDetails.name}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">
                  <FiUsers size={14} />
                  {sessionUser?.email || "gate@etikket.co.ke"}
                </div>
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiCode size={16} />
                  <span>QR scanner</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    <FiCamera size={16} />
                    {isCameraActive ? "Stop camera" : "Open camera"}
                  </button>
                  <button
                    type="button"
                    onClick={handleUseDemoCode}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Use demo ticket
                  </button>
                </div>

                {cameraError ? <p className="mt-3 text-sm text-rose-600">{cameraError}</p> : null}
                {isScanning ? <p className="mt-3 text-sm text-slate-600">Scanning for QR codes...</p> : null}

                <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
                  {isCameraActive ? (
                    <video ref={videoRef} className="h-52 w-full object-cover" playsInline muted />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-slate-100 p-4 text-center text-sm text-slate-500">
                      Camera view will appear here when scanning starts.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Ticket details</p>
                    <p className="mt-1 text-sm text-slate-500">{statusMessage}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    <FiUsers size={14} />
                    {staffDetails.name}
                  </div>
                </div>

                {selectedTicket ? (
                  <div className="mt-4 space-y-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{selectedTicket.attendeeName}</p>
                        <p className="text-sm text-slate-500">{selectedTicket.eventName}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedTicket.status === "Verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {selectedTicket.status}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Ticket type</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedTicket.ticketType}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Code</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedTicket.code}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Scanned by</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedTicket.scannedBy || `${staffDetails.name} • ${staffDetails.phone}`}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedTicket.scannedAt ? `Verified at ${selectedTicket.scannedAt}` : "Not verified yet"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyTicket}
                      className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Verify and mark as used
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No ticket loaded yet. Scan a QR code or use the demo code.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
