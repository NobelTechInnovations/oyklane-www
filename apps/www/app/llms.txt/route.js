import { getPlans } from "../plans";
import { getSite, SITE_URL } from "../site-data";
import { SUPPORT_EMAIL, WHATSAPP } from "../components/site";

// llms.txt (llmstxt.org): oyklane in plain Markdown for AI assistants —
// what it is, live prices, and where to read more. Built per request so the
// prices match Super admin ▸ Plans.
export const dynamic = "force-dynamic";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export async function GET() {
  const [pricing, site] = await Promise.all([getPlans(), getSite()]);
  const plans = pricing.plans
    .map((p) => `- ${p.name}: ${inr(p.priceMonthly)}/month + 18% GST (${inr(p.priceYearly)}/year). ${p.commissionPercent}% fee per paid online order, ${pricing.codCommissionPercent}% on cash-on-delivery orders. ${p.tagline || ""}`.trim())
    .join("\n");
  const stores = site.showcase.length ? `\n## Stores on oyklane\n\n${site.showcase.map((s) => `- [${s.name}](${s.url})${s.what ? `: ${s.what}` : s.description ? `: ${s.description}` : ""}`).join("\n")}\n` : "";
  const body = `# oyklane

> oyklane is an e-commerce platform for Indian brands: a store with premium themes edited without code, One-Click Checkout, UPI, cards and cash on delivery, built-in shipping with COD payouts, GST invoices, WhatsApp updates and an app and theme store — on lower-priced monthly plans in rupees.

${site.description}

## Plans (live)

${plans}

- Free trial: ${pricing.trialDays} days, no card needed.${pricing.introEnabled ? ` Then ${inr(pricing.introPrice)} for the first month.` : ""}
- One-Click Checkout: no upfront or setup fee; ${pricing.oneClickFeePercent}% only on orders paid through it.
- No setup fee and no product limits on any plan.

## What a store gets

- Premium themes for fashion, jewellery, food, home and single-product brands, with a drag-and-drop editor and your own domain with SSL.
- Payments through Razorpay, Cashfree, PayU, Stripe or PayPal straight to the seller's own account; cash on delivery on or off. oyklane is a PayU partner.
- One-Click Checkout: mobile number, one-time code, saved address, pay — in a popup.
- Oyklane Shipping: compare couriers by price for each pincode, book, print labels, track; COD collected and paid out to the seller's bank.
- GST tax invoices with HSN codes and the buyer's GSTIN.
- WhatsApp and SMS order updates, Meta and Google ads from the dashboard, email automations, and Siyaa, an AI sales assistant.
- XML sitemap, structured data and editable search titles for every store.

## Links

- [Pricing](${SITE_URL}/pricing)
- [Stores on oyklane](${SITE_URL}/stores)
- [Apps](${SITE_URL}/apps)
- [Integrations](${SITE_URL}/integrations)
- [Help centre](${SITE_URL}/help)
- [Developers and API](${SITE_URL}/developers)
- [Book a free setup call](${SITE_URL}/book-a-call)
${stores}
## Contact

- Email: ${SUPPORT_EMAIL}
- WhatsApp: ${WHATSAPP.display}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" } });
}
