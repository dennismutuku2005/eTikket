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
  const [showVerifyModal, setShowVerifyModal] = useState(false);

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
    setShowVerifyModal(true);
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
    setShowVerifyModal(false);
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
      <main className="flex min-h-dvh items-center justify-center bg-[#fafafa] px-6 text-center text-sm font-bold text-[#6b6b70]">
        Checking gate-staff access...
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-dvh overflow-y-auto bg-[#fafafa] text-[#0f0f10]">
      {/* Ticket Verify Modal */}
      {showVerifyModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[24px] border border-[#ececec] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 border-b border-[#ececec] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#f33959]">Ticket verification</p>
                <h3 className="mt-1 text-xl font-bold text-[#0f0f10]">Confirm check-in</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-xs font-bold text-[#0f0f10] hover:bg-[#f4f4f5] transition"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-[16px] bg-[#fafafa] border border-[#ececec] px-4 py-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Attendee</p>
                  <p className="mt-0.5 text-base font-bold text-[#0f0f10]">{selectedTicket.attendeeName}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedTicket.status === "Verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {selectedTicket.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Event</p>
                  <p className="mt-0.5 text-sm font-bold text-[#0f0f10]">{selectedTicket.eventName}</p>
                </div>
                <div className="rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Ticket type</p>
                  <p className="mt-0.5 text-sm font-bold text-[#0f0f10]">{selectedTicket.ticketType}</p>
                </div>
              </div>

              <div className="rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Ticket code</p>
                <p className="mt-0.5 font-mono text-sm font-bold text-[#0f0f10]">{selectedTicket.code}</p>
              </div>

              <div className="rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Verified by</p>
                <p className="mt-0.5 text-sm font-bold text-[#0f0f10]">{staffDetails.name} · {staffDetails.phone}</p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 rounded-full border border-[#ececec] bg-white py-3 text-sm font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
              >
                Cancel
              </button>
              {selectedTicket.status !== "Verified" && (
                <button
                  type="button"
                  onClick={handleVerifyTicket}
                  className="flex-1 rounded-full bg-[#f33959] py-3 text-sm font-bold text-white transition hover:bg-[#d92847]"
                >
                  ✓ Mark as used
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid min-h-dvh w-full overflow-hidden lg:grid-cols-[1fr]">
        <section className="flex min-h-dvh items-center justify-center overflow-y-auto bg-[#fafafa] px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-xl">
            <Image src="/eTikketwhite.png" alt="eTikket logo" width={140} height={42} priority className="h-auto w-32 filter invert" />

            <div className="mt-8 rounded-[24px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f0f10]">Gate staff check-in</h2>
                  <p className="mt-1 text-sm text-[#6b6b70]">Scan the QR code and verify the attendee instantly.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Live</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-xs font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                  >
                    <FiLogOut size={13} />
                    Logout
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Signed in as</p>
                  <p className="mt-0.5 text-sm font-bold text-[#0f0f10]">{sessionUser?.name || staffDetails.name}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white border border-[#ececec] px-3 py-1 text-xs font-bold text-[#6b6b70]">
                  <FiUsers size={12} />
                  {sessionUser?.email || "gate@etikket.co.ke"}
                </div>
              </div>

              <div className="mt-5 rounded-[14px] border border-[#ececec] bg-[#fafafa] p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6b6b70]">
                  <FiCode size={14} className="text-[#f33959]" />
                  <span>QR scanner</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f33959] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#d92847]"
                  >
                    <FiCamera size={14} />
                    {isCameraActive ? "Stop camera" : "Open camera"}
                  </button>
                  <button
                    type="button"
                    onClick={handleUseDemoCode}
                    className="rounded-full border border-[#ececec] bg-white px-4 py-2 text-xs font-bold text-[#0f0f10] transition hover:bg-[#f4f4f5]"
                  >
                    Use demo ticket
                  </button>
                </div>

                {cameraError ? <p className="mt-2 text-xs font-bold text-[#f33959]">{cameraError}</p> : null}
                {isScanning ? <p className="mt-2 text-xs text-[#6b6b70]">Scanning for QR codes...</p> : null}

                <div className="mt-3 overflow-hidden rounded-[12px] border border-[#ececec] bg-white">
                  {isCameraActive ? (
                    <video ref={videoRef} className="h-48 w-full object-cover" playsInline muted />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-[#f4f4f5] p-4 text-center text-xs font-bold text-[#6b6b70]">
                      Camera view will appear here when scanning starts.
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleScanSubmit} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  placeholder="Enter ticket code e.g. TKT-1042"
                  className="h-11 flex-1 rounded-[14px] border border-[#ececec] bg-[#fafafa] px-4 text-sm text-[#0f0f10] outline-none placeholder:text-[#6b6b70] focus:border-[#f33959] focus:bg-white transition"
                />
                <button
                  type="submit"
                  className="h-11 rounded-full bg-[#111113] px-5 text-xs font-bold text-white transition hover:bg-[#0f0f10]"
                >
                  Lookup
                </button>
              </form>

              <div className="mt-5 rounded-[14px] border border-[#ececec] bg-[#fafafa] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Ticket details</p>
                    <p className="mt-0.5 text-xs text-[#6b6b70]">{statusMessage}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white border border-[#ececec] px-3 py-1 text-xs font-bold text-[#6b6b70]">
                    <FiUsers size={12} />
                    {staffDetails.name}
                  </div>
                </div>

                {selectedTicket ? (
                  <div className="mt-4 space-y-3 rounded-[12px] border border-[#ececec] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-[#0f0f10]">{selectedTicket.attendeeName}</p>
                        <p className="text-xs text-[#6b6b70]">{selectedTicket.eventName}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedTicket.status === "Verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {selectedTicket.status}
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-[10px] bg-[#fafafa] border border-[#ececec] px-3 py-2.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Ticket type</p>
                        <p className="mt-0.5 text-sm font-bold text-[#0f0f10]">{selectedTicket.ticketType}</p>
                      </div>
                      <div className="rounded-[10px] bg-[#fafafa] border border-[#ececec] px-3 py-2.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Code</p>
                        <p className="mt-0.5 font-mono text-sm font-bold text-[#0f0f10]">{selectedTicket.code}</p>
                      </div>
                    </div>

                    <div className="rounded-[10px] bg-[#fafafa] border border-[#ececec] px-3 py-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b70]">Scanned by</p>
                      <p className="mt-0.5 text-sm font-bold text-[#0f0f10]">
                        {selectedTicket.scannedBy || `${staffDetails.name} · ${staffDetails.phone}`}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b6b70]">
                        {selectedTicket.scannedAt ? `Verified at ${selectedTicket.scannedAt}` : "Not verified yet"}
                      </p>
                    </div>

                    {selectedTicket.status !== "Verified" && (
                      <button
                        type="button"
                        onClick={() => setShowVerifyModal(true)}
                        className="w-full rounded-full bg-[#f33959] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#d92847]"
                      >
                        <FiCheckCircle className="mr-2 inline-block h-4 w-4" />
                        Verify and mark as used
                      </button>
                    )}

                    {selectedTicket.status === "Verified" && (
                      <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                        <FiCheckCircle className="h-4 w-4" />
                        Ticket verified successfully
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[12px] border border-dashed border-[#ececec] bg-white p-4 text-center text-xs font-bold text-[#6b6b70]">
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
