import type { Metadata } from "next";
import { CollectionCompositions } from "@/components/product/CollectionCompositions";
import { PageIntro } from "@/components/ui/PageIntro";
import { CollectionTracker } from "@/components/product/CollectionTracker";

export const metadata: Metadata = {
  title: "Collection",
  description: "The Rehmat Panjab catalogue. Concentrated perfume oils. Prices appear when they are real.",
  alternates: { canonical: "/collection" },
};

export default function CollectionPage() {
  return (
    <div>
      <CollectionTracker />
      <PageIntro
        kicker="The catalogue"
        title={"Five numbers.\nOne finished name."}
        body="Musk Rizali is written. Numbers 02–05 keep working titles — in development, marked as such. No invented prices. Concentrated perfume oil: a few drops on skin, not a spray that fills a room."
      />
      <CollectionCompositions />
    </div>
  );
}
