const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.oyklane.com").replace(/\/$/, "");

// Shown only if the API can't be reached while the page is built.
const FALLBACK = {
  trialDays: 3,
  introEnabled: true,
  introPrice: 49,
  annualDiscountPercent: 20,
  oneClickFeePercent: 0.3,
  whatsappMessagePrice: 0.5,
  plans: [
    { key: "starter", name: "Starter", tagline: "Everything to open your store.", priceMonthly: 899, priceYearly: 8630.4, commissionPercent: 2, staffLimit: 2, features: [] },
    { key: "growth", name: "Growth", tagline: "Marketing, reports and GST invoices for a growing brand.", priceMonthly: 1999, priceYearly: 19190.4, commissionPercent: 1.5, staffLimit: 10, features: [] },
    { key: "pro", name: "Pro", tagline: "The lowest fees, API access and priority support.", priceMonthly: 4999, priceYearly: 47990.4, commissionPercent: 0.5, staffLimit: 30, features: [] },
  ],
};

// How the site words some plan features (Super admin ▸ Plans names them
// for the admin). Abandoned-checkout emails run on every plan, so they're
// listed as their own all-plans feature, not under Growth's automations.
const FEATURE_COPY = {
  automation: { name: "Automations (reminders)" },
  ai_assistant: {
    name: "Siyaa, the AI sales assistant",
    note: "Spots shoppers likely to buy and prepares a personal WhatsApp offer. You approve each one, or let it send on autopilot within the discount limits you set.",
  },
};
const ALL_PLANS = [{ key: "abandoned_checkout", name: "Abandoned checkout emails" }];

function present(plan) {
  const features = (plan.features || []).map((f) => ({ ...f, ...FEATURE_COPY[f.key] }));
  // After the store essentials, before Growth's additions.
  const at = features.findIndex((f) => f.key === "theme_basic") + 1 || features.length;
  features.splice(at, 0, ...ALL_PLANS.filter((x) => !features.some((f) => f.key === x.key)));
  return { ...plan, features };
}

/** The plans exactly as Super admin ▸ Plans has them (the public sign-up
 * endpoint), refreshed every minute — and at once when Super admin saves a
 * plan (app/api/revalidate). The page never waits on the API per visit. */
export async function getPlans() {
  try {
    const res = await fetch(`${API_URL}/api/auth/plans`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (!data?.plans?.length) throw new Error("no plans");
    const yearlyOff = (p) => (p.priceMonthly ? Math.round((1 - p.priceYearly / (p.priceMonthly * 12)) * 100) : 0);
    return {
      trialDays: data.trialDays ?? FALLBACK.trialDays,
      introEnabled: data.introEnabled ?? true,
      introPrice: data.introPrice ?? FALLBACK.introPrice,
      annualDiscountPercent: Math.max(0, ...data.plans.map(yearlyOff)),
      oneClickFeePercent: data.oneClickFeePercent ?? FALLBACK.oneClickFeePercent,
      whatsappMessagePrice: data.whatsappMessagePrice ?? FALLBACK.whatsappMessagePrice,
      whatsappMessagePrices: data.whatsappMessagePrices || null,
      plans: data.plans.map(present),
    };
  } catch {
    return { ...FALLBACK, plans: FALLBACK.plans.map(present) };
  }
}
