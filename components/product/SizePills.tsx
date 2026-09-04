"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import type { SizeVariant } from "@/data/fragrance-config";
import { SizeGuide } from "@/components/product/OilExplainer";
import { durationCss } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { pointerPercent } from "@/lib/motion/press";

type Props = {
  variants: SizeVariant[];
  value: string;
  onChange: (id: string) => void;
};

/**
 * Size pills with an amber gooey oil blob (SVG blur + colormatrix).
 * Morphs 400–500ms via the standard token. Not neon slime.
 */
export function SizePills({ variants, value, onChange }: Props) {
  const mode = useMotionMode();
  const rawId = useId();
  const gooId = `rp-size-goo-${rawId.replace(/:/g, "")}`;
  const trackRef = useRef<HTMLDivElement>(null);
  const [blob, setBlob] = useState({ x: 0, y: 0, width: 0, height: 0, ready: false });
  const selected = variants.find((item) => item.id === value) ?? variants[0];

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function measure() {
      const node = trackRef.current;
      if (!node) return;
      const index = Math.max(0, variants.findIndex((item) => item.id === value));
      const item = node.querySelectorAll<HTMLButtonElement>("[data-size-pill]")[index];
      if (!item) return;
      const parent = node.getBoundingClientRect();
      const rect = item.getBoundingClientRect();
      setBlob({
        x: rect.left - parent.left,
        y: rect.top - parent.top,
        width: rect.width,
        height: rect.height,
        ready: true,
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value, variants]);

  return (
    <div className="size-pills">
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <filter id={gooId} x="-30%" y="-40%" width="160%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      <div
        ref={trackRef}
        className="size-pills__track"
        role="radiogroup"
        aria-label="Size"
      >
        <span
          className="size-pills__blob"
          data-ready={blob.ready}
          aria-hidden="true"
          style={{
            transform: `translate3d(${blob.x}px, ${blob.y}px, 0)`,
            width: blob.width || undefined,
            height: blob.height || undefined,
            filter: mode === "REDUCED" ? "none" : `url(#${gooId})`,
            transition: `transform ${durationCss("standard")} var(--ease-liquidEase), width ${durationCss("standard")} var(--ease-liquidEase), height ${durationCss("standard")} var(--ease-liquidEase)`,
          }}
        />
        {variants.map((item) => {
          const on = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              data-size-pill=""
              data-cursor="buy"
              aria-checked={on}
              className={`size-pills__pill ${on ? "is-on" : ""}`}
              onPointerDown={(event) => {
                if (mode === "REDUCED") return;
                const origin = pointerPercent(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect());
                event.currentTarget.style.setProperty("--px", `${origin.x}%`);
                event.currentTarget.style.setProperty("--py", `${origin.y}%`);
                event.currentTarget.dataset.pressed = "true";
              }}
              onPointerUp={(event) => {
                event.currentTarget.dataset.pressed = "false";
              }}
              onPointerLeave={(event) => {
                event.currentTarget.dataset.pressed = "false";
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.currentTarget.dataset.pressed = "true";
                event.currentTarget.style.setProperty("--px", "50%");
                event.currentTarget.style.setProperty("--py", "50%");
              }}
              onKeyUp={(event) => {
                event.currentTarget.dataset.pressed = "false";
              }}
              onClick={() => onChange(item.id)}
            >
              <span className="display text-2xl md:text-3xl">{item.label}</span>
            </button>
          );
        })}
      </div>
      {selected ? <SizeGuide ml={selected.ml} /> : null}
    </div>
  );
}
