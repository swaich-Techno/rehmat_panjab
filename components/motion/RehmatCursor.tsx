"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { motionAllowsCinematic } from "@/lib/motion/mode";
import { durationMs } from "@/lib/motion/tokens";
import {
  cursorEnabled,
  cursorShapeFromElement,
  type CursorInputKind,
  type CursorShape,
} from "@/lib/motion/cursor-mode";

const DROPLET =
  "M12 1.6 C12 1.6 5.2 9.2 4.4 15.4 C3.6 21.2 7.2 26 12 26 C16.8 26 20.4 21.2 19.6 15.4 C18.8 9.2 12 1.6 12 1.6 Z";
const OVAL = "M12 6 C19 6 23 10 23 14 C23 18 19 22 12 22 C5 22 1 18 1 14 C1 10 5 6 12 6 Z";
const BOTTLE = "M10.2 1.4 H13.8 V4.2 H16.2 V6.4 H15.4 V24.8 H8.6 V6.4 H7.8 V4.2 H10.2 Z";
const KEYHOLE =
  "M12 4.2 C9.2 4.2 7 6.4 7 9.2 C7 11.4 8.4 13.2 10.2 13.9 V20.8 H13.8 V13.9 C15.6 13.2 17 11.4 17 9.2 C17 6.4 14.8 4.2 12 4.2 Z";
const VAULT =
  "M4 6 H20 V22 H4 Z M12 9.2 C10.4 9.2 9.2 10.4 9.2 12 C9.2 13.2 10 14.2 11.1 14.6 V18 H12.9 V14.6 C14 14.2 14.8 13.2 14.8 12 C14.8 10.4 13.6 9.2 12 9.2 Z";

const PATHS: Record<Exclude<CursorShape, "hidden" | "text">, string> = {
  droplet: DROPLET,
  oval: OVAL,
  bottle: BOTTLE,
  add: DROPLET,
  buy: DROPLET,
  quiz: OVAL,
  link: OVAL,
  drag: OVAL,
  vault: KEYHOLE,
};

const LABELS: Partial<Record<CursorShape, string>> = {
  bottle: "View",
  add: "Add",
  buy: "Buy",
  drag: "Drag",
};

function labelFor(shape: CursorShape): string {
  return LABELS[shape] ?? "";
}

function pathFor(shape: CursorShape, vaultOpen: boolean): string {
  if (shape === "hidden" || shape === "text") return DROPLET;
  if (shape === "vault") return vaultOpen ? VAULT : KEYHOLE;
  return PATHS[shape];
}

