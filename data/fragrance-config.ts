/**
 * House catalogue — the single source of product truth until a database is connected.
 * Edit names, copy, notes, and prices here. Prices are INR paise integers.
 * `null` price means LAUNCHING SOON. Never invent a selling price.
 *
 * First five oils follow the Luxury Attar Collection product guide (PDF).
 * The PDF states no INR prices and no inventory — keep coming_soon + null paise.
 *
 * Scent profiles are editorial 0–10 readings of that guide’s notes and wear copy.
 * They are not laboratory scores. Do not present them as measured performance.
 */

export type ProductStatus =
  | "draft"
  | "coming_soon"
  | "active"
  | "sold_out"
  | "archived";

export type ScentProfile = {
  fresh: number;
  clean: number;
  warm: number;
  sweet: number;
  woody: number;
  dark: number;
  floral: number;
  musk: number;
  oud: number;
  amber: number;
  rose: number;
  vanilla: number;
  saffron: number;
  woods: number;
  spices: number;
  greens: number;
  longevity: number;
  projection: number;
};

export type SizeVariant = {
  id: string;
  label: string;
  ml: number;
  sku: string;
  price_paise: number | null;
  inventory: number;
};

export type ProductImage = {
  src: string;
  alt: string;
  placeholder: boolean;
};

export type Product = {
  id: string;
  slug: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  status: ProductStatus;
  images: ProductImage[];
  variants: SizeVariant[];
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  scent_profile: ScentProfile;
  occasion: string[];
  season: string[];
  featured: boolean;
  /** Working title still being written — mark clearly, never fake a finished oil. */
  development: boolean;
};

export type HouseConfig = {
  name: string;
  legalName: string;
  shortName: string;
  wornLine: string;
  wornLineSecond: string;
  finderLine: string;
  nextDropLine: string;
  oilLine: string;
  oilExplain: string;
  sizeGuide: Record<number, string>;
  currency: "INR";
  locale: string;
  checkoutEnabled: boolean;
  rewardsEnabled: boolean;
  showMostRequestedNote: boolean;
  sizesMl: number[];
  priceBandsPaise: { id: string; label: string; min: number | null; max: number | null }[];
  notePool: string[];
  families: string[];
};

export const HOUSE: HouseConfig = {
  name: "REHMAT PANJAB",
  legalName: "Rehmat Panjab",
  shortName: "Rehmat",
  wornLine: "MADE TO BE WORN.",
  wornLineSecond: "NOT ANNOUNCED.",
  finderLine: "Find what stays with you.",
  nextDropLine: "Help shape the next Rehmat.",
  oilLine: "Perfume oil, close to skin.",
  oilExplain:
    "A concentrated perfume oil is the juice without the alcohol cloud. A few drops on pulse, cloth, or hair — it sits on skin instead of filling a room.",
  sizeGuide: {
    6: "A close-to-skin ritual. A few drops at the wrist or throat — worn, not announced.",
    12: "The same oil, kept longer in the house.",
    24: "For skin that already knows this oil.",
  },
  currency: "INR",
  locale: "en-IN",
  checkoutEnabled: false,
  rewardsEnabled: true,
  showMostRequestedNote: false,
  sizesMl: [6, 12, 24],
  priceBandsPaise: [
    { id: "under-2k", label: "Under ₹2,000", min: 0, max: 200000 },
    { id: "2-4k", label: "₹2,000 – ₹4,000", min: 200000, max: 400000 },
    { id: "4-7k", label: "₹4,000 – ₹7,000", min: 400000, max: 700000 },
    { id: "open", label: "Whatever the oil asks", min: null, max: null },
  ],
  notePool: [
    "Musk",
    "Oud",
    "Amber",
    "Rose",
    "Vanilla",
    "Saffron",
    "Woods",
    "Spices",
    "Fresh greens",
    "Jasmine",
    "Incense",
    "Vetiver",
  ],
  families: [
    "Musk",
    "Woody",
    "Amber",
    "Floral",
    "Fresh",
    "Spiced",
    "Gourmand",
    "I do not know yet",
  ],
};

