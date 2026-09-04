"use client";

import Link from "next/link";
import { useState } from "react";
import { VaultDoor } from "@/components/motion/VaultDoor";
import { Field } from "@/components/ui/Field";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <VaultDoor
      title="Ask for a key"
      submitLabel="Enter the house"
      onSubmit={async () => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        return (await response.json()) as { ok: boolean; message: string };
      }}
    >
      <Field label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
      <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <Link href="/auth/login" className="text-sm">
        Already have a door?
      </Link>
    </VaultDoor>
  );
}
