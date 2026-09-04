export type TransitionKind = "pour" | "wipe" | "none" | "glass" | "water" | "merge" | "vault" | "oil" | "droplet";

export function transitionKind(from: string, to: string): TransitionKind {
  if (from === "/" && to.startsWith("/product")) return "glass";
  if (from.startsWith("/product") && to.startsWith("/find-your-scent")) return "water";
  if (from.startsWith("/find-your-scent") && to.startsWith("/find-your-scent")) return "merge";
  if (from.startsWith("/auth") && to.startsWith("/account")) return "vault";
  if (from.startsWith("/cart") && to.startsWith("/checkout")) return "oil";
  if (from.startsWith("/checkout") && to.startsWith("/order")) return "droplet";
  return "none";
}
