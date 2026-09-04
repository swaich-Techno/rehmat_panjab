"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";

type Props = {
  title: string;
  kicker: string;
  lines: string[];
  shareText: string;
};

export function ShareCard({ title, kicker, lines, shareText }: Props) {
  const [copied, setCopied] = useState(false);
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: kicker, text: shareText });
        return;
      } catch {
        // user cancelled
      }
    }
    await copy();
  }

  return (
    <div className="mt-10 max-w-lg border border-ink/10 bg-ivory p-8 text-left">
      <p className="label text-forest">{kicker}</p>
      <h2 className="display mt-3 text-4xl">{title}</h2>
      <ul className="mt-6 space-y-2 text-sm leading-7 text-ink/80">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-6 text-ink/50">No name, email, or phone is included.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <LiquidButton liquid="water" onClick={() => void share()}>
          Share
        </LiquidButton>
        <a href={whatsapp} className="liquid-button text-center no-underline" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <button type="button" className="label touch-target" onClick={() => void copy()}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-4 text-xs text-ink/50">Instagram: copy, then paste into a story or note. We do not post for you.</p>
    </div>
  );
}
