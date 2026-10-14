import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { countryToLocale, GEO_COOKIE } from "@/lib/geo";

// Vercel adds the visitor's country to every request. Save the matching language in a cookie
// so the page can pick it up on first load. A language chosen by the visitor always wins.
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const locale = countryToLocale(request.headers.get("x-vercel-ip-country"));
  if (locale && request.cookies.get(GEO_COOKIE)?.value !== locale) {
    response.cookies.set(GEO_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  }
  return response;
}

export const config = { matcher: "/" };
