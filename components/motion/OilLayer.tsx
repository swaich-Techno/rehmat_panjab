"use client";

import { useEffect, useRef } from "react";

export function OilLayer({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let scroll = 0;
    let pointer = { x: 0.62, y: 0.4 };
    let raf = 0;
    let running = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();

    const onScroll = () => {
      scroll = window.scrollY * 0.0012;
    };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("pointermove", onMove);

    const draw = () => {
      if (!running) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const t = reduce ? 0 : frame * 0.008 + scroll;
      for (let i = 0; i < 5; i += 1) {
        const y = h * (0.35 + i * 0.09) + Math.sin(t + i) * (reduce ? 0 : 18);
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 12) {
          const wave =
            Math.sin(x * 0.012 + t * 1.4 + i) * 16 +
            Math.sin(x * 0.03 - t + pointer.x * 4) * 8;
          ctx.lineTo(x, y + wave);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle =
          i % 2 === 0
            ? `rgba(185, 129, 77, ${0.08 + i * 0.03})`
            : `rgba(90, 48, 47, ${0.05 + i * 0.02})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(w * pointer.x, h * pointer.y, 70, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 168, 110, 0.12)";
      ctx.fill();
      frame += 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={`h-full w-full ${className}`} aria-hidden="true" />;
}
