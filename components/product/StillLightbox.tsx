"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CAMPAIGN_STILL_SIZE } from "@/data/fragrance-config";
import { durationCss } from "@/lib/motion/tokens";

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

const FOCUSABLE = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export function StillLightbox({ src, alt, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const root = dialogRef.current;
    if (!root) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.querySelector<HTMLElement>("[data-lightbox-close]")?.focus();

    function focusables(): HTMLElement[] {
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true",
      );
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  return (
    <div className="still-lightbox" role="presentation">
      <button
        type="button"
        className="still-lightbox__backdrop"
        aria-label="Close photograph"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        className="still-lightbox__dialog"
        style={{ animationDuration: durationCss("fast") }}
      >
        <button type="button" className="still-lightbox__close label" data-lightbox-close="" onClick={onClose}>
          Close
        </button>
        <div className="still-lightbox__frame">
          <Image
            src={src}
            alt={alt}
            width={CAMPAIGN_STILL_SIZE.width}
            height={CAMPAIGN_STILL_SIZE.height}
            sizes="100vw"
            className="still-lightbox__img"
            priority
          />
        </div>
      </div>
    </div>
  );
}
