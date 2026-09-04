"use client";

import { useState } from "react";
import { VaultDoor } from "@/components/motion/VaultDoor";
import { Field } from "@/components/ui/Field";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <VaultDoor
      title="Recover the key"
      submitLabel="Continue"
      onSubmit={async () => {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email }),
        });
        return (await response.json()) as { ok: boolean; message: string };
      }}
    >
      <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    </VaultDoor>
  );
}
