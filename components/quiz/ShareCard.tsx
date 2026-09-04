"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";

type Props = {
  title: string;
  kicker: string;
  lines: string[];
  shareText: string;
};

function drawCard(width: number, height: number, title: string, lines: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#f5f1e7";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#9eaf9b";
  ctx.fillRect(0, 0, width, height * 0.18);
  ctx.fillStyle = "#183a2a";
  ctx.font = `${Math.round(width * 0.045)}px "Times New Roman", serif`;
  ctx.fillText("REHMAT PANJAB", width * 0.08, height * 0.11);
  ctx.font = `${Math.round(width * 0.11)}px "Times New Roman", serif`;
  wrap(ctx, title, width * 0.08, height * 0.34, width * 0.84, Math.round(width * 0.13));
  ctx.fillStyle = "#161815";
  ctx.font = `${Math.round(width * 0.038)}px "Helvetica Neue", sans-serif`;
  lines.slice(0, 4).forEach((line, index) => {
    ctx.fillText(line, width * 0.08, height * 0.58 + index * (height * 0.06));
  });
  ctx.fillStyle = "#b47a47";
  ctx.font = `${Math.round(width * 0.028)}px "Helvetica Neue", sans-serif`;
  ctx.fillText("Made to be worn, not announced.", width * 0.08, height * 0.92);
  return canvas.toDataURL("image/png");
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  max: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let top = y;
  for (const word of words) {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > max) {
      ctx.fillText(line, x, top);
      line = `${word} `;
      top += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, top);
}

function download(href: string, name: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
}

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

  function branded(ratio: "9x16" | "1x1") {
    const size = ratio === "9x16" ? [1080, 1920] : [1080, 1080];
    const href = drawCard(size[0], size[1], title, lines);
    if (href) download(href, `rehmat-panjab-${ratio}.png`);
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
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <LiquidButton liquid="water" onClick={() => void share()}>
          Share
        </LiquidButton>
        <a href={whatsapp} className="liquid-button text-center no-underline" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <button type="button" className="label touch-target" onClick={() => void copy()}>
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" className="label touch-target" onClick={() => branded("9x16")}>
          Card 9:16
        </button>
        <button type="button" className="label touch-target" onClick={() => branded("1x1")}>
          Card 1:1
        </button>
      </div>
      <p className="mt-4 text-xs text-ink/50">Instagram: copy, then paste into a story or note. We do not post for you.</p>
    </div>
  );
}
