import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminQuizPage() {
  return (
    <EmptyState
      kicker="Quiz insights"
      title="Anonymous results stay on devices."
      body="This preview has no quiz warehouse. Production needs a table without PII if you want house-wide scoring insights."
    />
  );
}
