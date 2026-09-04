"use client";

import { useState } from "react";
import { Field, AreaField } from "@/components/ui/Field";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { WhatsAppNote } from "@/components/brand/WhatsAppNote";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <Field label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
      <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <AreaField label="Note" rows={5} value={note} onChange={(event) => setNote(event.target.value)} required />
      <LiquidButton liquid="water" type="submit">
        Send to the house
      </LiquidButton>
      {sent ? (
        <p className="text-sm leading-7 text-forest" role="status">
          Held on this device only. The house is not connected yet, so nothing was emailed. When the archive is
          wired, a note like this will be confirmed — not auto-replied with a fake address.
        </p>
      ) : (
        <p className="text-sm leading-7 text-ink/60">
          Until the house is connected, this form keeps the words on your device. It does not pretend to send.
        </p>
      )}
      <WhatsAppNote />
    </form>
  );
}
