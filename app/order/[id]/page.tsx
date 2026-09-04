import { cookies } from "next/headers";
import { ConfirmationCeremony } from "@/components/motion/ConfirmationCeremony";
import { EmptyState } from "@/components/ui/EmptyState";
import { REQUEST_COOKIE, canViewRequest, getCheckoutRequest } from "@/lib/commerce/request-store";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jar = await cookies();
  const token = jar.get(REQUEST_COOKIE)?.value;
  const record = getCheckoutRequest(id);
  const allowed = canViewRequest(id, token);

  if (!allowed) {
    return (
      <div className="site-grid py-20">
        <div className="col-span-12 md:col-span-8">
          <EmptyState
            kicker="Request"
            title="This request is not on this shelf."
            body="The confirmation only opens after a successful request from checkout. A guessed address will not invent an order."
          />
        </div>
      </div>
    );
  }

  return (
    <ConfirmationCeremony
      requestId={record?.id ?? id}
    />
  );
}
