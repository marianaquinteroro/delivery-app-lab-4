"use client";

import { useEffect } from "react";

export const Toast = ({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(onClose, 6000);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed top-4 right-4 z-[2000] flex items-center gap-3 rounded-2xl bg-green-600 px-5 py-3 text-white shadow-lg"
    >
      <span>{message}</span>
      <button className="cursor-pointer text-sm underline" onClick={onClose}>
        Close
      </button>
    </div>
  );
};
