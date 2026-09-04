"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/index";

export function CollectionTracker() {
  useEffect(() => {
    track({ name: "collection_view", path: "/collection" });
  }, []);
  return null;
}
