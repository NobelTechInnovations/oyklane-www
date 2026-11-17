const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.oyklane.com").replace(/\/$/, "");

// Shown only if the API can't be reached while the page is built.
const FALLBACK = {
  trialDays: 7,
  introEnabled: true,
  introPrice: 49,
  annualDiscountPercent: 20,
  oneClickFeePercent: 0,
  codCommissionPercent: 0,
  whatsappMessagePrice: 0.5,
  plans: [
    { key: "starter", name: "Starter", tagline: "Everything to open your store.", priceMonthly: 499, priceYearly: 4790.4, commissionPercent: 2, oneClickFeePercent: 0.5, staffLimit: 2, features: [] },
    { key: "growth", name: "Growth", tagline: "Marketing, reports and GST invoices for a growing brand.", priceMonthly: 1599, priceYearly: 15350.4, commissionPercent: 1, oneClickFeePercent: 0, staffLimit: 10, features: [] },
    { key: "pro", name: "Pro", tagline: "The lowest fees, API access and priority support.", priceMonthly: 3999, priceYearly: 38390.4, commissionPercent: 0.5, oneClickFeePercent: 0, staffLimit: 30, features: [] },
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

/** One-Click Checkout's fee on a plan, in words. */
export function oneClickFee(plan) {
  return plan.oneClickFeePercent > 0 ? `+${plan.oneClickFeePercent}% per order` : "Free";
}

const join = (parts) => (parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0] || "");

/** "free on Growth and Pro, and 0.5% on Starter" — from the live plans, so
 * a fee changed in Super admin reads right everywhere. */
export function oneClickSummary(plans) {
  const free = plans.filter((p) => !(p.oneClickFeePercent > 0)).map((p) => p.name);
  const byFee = new Map();
  for (const p of [...plans].filter((x) => x.oneClickFeePercent > 0).sort((a, b) => a.oneClickFeePercent - b.oneClickFeePercent)) {
    byFee.set(p.oneClickFeePercent, [...(byFee.get(p.oneClickFeePercent) || []), p.name]);
  }
  if (!byFee.size) return "free on every plan";
  const fees = join([...byFee].map(([fee, names]) => `${fee}% on ${join(names)}`));
  return free.length ? `free on ${join(free)}, and ${fees}` : fees;
}

/** "no fee on cash on delivery" or "0.5% on cash-on-delivery orders". */
export function codFee(percent) {
  return Number(percent) > 0 ? `${percent}% on cash-on-delivery orders` : "no fee on cash-on-delivery orders";
}

/** The plans exactly as Super admin ▸ Plans has them (the public sign-up
 * endpoint), refreshed every minute — and at once when Super admin saves a
 * plan (app/api/revalidate). The page never waits on the API per visit. */
export async function getPlans() {
  try {
    // Live on every request: a price saved in Super admin shows at once.
    const res = await fetch(`${API_URL}/api/auth/plans`, { cache: "no-store" });
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
      codCommissionPercent: data.codCommissionPercent ?? FALLBACK.codCommissionPercent,
      whatsappMessagePrice: data.whatsappMessagePrice ?? FALLBACK.whatsappMessagePrice,
      whatsappMessagePrices: data.whatsappMessagePrices || null,
      // Each plan's own One-Click Checkout fee (older API: one fee for all).
      plans: data.plans.map((p) => present({ ...p, oneClickFeePercent: p.oneClickFeePercent ?? data.oneClickFeePercent ?? FALLBACK.oneClickFeePercent })),
    };
  } catch {
    return { ...FALLBACK, plans: FALLBACK.plans.map(present) };
  }
}
