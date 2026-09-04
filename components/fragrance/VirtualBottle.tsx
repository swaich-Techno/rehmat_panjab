"use client";

import { NOTE_LAYERS, type CreateNoteId } from "@/data/create-fragrance-config";
import { durationCss } from "@/lib/motion/tokens";

export function VirtualBottle({
  notes,
  blend,
  orbit = false,
  className = "",
}: {
  notes: CreateNoteId[];
  blend?: string;
  orbit?: boolean;
  className?: string;
}) {
  const mix = blend ?? (notes.reduce((acc, id) => acc || NOTE_LAYERS[id].color, "") || "#d7c8ab");
  const latest = notes[notes.length - 1];

  return (
    <div className={`relative mx-auto h-80 w-40 ${className}`} aria-hidden="true">
      <div
        className="absolute inset-x-10 top-0 h-7 bg-forest/50"
        style={{ clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }}
      />
      {latest ? (
        <span
          key={`fall-${latest}-${notes.length}`}
          className="bottle-neck-drop"
          style={{ background: NOTE_LAYERS[latest].color }}
        />
      ) : null}
      <div className="absolute inset-x-6 top-7 bottom-0 overflow-hidden border border-ink/20 bg-ivory/35">
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: notes.length ? `${Math.min(92, 22 + notes.length * 14)}%` : "8%",
            background: mix,
            opacity: 0.72,
            transition: `height ${durationCss("editorial")} var(--ease-liquidEase), background ${durationCss("standard")} var(--ease-glassEase)`,
          }}
        />
        {notes.map((id, index) => (
          <span
            key={id}
            className="bottle-note-enter absolute inset-x-0"
            style={{
              bottom: `${index * 12}%`,
              height: "22%",
              background: NOTE_LAYERS[id].color,
              opacity: 0.45,
              mixBlendMode: "multiply",
              animationDelay: `${index * 70}ms`,
            }}
          />
        ))}
      </div>
      {orbit
        ? notes.map((id, index) => (
            <span
              key={`orbit-${id}`}
              className="orbit-note label text-[0.58rem] text-forest"
              style={{
                top: "42%",
                left: "50%",
                animationDelay: `${index * 1.4}s`,
                animationDuration: `${16 + index}s`,
              }}
            >
              {NOTE_LAYERS[id].label}
            </span>
          ))
        : null}
    </div>
  );
}
