import { describe, expect, it } from "vitest";
import { signAdminSession, verifyAdminSession, ADMIN_MAX_AGE_MS } from "@/lib/admin/auth";

describe("admin session timestamp", () => {
  it("rejects tokens without a matching signature", () => {
    process.env.ADMIN_PREVIEW_KEY = "test-admin-key-ok";
    expect(verifyAdminSession("not-a-token")).toBe(false);
    expect(verifyAdminSession(undefined)).toBe(false);
  });

  it("accepts a freshly signed session when the key is set", () => {
    process.env.ADMIN_PREVIEW_KEY = "test-admin-key-ok";
    const token = signAdminSession();
    expect(verifyAdminSession(token)).toBe(true);
  });

  it("exports a finite max-age", () => {
    expect(ADMIN_MAX_AGE_MS).toBe(1000 * 60 * 60 * 12);
  });
});
