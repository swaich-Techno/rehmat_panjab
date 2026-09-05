import { randomBytes } from "node:crypto";

export type OrderKind = "request" | "waitlist";

export function createRequestId(): string {
  const body = randomBytes(3).toString("hex").toUpperCase();
  return `RP${body}`;
}

/**
 * Razorpay is not connected.
 * Future charge flow (do not implement until keys and legal checkout exist):
 * 1. Server creates an order via Razorpay Orders API using RAZORPAY_KEY_SECRET
 * 2. Client opens Checkout with RAZORPAY_KEY_ID and the server order id
 * 3. Webhook RAZORPAY_WEBHOOK_SECRET marks the order paid
 * Never trust client-side "payment success" callbacks alone.
 */
export type FutureRazorpayOrder = {
  provider: "razorpay";
  razorpay_order_id: string;
  amount_paise: number;
  currency: "INR";
  receipt: string;
};
