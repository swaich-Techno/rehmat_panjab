import type { Metadata } from "next";
import Link from "next/link";
import { HOUSE } from "@/data/fragrance-config";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Honest answers about concentrated perfume oil, requests, and the house — no invented prices or stock.",
  alternates: { canonical: "/faq" },
};

const ITEMS = [
  {
    q: "What is a concentrated perfume oil?",
    a: HOUSE.oilExplain,
  },
  {
    q: "Why is there no price?",
    a: "Prices appear when they are real. Until then the catalogue says launching soon. We will not invent an INR figure to look open.",
  },
  {
    q: "If I tap Request or Hold this oil, have I bought it?",
    a: "No. Checkout is a request. The house confirms. Nothing on this site charges a card.",
  },
  {
    q: "What does 6 ml mean?",
    a: HOUSE.sizeGuide[6],
  },
  {
    q: "What is the 5% thank-you?",
    a: "If you vote on the next Rehmat and a code is issued, it is locked at five percent. It applies when prices exist and the email matches. You cannot type a larger percent.",
  },
  {
    q: "Where are you?",
    a: "A street address is not published yet. Contact the house through the contact page. We will confirm how to reach us — we will not invent a showroom.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <PageIntro kicker="FAQ" title={"Ask the house.\nWe will not invent."} />
      <section className="site-grid section-pad-tight">
        <dl className="col-span-12 max-w-2xl space-y-10 md:col-span-8">
          {ITEMS.map((item) => (
            <div key={item.q} className="border-t border-ink/10 pt-5">
              <dt className="display text-3xl md:text-4xl">{item.q}</dt>
              <dd className="mt-3 text-base leading-7 text-ink/75">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="col-span-12 mt-10 text-sm text-ink/60">
          Still a question? <Link href="/contact">Write to the house</Link>.
        </p>
      </section>
    </div>
  );
}
