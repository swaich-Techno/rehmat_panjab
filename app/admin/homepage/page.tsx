import { HomepageCmsForm } from "@/components/admin/HomepageCmsForm";

export default function AdminHomepagePage() {
  return (
    <div>
      <p className="label text-forest">Homepage</p>
      <h1 className="display mt-3 text-5xl">CMS preview</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-ink/70">
        Featured, hero, coming-soon, and quiz CTA copy. This form does not silently pretend to publish.
      </p>
      <div className="mt-10">
        <HomepageCmsForm />
      </div>
    </div>
  );
}
