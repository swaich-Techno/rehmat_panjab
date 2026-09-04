import { ConfirmationCeremony } from "@/components/motion/ConfirmationCeremony";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConfirmationCeremony requestId={id} />;
}
