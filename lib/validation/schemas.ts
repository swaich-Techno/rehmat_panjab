import { z } from "zod";
import { HOUSE } from "@/data/fragrance-config";

export const emailSchema = z.email("Enter a real email address.").trim().toLowerCase();

export const passwordSchema = z
  .string()
  .min(10, "At least ten characters.")
  .max(128, "Too long.");

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(12),
});

export const cartValidateSchema = z.object({
  lines: z.array(cartLineSchema).max(24),
  rewardToken: z.string().optional(),
  rewardEmail: emailSchema.optional(),
  requestedDiscountPercent: z.number().int().min(0).max(100).optional(),
});

export const checkoutRequestSchema = z.object({
  lines: z.array(cartLineSchema).min(1).max(24),
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  phone: z.string().trim().min(8).max(20),
  note: z.string().trim().max(400).optional(),
  channel: z.enum(["whatsapp", "manual"]),
  rewardToken: z.string().optional(),
});

export const quizAnswersSchema = z.object({
  feel: z.string().min(1),
  when: z.string().min(1),
  projection: z.string().min(1),
  notes: z.string().min(1),
  personality: z.string().min(1),
  weather: z.string().min(1),
});

export const nextDropSchema = z.object({
  family: z.string().min(1),
  notes: z.array(z.string().min(1)).min(1).max(3),
  feel: z.string().min(1),
  projection: z.string().min(1),
  occasion: z.string().min(1),
  format: z.enum(["perfume_oil", "either", "spray_later"]),
  size: z.string().min(1),
  priceBand: z.string().min(1),
  email: emailSchema,
});

export const launchNotifySchema = z.object({
  email: emailSchema.optional(),
  phone: z.string().trim().min(8).max(20).optional(),
  notifyEmail: z.boolean().default(false),
  notifySms: z.boolean().default(false),
  campaign: z.string().min(1).max(80).default("next-rehmat-001"),
});

export const createFragranceSchema = z.object({
  answers: z.record(z.string(), z.string()),
  notes: z.array(z.string().min(1)).max(12),
  name: z.string().trim().max(80).optional(),
  email: emailSchema.optional(),
  phone: z.string().trim().max(20).optional(),
  formulaPercent: z.never().optional(),
});

export const authCredentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = authCredentialsSchema.extend({
  name: z.string().trim().min(2).max(80),
});

export const forgotSchema = z.object({
  email: emailSchema,
});

export const adminLoginSchema = z.object({
  key: z.string().min(8).max(200),
});

export const rewardValidateSchema = z.object({
  token: z.string().min(10),
  email: emailSchema,
  code: z.string().optional(),
  requestedPercent: z.number().int().optional(),
});

export const analyticsEventSchema = z.object({
  name: z.enum([
    "hero_view",
    "collection_view",
    "product_view",
    "quiz_started",
    "quiz_completed",
    "quiz_result",
    "next_drop_started",
    "next_drop_completed",
    "discount_issued",
    "add_to_cart",
    "buy_now",
    "checkout_started",
    "order_confirmed",
    "create_fragrance_saved",
    "notify_opt_in",
  ]),
  path: z.string().max(200).optional(),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export function assertKnownPriceBand(id: string): boolean {
  return HOUSE.priceBandsPaise.some((band) => band.id === id);
}

export function assertKnownNote(note: string): boolean {
  return HOUSE.notePool.includes(note);
}
