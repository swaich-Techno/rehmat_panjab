import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Shipping",
  description: "How Rehmat Panjab packs and sends oils — confirmed by the house, never invented on this page.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div>
      <PageIntro
        kicker="Shipping"
        title={"Packed when the house\ncan confirm it."}
        body="Rates, carriers, and timing are not published yet. A request is not a dispatch."
      />
      <section className="site-grid section-pad-tight">
        <div className="col-span-12 max-w-xl space-y-6 text-base leading-7 text-ink/80 md:col-span-7">
          <p>
            When you request an oil, the house writes back with packing, the carrier they will actually use, and
            a timing they can keep. This page will not invent delivery days or rupee rates.
          </p>
          <p>
            Perfume oil is small and close. We pack glass as glass — not as a story about overnight magic.
          </p>
          <p>
            If a request cannot ship yet (launching soon, no price, or the juice is still being written), we will
            say so before anything leaves.
          </p>
        </div>
      </section>
    </div>
  );
}
