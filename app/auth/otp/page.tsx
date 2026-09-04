import type { Metadata } from "next";
import { OtpVerify } from "@/components/auth/OtpVerify";

export const metadata: Metadata = {
  title: "Phone verification",
  description: "Six-digit phone verification. Unavailable until SMS is connected.",
  alternates: { canonical: "/auth/otp" },
};

export default function OtpPage() {
  return <OtpVerify />;
}
