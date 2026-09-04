"use client";

import { useState } from "react";

export function AdminBell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" className="label touch-target" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        Bell
      </button>
      {open ? (
        <div className="absolute right-0 z-10 mt-2 w-64 border border-ink/10 bg-ivory p-4 text-sm shadow-sm">
          <p className="label text-forest">Notifications</p>
          <p className="mt-3 text-ink/70">Nothing yet</p>
        </div>
      ) : null}
    </div>
  );
}
