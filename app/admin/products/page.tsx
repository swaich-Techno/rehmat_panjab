import { PRODUCTS } from "@/data/fragrance-config";
import { formatInrFromPaise } from "@/lib/commerce/money";

export default function AdminProductsPage() {
  return (
    <div>
      <p className="label text-forest">Products</p>
      <h1 className="display mt-3 text-5xl">Catalogue config</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-ink/70">
        Edit <code>data/fragrance-config.ts</code>. This table is read-only until a database exists.
      </p>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="label">
            <th className="py-3">No.</th>
            <th>Name</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map((product) => (
            <tr key={product.id} className="border-t border-ink/10">
              <td className="py-3">{product.number}</td>
              <td>{product.name}</td>
              <td>{product.status}</td>
              <td>{formatInrFromPaise(product.variants[0]?.price_paise)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
