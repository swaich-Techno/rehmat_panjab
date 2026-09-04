import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/fragrance-config";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/collection",
    "/find-your-scent",
    "/create-your-fragrance",
    "/next-drop",
    "/our-story",
    "/cart",
    "/checkout",
    "/auth/login",
    "/auth/register",
    "/auth/otp",
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
