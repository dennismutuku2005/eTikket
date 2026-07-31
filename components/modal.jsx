"use client";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-[24px] border border-[#ececec] bg-white p-6 text-[#0f0f10] shadow-2xl">
        {children}
      </div>
    </div>
  );
}