/** Shown on PDPs next to 0–10 character rows. Not a lab claim. */
export const SCENT_PROFILE_BASIS =
  "Editorial reading of the notes — not a laboratory score.";

/** Intrinsic size of the supplied campaign WebPs — used for CLS-safe next/image frames. */
export const CAMPAIGN_STILL_SIZE = { width: 1122, height: 1402 } as const;

const campaignStill = (slug: string, name: string): ProductImage => ({
  src: `/images/products/${slug}.webp`,
  alt: `Campaign still of ${name}`,
  placeholder: false,
});

const oilSizes = (prefix: string): SizeVariant[] =>
  HOUSE.sizesMl.map((ml) => ({
    id: `${prefix}-${ml}`,
    label: `${ml} ml`,
    ml,
    sku: `RP-${prefix.toUpperCase()}-${ml}`,
    price_paise: null,
    inventory: 0,
  }));

export const PRODUCTS: Product[] = [
  {
    id: "prod_01",
    slug: "musk-rizali",
    number: "01",
    name: "Musk Rizali",
    subtitle: "Luminous musky amber / clean woody musk",
    description:
      "A transparent musk illuminated by bergamot and saffron, then softened with polished woods and a smooth skin-like finish.",
    status: "coming_soon",
    images: [campaignStill("musk-rizali", "Musk Rizali")],
    variants: oilSizes("01"),
    notes: {
      top: ["Bergamot", "Saffron", "White Musk"],
      heart: ["Orris", "Jasmine", "Ambrette"],
      base: ["Sandalwood", "Soft Amber", "Cashmere Woods", "Clean Musk"],
    },
    scent_profile: {
      fresh: 6,
      clean: 9,
      warm: 6,
      sweet: 2,
      woody: 6,
      dark: 2,
      floral: 3,
      musk: 10,
      oud: 0,
      amber: 6,
      rose: 0,
      vanilla: 0,
      saffron: 6,
      woods: 6,
      spices: 4,
      greens: 1,
      longevity: 7,
      projection: 4,
    },
    occasion: ["everyday", "work", "evening"],
    season: ["all", "cool", "winter"],
    featured: true,
    development: false,
  },
  {
    id: "prod_02",
    slug: "vanilla-musk",
    number: "02",
    name: "Vanilla Musk",
    subtitle: "Gourmand musky amber / creamy woods",
    description:
      "Creamy vanilla and almond melt into soft musk, tonka and sandalwood for a warm, intimate gourmand with a polished finish.",
    status: "coming_soon",
    images: [campaignStill("vanilla-musk", "Vanilla Musk")],
    variants: oilSizes("02"),
    notes: {
      top: ["Vanilla Bean", "Almond", "White Musk"],
      heart: ["Heliotrope", "Jasmine", "Tonka Bean"],
      base: ["Benzoin", "Sandalwood", "Soft Amber", "Musk"],
    },
    scent_profile: {
      fresh: 2,
      clean: 5,
      warm: 9,
      sweet: 7,
      woody: 5,
      dark: 2,
      floral: 3,
      musk: 8,
      oud: 0,
      amber: 6,
      rose: 0,
      vanilla: 10,
      saffron: 0,
      woods: 5,
      spices: 1,
      greens: 0,
      longevity: 7,
      projection: 5,
    },
    occasion: ["evening", "date", "everyday"],
    season: ["cool", "winter"],
    featured: true,
    development: false,
  },
  {
    id: "prod_03",
    slug: "saffron-amber-oud",
    number: "03",
    name: "Saffron Amber Oud",
    subtitle: "Spiced amber oud / resinous woods",
    description:
      "Saffron and glowing amber open into dark oud, cedar and labdanum, finishing with benzoin, patchouli and a smooth suede-like warmth.",
    status: "coming_soon",
    images: [campaignStill("saffron-amber-oud", "Saffron Amber Oud")],
    variants: oilSizes("03"),
    notes: {
      top: ["Saffron", "Amber", "Oud"],
      heart: ["Labdanum", "Rose", "Cedarwood"],
      base: ["Oud Wood", "Benzoin", "Patchouli", "Suede Accord"],
    },
    scent_profile: {
      fresh: 1,
      clean: 2,
      warm: 10,
      sweet: 3,
      woody: 8,
      dark: 8,
      floral: 2,
      musk: 2,
      oud: 10,
      amber: 9,
      rose: 3,
      vanilla: 1,
      saffron: 10,
      woods: 8,
      spices: 8,
      greens: 0,
      longevity: 9,
      projection: 8,
    },
    occasion: ["evening", "special", "wedding"],
    season: ["cool", "winter"],
    featured: false,
    development: false,
  },
  {
    id: "prod_04",
    slug: "white-oud",
    number: "04",
    name: "White Oud",
    subtitle: "Citrus-spiced woods / soft oud",
    description:
      "A cleaner interpretation of oud: bergamot and white pepper over pale woods, iris and a smooth sandalwood-musk base.",
    status: "coming_soon",
    images: [campaignStill("white-oud", "White Oud")],
    variants: oilSizes("04"),
    notes: {
      top: ["White Pepper", "Bergamot", "Soft Woods"],
      heart: ["White Oud Accord", "Iris", "Cedar"],
      base: ["Sandalwood", "Clean Amber", "White Musk"],
    },
    scent_profile: {
      fresh: 7,
      clean: 8,
      warm: 5,
      sweet: 1,
      woody: 8,
      dark: 3,
      floral: 3,
      musk: 6,
      oud: 7,
      amber: 5,
      rose: 0,
      vanilla: 0,
      saffron: 0,
      woods: 8,
      spices: 6,
      greens: 2,
      longevity: 7,
      projection: 5,
    },
    occasion: ["work", "everyday", "evening"],
    season: ["all", "cool"],
    featured: false,
    development: false,
  },
  {
    id: "prod_05",
    slug: "oud-rose",
    number: "05",
    name: "Oud Rose",
    subtitle: "Fruity rose oud / floral amber woods",
    description:
      "A modern rose-oud pairing brightened by pink pepper and raspberry, then deepened with amber, sandalwood and soft musk.",
    status: "coming_soon",
    images: [campaignStill("oud-rose", "Oud Rose")],
    variants: oilSizes("05"),
    notes: {
      top: ["Rose Petals", "Pink Pepper", "Raspberry"],
      heart: ["Damask Rose", "Oud Accord", "Geranium"],
      base: ["Amber", "Sandalwood", "Patchouli", "Soft Musk"],
    },
    scent_profile: {
      fresh: 4,
      clean: 4,
      warm: 7,
      sweet: 5,
      woody: 6,
      dark: 5,
      floral: 9,
      musk: 5,
      oud: 7,
      amber: 7,
      rose: 10,
      vanilla: 0,
      saffron: 0,
      woods: 6,
      spices: 5,
      greens: 1,
      longevity: 8,
      projection: 7,
    },
    occasion: ["date", "wedding", "evening", "special"],
    season: ["cool", "winter"],
    featured: false,
    development: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getVariant(product: Product, variantId: string): SizeVariant | undefined {
  return product.variants.find((variant) => variant.id === variantId);
}

export function catalogUpdatedAt(): string {
  return "2026-09-04";
}

export function isPurchasable(product: Product, variant?: SizeVariant): boolean {
  if (product.status !== "active") return false;
  if (!variant) return product.variants.some((item) => item.price_paise !== null && item.inventory > 0);
  return variant.price_paise !== null && variant.inventory > 0;
}

export function displayPrice(variant: SizeVariant): "LAUNCHING SOON" | number {
  return variant.price_paise === null ? "LAUNCHING SOON" : variant.price_paise;
}

export function isDevelopmentProduct(product: Product): boolean {
  return product.development === true;
}

export function pricesArePublished(product: Product): boolean {
  return product.variants.some((variant) => variant.price_paise !== null);
}
