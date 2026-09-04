import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductBySlug } from "@/data/fragrance-config";
import { ProductView } from "@/components/product/ProductView";
import { breadcrumbJsonLd, productJsonLd, productMetaTitle, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Oil not found" };
  return {
    title: productMetaTitle(product),
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.number} ${product.name}`,
      description: product.subtitle,
      url: absoluteUrl(`/product/${product.slug}`),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Collection", path: "/collection" },
              { name: product.name, path: `/product/${product.slug}` },
            ]),
          ),
        }}
      />
      <ProductView product={product} />
    </>
  );
}
