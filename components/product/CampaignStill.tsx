"use client";

import { useState } from "react";
import Image from "next/image";
import { StillLightbox } from "@/components/product/StillLightbox";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** PDP only — opens an accessible dialog. Collection/home navigate instead. */
  expand?: boolean;
  className?: string;
};

export function CampaignStill({ src, alt, sizes, priority = false, expand = false, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  const frame = (
    <div className={`campaign-still ${className}`}>
      <Image
        src={src}
        alt={expand ? "" : alt}
        fill
        priority={priority}
        sizes={sizes}
        className="campaign-still__img"
      />
    </div>
  );

  if (!expand) return frame;

  return (
    <>
      <button
        type="button"
        className="campaign-still-open"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Open photograph: ${alt}`}
        onClick={() => setOpen(true)}
      >
        {frame}
      </button>
      {open ? <StillLightbox src={src} alt={alt} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
