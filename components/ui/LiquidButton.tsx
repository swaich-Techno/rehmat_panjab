"use client";

import { useRef, type ButtonHTMLAttributes, type PointerEvent } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  success?: boolean;
  loading?: boolean;
};

export function LiquidButton({
  children,
  className = "",
  success = false,
  loading = false,
  disabled,
  onPointerMove,
  onClick,
  ...props
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMove(event: PointerEvent<HTMLButtonElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--px", `${x}%`);
    node.style.setProperty("--py", `${y}%`);
    onPointerMove?.(event);
  }

  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? "button"}
      className={`liquid-button ${className}`}
      data-success={success}
      data-loading={loading}
      disabled={disabled || loading}
      onPointerMove={handleMove}
      onClick={onClick}
    >
      {loading ? "Please wait" : children}
    </button>
  );
}
