import { EmptyState } from "@/components/ui/EmptyState";

export default function ProfilePage() {
  return (
    <div className="site-grid py-16">
      <div className="col-span-12 md:col-span-8">
        <EmptyState
          kicker="Profile"
          title="No house profile yet."
          body="When the archive is connected, name, email, and verification will live here. Today the door is closed on purpose."
        />
      </div>
    </div>
  );
}
