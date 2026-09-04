import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-rehmat-house", "preview");
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("cache-control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
