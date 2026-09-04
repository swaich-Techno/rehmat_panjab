export type AnalyticsEventName =
  | "hero_view"
  | "collection_view"
  | "product_view"
  | "quiz_started"
  | "quiz_completed"
  | "quiz_result"
  | "next_drop_started"
  | "next_drop_completed"
  | "discount_issued"
  | "add_to_cart"
  | "buy_now"
  | "checkout_started"
  | "order_confirmed";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  path?: string;
  meta?: Record<string, string | number | boolean>;
};

function stripPii(meta: AnalyticsEvent["meta"]): AnalyticsEvent["meta"] {
  if (!meta) return meta;
  const blocked = ["email", "phone", "name", "address", "password"];
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (blocked.includes(key.toLowerCase())) continue;
    clean[key] = value;
  }
  return clean;
}

export function track(event: AnalyticsEvent): void {
  const payload = { ...event, meta: stripPii(event.meta), t: Date.now() };
  if (typeof window === "undefined") return;
  try {
    const key = "rp.analytics.v1";
    const existing = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[];
    const next = [...existing, payload].slice(-80);
    window.localStorage.setItem(key, JSON.stringify(next));
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: payload.name, path: payload.path, meta: payload.meta }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // First-party analytics must never break the shop.
  }
}
