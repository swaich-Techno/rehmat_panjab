"use client";

import { useRouter } from "next/navigation";

export function AdminLogout() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="label mt-8"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
        router.refresh();
      }}
    >
      Close
    </button>
  );
}
