import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactForm } from "@/components/brand/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to Rehmat Panjab. The house will confirm — no invented address or phone.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div>
      <PageIntro
        kicker="Contact"
        title={"Write to the house."}
        body="No street address is published yet. Leave a note. We will confirm how to reach you — we will not invent a showroom, a phone, or a reply time."
      />
      <section className="site-grid section-pad-tight">
        <div className="col-span-12 md:col-span-6">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
