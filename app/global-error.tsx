"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-IN">
      <body className="bg-[#F5F1E7] text-[#171814] p-10">
        <p style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 12 }}>The house is unavailable</p>
        <h1 style={{ fontSize: "3rem", lineHeight: 0.95, maxWidth: 640 }}>
          A global fault. Nothing was charged. Nothing was signed in.
        </h1>
        <button type="button" onClick={reset} style={{ marginTop: 24, padding: "12px 20px" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
