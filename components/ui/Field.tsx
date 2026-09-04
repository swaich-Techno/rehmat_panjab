import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="label text-ink/60">{label}</span>
      <input
        {...props}
        className="mt-2 w-full border-b border-ink/25 bg-transparent py-2 text-base outline-none transition-colors hover:border-forest/60 focus:border-forest"
        data-cursor="text"
      />
    </label>
  );
}

export function AreaField({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="label text-ink/60">{label}</span>
      <textarea
        {...props}
        className="mt-2 w-full border-b border-ink/25 bg-transparent py-2 text-base outline-none transition-colors hover:border-forest/60 focus:border-forest"
        data-cursor="text"
      />
    </label>
  );
}
