import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/fragrance-config";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/collection",
    "/find-your-scent",
    "/next-drop",
    "/cart",
    "/checkout",
    "/auth/login",
    "/auth/register",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl()}${path}`,
      lastModified: now,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${siteUrl()}/product/${product.slug}`,
      lastModified: now,
    })),
  ];
}
