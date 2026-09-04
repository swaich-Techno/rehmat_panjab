/**
 * House catalogue — the single source of product truth until a database is connected.
 * Edit names, copy, notes, and prices here. Prices are INR paise integers.
 * `null` price means LAUNCHING SOON. Never invent a selling price.
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

const placeholder = (file: string, alt: string): ProductImage => ({
  src: `/images/placeholders/${file}`,
  alt: `${alt} — placeholder composition, not a photograph`,
  placeholder: true,
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
    subtitle: "A quiet musk, held close.",
    description:
      "Musk Rizali sits on skin the way heat sits on a courtyard after the sun has gone. Soft, animal, a little sweet. Not a cloud. A presence you notice when someone leans in.",
    status: "coming_soon",
    images: [
      placeholder("bottle-01.svg", "Musk Rizali bottle silhouette"),
      placeholder("oil-veil.svg", "Translucent perfume oil"),
      placeholder("origin-paper.svg", "Paper and morning light"),
    ],
    variants: oilSizes("01"),
    notes: {
      top: ["White musk", "Cool air"],
      heart: ["Rizali musk", "Soft amber"],
      base: ["Clean woods", "Skin"],
    },
    scent_profile: {
      fresh: 4,
      clean: 7,
      warm: 6,
      sweet: 3,
      woody: 5,
      dark: 3,
      floral: 2,
      musk: 10,
      oud: 2,
      amber: 6,
      rose: 1,
      vanilla: 2,
      saffron: 1,
      woods: 5,
      spices: 2,
      greens: 2,
      longevity: 8,
      projection: 4,
    },
    occasion: ["everyday", "work", "evening"],
    season: ["all", "cool", "winter"],
    featured: true,
    development: false,
  },
  {
    id: "prod_02",
    slug: "product-two",
    number: "02",
    name: "Product Two",
    subtitle: "Working title. Not the final name.",
    description:
      "A second oil is being written. The name is not ready. The character leans floral and rose — that is all we will say until the juice is honest.",
    status: "coming_soon",
    images: [
      placeholder("bottle-02.svg", "Product Two bottle silhouette"),
      placeholder("note-rose.svg", "Rose metal still life"),
    ],
    variants: oilSizes("02"),
    notes: {
      top: ["Dew", "Pink petal"],
      heart: ["Rose", "Soft spice"],
      base: ["Musk", "Sandal"],
    },
    scent_profile: {
      fresh: 5,
      clean: 5,
      warm: 5,
      sweet: 5,
      woody: 3,
      dark: 2,
      floral: 9,
      musk: 5,
      oud: 1,
      amber: 3,
      rose: 9,
      vanilla: 3,
      saffron: 2,
      woods: 3,
      spices: 3,
      greens: 4,
      longevity: 7,
      projection: 5,
    },
    occasion: ["date", "wedding", "special"],
    season: ["warm", "hot", "all"],
    featured: false,
    development: true,
  },
  {
    id: "prod_03",
    slug: "product-three",
    number: "03",
    name: "Product Three",
    subtitle: "Working title. Not the final name.",
    description:
      "Woods first. Then the darker air that follows rain on bark. This one is still a sketch — the number is reserved.",
    status: "coming_soon",
    images: [
      placeholder("bottle-03.svg", "Product Three bottle silhouette"),
      placeholder("origin-wood.svg", "Wood grain and metal"),
    ],
    variants: oilSizes("03"),
    notes: {
      top: ["Crushed leaf", "Smoke air"],
      heart: ["Cedar", "Oud whisper"],
      base: ["Vetiver", "Dry amber"],
    },
    scent_profile: {
      fresh: 3,
      clean: 3,
      warm: 6,
      sweet: 2,
      woody: 9,
      dark: 7,
      floral: 1,
      musk: 4,
      oud: 7,
      amber: 5,
      rose: 0,
      vanilla: 1,
      saffron: 3,
      woods: 9,
      spices: 5,
      greens: 4,
      longevity: 9,
      projection: 6,
    },
    occasion: ["evening", "work", "special"],
    season: ["cool", "winter"],
    featured: false,
    development: true,
  },
  {
    id: "prod_04",
    slug: "product-four",
    number: "04",
    name: "Product Four",
    subtitle: "Working title. Not the final name.",
    description:
      "A brighter oil is being considered — greens, a washed morning, something that opens a room without raising its voice.",
    status: "coming_soon",
    images: [
      placeholder("bottle-04.svg", "Product Four bottle silhouette"),
      placeholder("origin-grass.svg", "Grass and mist"),
    ],
    variants: oilSizes("04"),
    notes: {
      top: ["Cut grass", "Cool stem"],
      heart: ["Green tea leaf", "White flower"],
      base: ["Clean musk", "Pale wood"],
    },
    scent_profile: {
      fresh: 9,
      clean: 8,
      warm: 2,
      sweet: 2,
      woody: 3,
      dark: 1,
      floral: 4,
      musk: 4,
      oud: 0,
      amber: 1,
      rose: 2,
      vanilla: 1,
      saffron: 0,
      woods: 3,
      spices: 1,
      greens: 9,
      longevity: 6,
      projection: 5,
    },
    occasion: ["everyday", "work"],
    season: ["hot", "warm", "all"],
    featured: false,
    development: true,
  },
  {
    id: "prod_05",
    slug: "product-five",
    number: "05",
    name: "Product Five",
    subtitle: "Working title. Not the final name.",
    description:
      "Warmth with a spice edge. Saffron thread, a vanilla that is not dessert, amber that feels like metal left in the sun.",
    status: "coming_soon",
    images: [
      placeholder("bottle-05.svg", "Product Five bottle silhouette"),
      placeholder("note-amber.svg", "Amber glow still life"),
    ],
    variants: oilSizes("05"),
    notes: {
      top: ["Saffron", "Warm air"],
      heart: ["Amber", "Soft spice"],
      base: ["Vanilla husk", "Resin"],
    },
    scent_profile: {
      fresh: 2,
      clean: 3,
      warm: 9,
      sweet: 7,
      woody: 4,
      dark: 5,
      floral: 2,
      musk: 3,
      oud: 3,
      amber: 9,
      rose: 2,
      vanilla: 8,
      saffron: 8,
      woods: 4,
      spices: 7,
      greens: 1,
      longevity: 8,
      projection: 7,
    },
    occasion: ["date", "wedding", "evening", "special"],
    season: ["cool", "winter", "all"],
    featured: false,
    development: true,
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
