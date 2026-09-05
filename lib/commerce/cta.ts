import { pricesArePublished, type Product } from "@/data/fragrance-config";

/** Labels while catalogue prices are still null. Never invent a buy. */
export function holdLabel(priced: boolean): string {
  return priced ? "Add to cart" : "Hold this oil";
}

export function requestLabel(priced: boolean): string {
  return priced ? "Buy now" : "Request";
}

export function productIsPriced(product: Product): boolean {
  return pricesArePublished(product);
}

export function variantIsPriced(paise: number | null | undefined): boolean {
  return typeof paise === "number";
}
