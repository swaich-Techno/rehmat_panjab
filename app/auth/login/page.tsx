"use client";

import Link from "next/link";
import { useState } from "react";
import { VaultDoor } from "@/components/motion/VaultDoor";
import { Field } from "@/components/ui/Field";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <VaultDoor
      title="Enter the house"
      submitLabel="Enter the house"
      onSubmit={async () => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = (await response.json()) as { ok: boolean; message: string };
        return data;
      }}
    >
      <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <div className="flex justify-between text-sm">
        <Link href="/auth/register">Register</Link>
        <Link href="/auth/forgot-password">Forgot password</Link>
      </div>
      <Link href="/auth/otp" className="text-sm">
        Phone code
      </Link>
    </VaultDoor>
  );
}
