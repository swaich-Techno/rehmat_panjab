"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function WhatsAppNote() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    void fetch("/api/capabilities")
      .then((response) => response.json())
      .then((data: { whatsapp?: boolean }) => setOpen(Boolean(data.whatsapp)))
      .catch(() => setOpen(false));
  }, []);

  if (open === null) return null;

  if (open) {
    return (
      <p className="text-sm leading-7 text-ink/70">
        WhatsApp requests are open at{" "}
        <Link href="/checkout" className="link-lux">
          checkout
        </Link>
        . The number is not listed here — the house attaches it only to a validated request.
      </p>
    );
  }

  return (
    <p className="text-sm leading-7 text-ink/50">
      WhatsApp is not published yet. When the house sets a number, request links will appear at checkout. Until then
      this path stays closed — we will not invent a chat.
    </p>
  );
}
