"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { LOCAL_ORDERS_KEY } from "@/lib/insights/store";
import { EMPTY_ORDERS } from "@/lib/insights/fallbacks";
import { useLocalJson } from "@/lib/storage/local-json";

type LocalOrder = { id: string; at: number; channel: string };

export default function AccountOrdersPage() {
  const orders = useLocalJson<LocalOrder[]>(LOCAL_ORDERS_KEY, EMPTY_ORDERS);

  return (
    <div className="site-grid py-16">
      <div className="col-span-12">
        <EmptyState
          kicker="Orders"
          title="Requests on this device"
          body="These are manual requests stored in the browser. They are not paid orders and they are not synced to a server archive."
        />
        {orders.length === 0 ? (
          <p className="text-sm text-ink/60">No local requests yet.</p>
        ) : (
          <ul className="mt-8 max-w-xl">
            {orders.map((order) => (
              <li key={order.id} className="border-t border-ink/10 py-4">
                <Link href={`/order/${order.id}`} className="display text-3xl no-underline">
                  #{order.id}
                </Link>
                <p className="text-sm text-ink/60">{order.channel} · {new Date(order.at).toLocaleString("en-IN")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
