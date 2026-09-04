import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminOrdersPage() {
  return (
    <EmptyState
      kicker="Orders"
      title="No server order book."
      body="Manual requests live on the customer’s device. Connect a database before treating this as operations."
    />
  );
}
