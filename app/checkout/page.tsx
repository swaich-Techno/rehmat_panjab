"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/commerce/CartProvider";
import { Field, AreaField } from "@/components/ui/Field";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { formatInrFromPaise } from "@/lib/commerce/money";
import { track } from "@/lib/analytics/index";
import { LOCAL_ORDERS_KEY } from "@/lib/insights/store";
import { PackCeremony, type PackPhase } from "@/components/commerce/PackCeremony";
import { MobileCommerceBar } from "@/components/commerce/MobileCommerceBar";
import { OilLayer } from "@/components/motion/OilLayer";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import type { OrderPhase } from "@/components/ui/LiquidButton";
import { ACTIVE_REWARD_KEY, readRewardCookie, type ActiveReward } from "@/lib/rewards/client";
import { useLocalJson } from "@/lib/storage/local-json";

export default function CheckoutPage() {
  const { totals, cart } = useCart();
  const router = useRouter();
  const mode = useMotionMode();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [pack, setPack] = useState<PackPhase>("idle");
  const [orderPhase, setOrderPhase] = useState<OrderPhase>("idle");
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const storedReward = useLocalJson<ActiveReward | null>(ACTIVE_REWARD_KEY, null);
  const rewardToken = storedReward?.token ?? null;
  const rewardNote = rewardToken
    ? "A 5% house thank-you is attached if this email matches the vote. It only applies when prices exist — we will not invent a rupee off."
    : "";

  useEffect(() => {
    track({ name: "checkout_started", path: "/checkout" });
    void fetch("/api/capabilities")
      .then((response) => response.json())
      .then((data: { whatsapp?: boolean }) => setWhatsappOpen(Boolean(data.whatsapp)))
      .catch(() => setWhatsappOpen(false));
  }, []);

  async function playPack() {
    if (mode === "REDUCED") return;
    const slice = Math.floor(durationMs("pack") / 3);
    setPack("bottle");
    await wait(slice);
    setPack("carton");
    await wait(slice);
    setPack("parcel");
    await wait(slice);
    setPack("idle");
  }

  async function submit(channel: "manual" | "whatsapp") {
    setLoading(true);
    setError("");
    setOrderPhase("preparing");
    void playPack();
    const response = await fetch("/api/checkout/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lines: cart.lines,
        name,
        email,
        phone,
        note,
        channel,
        rewardToken: rewardToken || readRewardCookie() || undefined,
      }),
    });
    const data = (await response.json()) as {
      ok: boolean;
      requestId?: string;
      whatsapp?: string | null;
      message?: string;
    };
    setLoading(false);
    if (!data.ok || !data.requestId) {
      setOrderPhase("idle");
      setError(data.message ?? "The request could not be written.");
      return;
    }
    setOrderPhase("ready");
    const orders = JSON.parse(window.localStorage.getItem(LOCAL_ORDERS_KEY) ?? "[]") as unknown[];
    window.localStorage.setItem(
      LOCAL_ORDERS_KEY,
      JSON.stringify([{ id: data.requestId, at: Date.now(), channel, email }, ...orders]),
    );
    track({ name: "order_confirmed", meta: { kind: "request" } });
    if (channel === "whatsapp" && data.whatsapp) {
      setWhatsapp(data.whatsapp);
      window.open(data.whatsapp, "_blank", "noopener,noreferrer");
    }
    router.push(`/order/${data.requestId}`);
  }

  return (
    <div className="site-grid section-pad pb-28 md:pb-16">
      <PackCeremony phase={pack} />
      <div className="col-span-12 md:col-span-7">
        <p className="label text-wine">Checkout coming soon</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">
          Card payments
          <span className="block text-forest">are not open.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-8 text-ink/75">
          You can leave a manual request. If WhatsApp is configured, you may send the same server-validated list there. Nothing will pretend to have charged you.
        </p>
        <form className="mt-10 max-w-md space-y-6" onSubmit={(event) => event.preventDefault()}>
          <Field label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Field label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          <AreaField label="Note to the house" rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
          {rewardNote ? <p className="text-sm leading-7 text-forest">{rewardNote}</p> : null}
          {error ? (
            <p className="text-sm text-wine" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-3">
            <LiquidButton
              liquid="oil"
              orderFlow
              phase={orderPhase}
              loading={loading}
              disabled={totals.lines.length === 0}
              onClick={() => void submit("manual")}
            >
              Request
            </LiquidButton>
            {whatsappOpen ? (
              <LiquidButton loading={loading} disabled={totals.lines.length === 0} onClick={() => void submit("whatsapp")}>
                Request on WhatsApp
              </LiquidButton>
            ) : (
              <p className="text-sm leading-7 text-ink/50">
                WhatsApp is not published yet. Manual request still reaches the house. We will not invent a chat number.
              </p>
            )}
          </div>
          {whatsapp ? (
            <a href={whatsapp} className="label">
              Open WhatsApp again
            </a>
          ) : null}
        </form>
      </div>
      <aside className="relative col-span-12 mt-10 overflow-hidden bg-paper p-6 md:col-span-4 md:col-start-9 md:mt-8">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
          <OilLayer />
        </div>
        <p className="relative z-[1] label">Request list</p>
        <ul className="relative z-[1] mt-6 space-y-4 text-sm leading-7">
          {totals.lines.map((line) => (
            <li key={`${line.productId}-${line.variantId}`}>
              {line.number} {line.name} · {line.sizeLabel} × {line.quantity}
              <span className="block text-ink/60">
                {line.line_paise === null ? "LAUNCHING SOON" : formatInrFromPaise(line.line_paise)}
              </span>
            </li>
          ))}
        </ul>
        <p className="relative z-[1] display mt-8 text-4xl">
          {totals.all_unpriced || totals.lines.length === 0 ? "To confirm" : formatInrFromPaise(totals.total_paise)}
        </p>
      </aside>
      <MobileCommerceBar />
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
