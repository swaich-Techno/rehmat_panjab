import type { Metadata } from "next";
import { HOUSE } from "@/data/fragrance-config";
import { NextDropFlow } from "@/components/quiz/NextDropFlow";

export const metadata: Metadata = {
  title: "Next Rehmat",
  description: HOUSE.nextDropLine,
  alternates: { canonical: "/next-drop" },
};

export default function NextDropPage() {
  return (
    <div>
      <div className="site-grid py-12">
        <p className="col-span-12 label text-forest">Help shape the next Rehmat</p>
        <p className="col-span-12 mt-4 max-w-lg text-base leading-8 text-ink/75">
          A vote, not a marketing survey. Finish it honestly and the house thanks you with five percent — issued by the server, once per email.
        </p>
      </div>
      <NextDropFlow />
    </div>
  );
}
