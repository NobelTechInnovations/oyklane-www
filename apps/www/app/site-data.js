import { API_URL } from "./components/site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://oyklane.com").replace(/\/$/, "");

// What the site says about itself when Super admin ▸ Website is empty.
export const SITE_DEFAULTS = {
  title: "oyklane — premium online stores for Indian brands",
  description: "Launch an online store with premium themes, One-Click Checkout, UPI and cash on delivery, shipping and GST invoices — on plans that cost less. Free trial, no card needed.",
  keywords: ["ecommerce website builder India", "online store builder", "create online store India", "one-click checkout", "UPI and COD store", "D2C ecommerce platform", "Shopify alternative India"],
  ogImage: "/og.png",
  reviews: [],
  showcase: [],
};

/** Super admin ▸ Website, live: the title, description, keywords, share
 * image, home page reviews and the store showcase. Falls back to the
 * defaults when the API is slow or down. */
export async function getSite() {
  try {
    const res = await fetch(`${API_URL}/api/auth/site`, { cache: "no-store", signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error(String(res.status));
    const s = await res.json();
    return {
      title: s.title || SITE_DEFAULTS.title,
      description: s.description || SITE_DEFAULTS.description,
      keywords: s.keywords?.length ? s.keywords : SITE_DEFAULTS.keywords,
      ogImage: s.ogImage || SITE_DEFAULTS.ogImage,
      reviews: Array.isArray(s.reviews) ? s.reviews : [],
      showcase: Array.isArray(s.showcase) ? s.showcase : [],
    };
  } catch {
    return SITE_DEFAULTS;
  }
}
