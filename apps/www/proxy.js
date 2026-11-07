import { NextResponse } from "next/server";

/**
 * One address for the website. A visit to the hosting provider's own
 * address (*.vercel.app) or to the other form of the domain (with or
 * without www) is sent to the main one, so search results and shared links
 * only ever show it.
 */
const SITE = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://oyklane.com");
  } catch {
    return new URL("https://oyklane.com");
  }
})();
const bare = (h) => h.replace(/^www\./, "");

export function proxy(request) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  if (!host || host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost")) return NextResponse.next();
  const elsewhere = host.endsWith(".vercel.app") || (host !== SITE.hostname && bare(host) === bare(SITE.hostname));
  if (!elsewhere) return NextResponse.next();
  const url = new URL(request.nextUrl.pathname + request.nextUrl.search, SITE.origin);
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/|api/).*)"],
};
