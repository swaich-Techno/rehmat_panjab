export function Emblem({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <rect x="3" y="3" width="74" height="74" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy="40" r="17" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M40 16v48M16 40h48" stroke="currentColor" strokeWidth="0.6" />
      <path
        d="M28 52c6-10 18-10 24 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}
