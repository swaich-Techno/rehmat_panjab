import { applyDiscount, multiplyPaise, sumPaise } from "@/lib/commerce/money";
import { getProductById, getVariant, type Product, type SizeVariant } from "@/data/fragrance-config";

export type CartLineInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type ValidatedLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  number: string;
  sizeLabel: string;
  quantity: number;
  unit_paise: number | null;
  line_paise: number | null;
  status: Product["status"];
  available: boolean;
  reason?: "launching_soon" | "sold_out" | "unavailable" | "unknown" | "invalid_qty";
  image: string;
};

export type CartTotals = {
  lines: ValidatedLine[];
  priced_subtotal_paise: number;
  unpriced_count: number;
  item_count: number;
  discount_percent: number;
  discount_paise: number;
  total_paise: number;
  all_unpriced: boolean;
};

export function normalizeQuantity(quantity: unknown): number | null {
  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 12) {
    return null;
  }
  return quantity;
}

export function validateLine(input: CartLineInput, catalog: Product[] = []): ValidatedLine {
  const product = getProductById(input.productId) ?? catalog.find((item) => item.id === input.productId);
  const quantity = normalizeQuantity(input.quantity);
  if (!product) {
    return {
      productId: input.productId,
      variantId: input.variantId,
      slug: "",
      name: "Unknown oil",
      number: "—",
      sizeLabel: "",
      quantity: quantity ?? 0,
      unit_paise: null,
      line_paise: null,
      status: "archived",
      available: false,
      reason: "unknown",
      image: "/images/placeholders/bottle-01.svg",
    };
  }
  const variant: SizeVariant | undefined = getVariant(product, input.variantId);
  if (!variant || quantity === null) {
    return {
      productId: product.id,
      variantId: input.variantId,
      slug: product.slug,
      name: product.name,
      number: product.number,
      sizeLabel: variant?.label ?? "",
      quantity: quantity ?? 0,
      unit_paise: variant?.price_paise ?? null,
      line_paise: null,
      status: product.status,
      available: false,
      reason: quantity === null ? "invalid_qty" : "unknown",
      image: product.images[0]?.src ?? "/images/placeholders/bottle-01.svg",
    };
  }

  if (product.status === "sold_out" || variant.inventory === 0 && product.status === "active") {
    return {
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      number: product.number,
      sizeLabel: variant.label,
      quantity,
      unit_paise: variant.price_paise,
      line_paise: variant.price_paise === null ? null : multiplyPaise(variant.price_paise, quantity),
      status: product.status,
      available: false,
      reason: "sold_out",
      image: product.images[0]?.src ?? "/images/placeholders/bottle-01.svg",
    };
  }

  if (product.status !== "active" || variant.price_paise === null) {
    return {
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      number: product.number,
      sizeLabel: variant.label,
      quantity,
      unit_paise: null,
      line_paise: null,
      status: product.status,
      available: false,
      reason: "launching_soon",
      image: product.images[0]?.src ?? "/images/placeholders/bottle-01.svg",
    };
  }

  return {
    productId: product.id,
    variantId: variant.id,
    slug: product.slug,
    name: product.name,
    number: product.number,
    sizeLabel: variant.label,
    quantity,
    unit_paise: variant.price_paise,
    line_paise: multiplyPaise(variant.price_paise, quantity),
    status: product.status,
    available: true,
    image: product.images[0]?.src ?? "/images/placeholders/bottle-01.svg",
  };
}

export function calculateCart(
  inputs: CartLineInput[],
  discountPercent = 0,
): CartTotals {
  const lines = inputs.map((input) => validateLine(input));
  const priced = lines
    .filter((line) => line.line_paise !== null)
    .map((line) => line.line_paise as number);
  const priced_subtotal_paise = sumPaise(priced);
  const unpriced_count = lines.filter((line) => line.line_paise === null).length;
  const item_count = lines.reduce((count, line) => count + (line.quantity || 0), 0);
  const safePercent = discountPercent === 5 ? 5 : 0;
  const { discount, total } = applyDiscount(priced_subtotal_paise, safePercent);
  return {
    lines,
    priced_subtotal_paise,
    unpriced_count,
    item_count,
    discount_percent: safePercent,
    discount_paise: discount,
    total_paise: total,
    all_unpriced: lines.length > 0 && priced.length === 0,
  };
}
