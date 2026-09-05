export type TransitionKind = "pour" | "wipe" | "none" | "glass" | "water" | "merge" | "vault" | "oil" | "droplet";

function firstSegment(path: string): string {
  const part = path.split("/").filter(Boolean)[0];
  return part ? `/${part}` : "/";
}

/**
 * Mapped veils between major rooms. Unknown pairs still wipe so the
 * transition is visible — REDUCED skips in the player, not here.
 */
export function transitionKind(from: string, to: string): TransitionKind {
  if (from === to) return "none";
  if (from === "/" && to.startsWith("/product")) return "glass";
  if (from === "/" && to.startsWith("/collection")) return "water";
  if (from.startsWith("/product") && to.startsWith("/find-your-scent")) return "water";
  if (from.startsWith("/find-your-scent") && to.startsWith("/find-your-scent")) return "merge";
  if (from.startsWith("/auth") && to.startsWith("/account")) return "vault";
  if (from.startsWith("/cart") && to.startsWith("/checkout")) return "oil";
  if (from.startsWith("/checkout") && to.startsWith("/order")) return "droplet";
  if (to.startsWith("/find-your-scent") || to.startsWith("/create-your-fragrance")) return "water";
  if (to.startsWith("/product") || to.startsWith("/next-drop") || to.startsWith("/checkout")) return "oil";
  if (to.startsWith("/our-story") || from === "/") return "glass";
  if (from.startsWith("/auth") || to.startsWith("/auth") || to.startsWith("/account")) return "vault";
  if (firstSegment(from) !== firstSegment(to)) return "wipe";
  return "wipe";
}
