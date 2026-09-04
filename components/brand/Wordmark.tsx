import Link from "next/link";

export function Wordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scale = size === "lg" ? "text-3xl md:text-5xl" : size === "sm" ? "text-lg" : "text-[1.35rem]";
  return (
    <Link href="/" className={`display ${scale} tracking-[-0.04em] no-underline`}>
      <span className="block leading-none">Rehmat</span>
      <span className="block leading-none text-forest">Panjab</span>
    </Link>
  );
}
