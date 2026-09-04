import Link from "next/link";
import { getAdminState } from "@/lib/admin/auth";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminLogout } from "@/components/admin/AdminLogout";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/quiz", label: "Quiz insights" },
  { href: "/admin/next-drop", label: "Next drop insights" },
  { href: "/admin/rewards", label: "Discount rewards" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const state = await getAdminState();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <AdminGate configured={state.configured} authenticated={state.authenticated}>
        <div className="border-b border-amber/40 bg-sand/40 px-6 py-3 text-sm">
          Device-local / preview. Production persistence needs a database. This is not a live operations console.
        </div>
        <div className="grid md:grid-cols-[220px_1fr]">
          <aside className="border-r border-ink/10 p-6">
            <p className="label text-forest">Admin preview</p>
            <nav className="mt-6 flex flex-col gap-3 text-sm">
              {LINKS.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <AdminLogout />
          </aside>
          <div className="p-8">{children}</div>
        </div>
      </AdminGate>
    </div>
  );
}