export function RehmatCursor() {
  const mode = useMotionMode();
  const rootRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [shape, setShape] = useState<CursorShape>("droplet");
  const [label, setLabel] = useState("");
  const lastInput = useRef<CursorInputKind>("mouse");
  const vaultOpen = useRef(false);
  const shapeRef = useRef<CursorShape>("droplet");

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const hover = window.matchMedia("(hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const compute = () =>
      cursorEnabled({
        motionMode: mode,
        pointerCoarse: coarse.matches,
        hoverHover: hover.matches,
        lastInput: lastInput.current,
        prefersReduced: reduce.matches,
      });

    const apply = () => {
      const next = compute();
      setEnabled(next);
      document.documentElement.dataset.rehmatCursor = next ? "on" : "off";
    };

    apply();
    coarse.addEventListener("change", apply);
    hover.addEventListener("change", apply);
    reduce.addEventListener("change", apply);
    return () => {
      coarse.removeEventListener("change", apply);
      hover.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
      delete document.documentElement.dataset.rehmatCursor;
    };
  }, [mode]);

  useEffect(() => {
    const node = rootRef.current;
    const tail = tailRef.current;
    const path = pathRef.current;
    if (!node || !enabled) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let tailX = x;
    let tailY = y;
    let vx = 0;
    let vy = 0;
    let press = 1;
    let inside = true;
    let hidden = document.visibilityState === "visible";
    let raf = 0;
    let running = true;
    let dragging = false;
    let downOnImage = false;
    let vaultTimer = 0;

    const cinematic = motionAllowsCinematic(mode);
    const morphMs = cinematic ? durationMs("morph") : durationMs("micro");

    const setShapeSafe = (next: CursorShape) => {
      shapeRef.current = next;
      setShape(next);
      setLabel(labelFor(next));
      if (path) {
        path.style.transition = `d ${morphMs}ms var(--ease-liquidEase)`;
        path.setAttribute("d", pathFor(next, vaultOpen.current));
      }
    };

    const onKey = () => {
      lastInput.current = "keyboard";
      setEnabled(false);
      document.documentElement.dataset.rehmatCursor = "off";
    };

    const resolveShape = (event: PointerEvent): CursorShape => {
      const el = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      if (!el) return "droplet";
      const tagged = el.closest("[data-cursor]") as HTMLElement | null;
      const dataset = tagged?.dataset.cursor;
      const editable = Boolean(
        el.isContentEditable || el.closest("input, textarea, select, [data-cursor='text']"),
      );
      if (dragging) return "drag";
      return cursorShapeFromElement(el.tagName, editable, dataset);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        lastInput.current = "touch";
        setEnabled(false);
        document.documentElement.dataset.rehmatCursor = "off";
        return;
      }
      lastInput.current = event.pointerType === "pen" ? "pen" : "mouse";
      vx = event.clientX - tx;
      vy = event.clientY - ty;
      tx = event.clientX;
      ty = event.clientY;
      inside = true;
      if (downOnImage && (Math.abs(vx) > 3 || Math.abs(vy) > 3)) dragging = true;
      const next = resolveShape(event);
      if (next === "text") {
        node.classList.add("is-dissolved");
        return;
      }
      node.classList.remove("is-dissolved");
      if (next === "vault") {
        if (!vaultOpen.current) {
          setShapeSafe("vault");
          window.clearTimeout(vaultTimer);
          vaultTimer = window.setTimeout(() => {
            vaultOpen.current = true;
            if (path) path.setAttribute("d", VAULT);
          }, morphMs);
        }
      } else {
        vaultOpen.current = false;
        window.clearTimeout(vaultTimer);
        setShapeSafe(next);
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      press = 0.78;
      const el = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      downOnImage = Boolean(el?.closest("[data-cursor='product'], [data-cursor='drag'], img"));
    };

    const onUp = () => {
      press = 1.08;
      window.setTimeout(() => {
        press = 1;
      }, durationMs("micro"));
      dragging = false;
      downOnImage = false;
    };

    const onLeave = () => {
      inside = false;
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      inside = true;
      tx = event.clientX;
      ty = event.clientY;
      x = tx;
      y = ty;
    };

    const onVis = () => {
      hidden = document.visibilityState === "visible";
    };

    const loop = () => {
      if (!running) return;
      if (hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }
      x = tx;
      y = ty;
      tailX += (x - tailX) * 0.28;
      tailY += (y - tailY) * 0.28;
      const speed = Math.min(1, Math.hypot(vx, vy) / 28);
      const angle = Math.atan2(vy, vx);
      const stretch = 1 + speed * 0.42;
      const squash = 1 - speed * 0.16;
      const buy = shapeRef.current === "buy" ? 1.35 : shapeRef.current === "add" ? 1.18 : 1;
      const scaleX = squash * press * buy;
      const scaleY = stretch * press * buy;
      node.style.transform = `translate3d(${x - 14}px, ${y - 18}px, 0) rotate(${angle * speed * 12}deg) scale(${scaleX}, ${scaleY})`;
      node.classList.toggle("is-on", inside);
      node.classList.toggle("is-dissolved", !inside);
      if (tail) {
        tail.style.transform = `translate3d(${tailX - 14}px, ${tailY - 18}px, 0) scale(${0.72 * buy}, ${0.72 * buy})`;
        tail.style.opacity = inside ? String(0.28 + speed * 0.2) : "0";
      }
      vx *= 0.72;
      vy *= 0.72;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(vaultTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled, mode]);

  if (!enabled) return null;

  return (
    <>
      <div ref={tailRef} className="rehmat-cursor" aria-hidden="true">
        <svg className="rehmat-cursor__svg" viewBox="0 0 24 28">
          <path d={DROPLET} fill="rgba(180,122,71,0.35)" />
        </svg>
      </div>
      <div ref={rootRef} className="rehmat-cursor" data-shape={shape} aria-hidden="true">
        <svg className="rehmat-cursor__svg" viewBox="0 0 24 28">
          <defs>
            <radialGradient id="rp-oil-drop" cx="32%" cy="22%" r="78%">
              <stop offset="0%" stopColor="#fbf7ee" stopOpacity="0.95" />
              <stop offset="42%" stopColor="#d7c8ab" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#b47a47" stopOpacity="0.92" />
            </radialGradient>
          </defs>
          <path ref={pathRef} d={DROPLET} fill="url(#rp-oil-drop)" stroke="rgba(99,55,54,0.22)" strokeWidth="0.4" />
        </svg>
        <span className="rehmat-cursor__label">{label}</span>
      </div>
    </>
  );
}

/** @deprecated Use RehmatCursor. Kept as a named export so old imports compile during the rename. */
export function LiquidCursor() {
  return <RehmatCursor />;
}
