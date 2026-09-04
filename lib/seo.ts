import type { Metadata } from "next";
import { HOUSE, type Product } from "@/data/fragrance-config";
import { formatInrFromPaise } from "@/lib/commerce/money";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function defaultMetadata(): Metadata {
  const title = `${HOUSE.name} — Perfume oil, close to skin`;
  const description =
    "Concentrated perfume oils from Rehmat Panjab. Made to be worn, not announced. Catalogue launching soon.";
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: `%s — ${HOUSE.name}`,
    },
    description,
    applicationName: HOUSE.name,
    authors: [{ name: HOUSE.legalName }],
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: HOUSE.name,
      title,
      description,
      url: siteUrl(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: siteUrl(),
    },
  };
}

export function productJsonLd(product: Product) {
  const firstPriced = product.variants.find((variant) => variant.price_paise !== null);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.variants[0]?.sku,
    brand: {
      "@type": "Brand",
      name: HOUSE.name,
    },
    image: product.images.map((image) => absoluteUrl(image.src)),
    ...(firstPriced
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: (firstPriced.price_paise as number) / 100,
            availability:
              product.status === "active"
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
            url: absoluteUrl(`/product/${product.slug}`),
          },
        }
      : {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            availability: "https://schema.org/PreOrder",
            url: absoluteUrl(`/product/${product.slug}`),
          },
        }),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: HOUSE.name,
    url: siteUrl(),
    brand: HOUSE.name,
    description: HOUSE.oilLine,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productMetaTitle(product: Product): string {
  const price = product.variants[0] ? formatInrFromPaise(product.variants[0].price_paise) : "LAUNCHING SOON";
  return `${product.number} ${product.name} · ${price === "LAUNCHING SOON" ? "Launching soon" : price}`;
}
