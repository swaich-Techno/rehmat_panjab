import type { Metadata } from "next";
import { CreateFragranceFlow } from "@/components/quiz/CreateFragranceFlow";

export const metadata: Metadata = {
  title: "Create your Rehmat",
  description: "A nine-question preference vessel. Not a factory. Notes layer as colour. You leave with a portrait.",
  alternates: { canonical: "/create-your-fragrance" },
};

export default function CreateYourFragrancePage() {
  return <CreateFragranceFlow />;
}
