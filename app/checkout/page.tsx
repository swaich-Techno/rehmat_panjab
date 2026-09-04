"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/commerce/CartProvider";
import { Field, AreaField } from "@/components/ui/Field";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { formatInrFromPaise } from "@/lib/commerce/money";
import { track } from "@/lib/analytics/index";
import { LOCAL_ORDERS_KEY } from "@/lib/insights/store";

export default function CheckoutPage() {
  const { totals, cart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  useEffect(() => {
    track({ name: "checkout_started", path: "/checkout" });
  }, []);

  async function submit(channel: "manual" | "whatsapp") {
    setLoading(true);
    setError("");
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
      setError(data.message ?? "The request could not be written.");
      return;
    }
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
    <div className="site-grid py-16">
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
          {error ? <p className="text-sm text-wine">{error}</p> : null}
          <div className="flex flex-col gap-3">
            <LiquidButton loading={loading} disabled={totals.lines.length === 0} onClick={() => void submit("manual")}>
              Confirm request
            </LiquidButton>
            <LiquidButton loading={loading} disabled={totals.lines.length === 0} onClick={() => void submit("whatsapp")}>
              Request on WhatsApp
            </LiquidButton>
          </div>
          {whatsapp ? (
            <a href={whatsapp} className="label">
              Open WhatsApp again
            </a>
          ) : null}
        </form>
      </div>
      <aside className="col-span-12 mt-16 bg-paper p-8 md:col-span-4 md:col-start-9">
        <p className="label">Request list</p>
        <ul className="mt-6 space-y-4 text-sm leading-7">
          {totals.lines.map((line) => (
            <li key={`${line.productId}-${line.variantId}`}>
              {line.number} {line.name} · {line.sizeLabel} × {line.quantity}
              <span className="block text-ink/60">
                {line.line_paise === null ? "LAUNCHING SOON" : formatInrFromPaise(line.line_paise)}
              </span>
            </li>
          ))}
        </ul>
        <p className="display mt-8 text-4xl">
          {totals.all_unpriced || totals.lines.length === 0 ? "To confirm" : formatInrFromPaise(totals.total_paise)}
        </p>
      </aside>
    </div>
  );
}
