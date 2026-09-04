import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

const LINKS = [
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/saved", label: "Saved fragrances" },
  { href: "/account/quiz", label: "Quiz results" },
  { href: "/account/rewards", label: "Discount rewards" },
  { href: "/account/votes", label: "Launch votes" },
];

export default function AccountPage() {
  return (
    <div className="site-grid py-16">
      <div className="col-span-12 md:col-span-7">
        <EmptyState
          kicker="Private house"
          title="The archive is local for now."
          body="Without an account service, this page reads only what this browser has kept. Nothing here is a logged-in session."
        />
      </div>
      <ul className="col-span-12 mt-4 md:col-span-4 md:col-start-9">
        {LINKS.map((item) => (
          <li key={item.href} className="border-t border-ink/10">
            <Link href={item.href} className="display block py-5 text-4xl no-underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
