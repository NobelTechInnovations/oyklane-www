import Link from "next/link";
import { getPlans } from "../plans";
import { Icon, I } from "../components/Icon";
import { APP_URL } from "../components/site";
import { Calculator } from "./Calculator";

export const metadata = {
  title: "Oyklane vs Shopify",
  description: "Compare what an Indian brand pays each month on Oyklane and Shopify — plan prices and platform fees on orders, with a calculator for your own sales.",
  alternates: { canonical: "/vs-shopify" },
};

// Shopify's India plans as listed on shopify.com/in/pricing — check again
// and update CHECKED when they change.
const CHECKED = "28 October 2026";
const SHOPIFY = [
  { name: "Basic", monthly: 1994, yearly: 1800, feePercent: 2 },
  { name: "Grow", monthly: 7447, yearly: 6700, feePercent: 1 },
  { name: "Advanced", monthly: 30164, yearly: 27100, feePercent: 0.6 },
];

export default async function VsShopifyPage() {
  const pricing = await getPlans();
  const oyklane = pricing.plans.map(({ key, name, priceMonthly, priceYearly, commissionPercent }) => ({ key, name, priceMonthly, priceYearly, commissionPercent }));

  return (
    <>
      <section className="wrap page-hero page-hero--center" style={{ paddingBottom: 24 }}>
        <div>
          <span className="eyebrow eyebrow--center">
            <span className="eyebrow__icon"><Icon d={I.tag} /></span>
            Oyklane vs Shopify
          </span>
          <h1 className="h1">What will you pay each month?</h1>
          <p className="lead">Move the sliders to your sales. We add up each platform&apos;s plan price and its own fee on your orders.</p>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 60 }}>
        <Calculator oyklane={oyklane} shopify={SHOPIFY} oneClickFeePercent={pricing.oneClickFeePercent} />
      </section>

      <section className="section section--tight">
        <div className="wrap legal" style={{ display: "block" }}>
          <article className="legal__body" style={{ maxWidth: "76ch", margin: "0 auto" }}>
            <h2>How it&apos;s worked out</h2>
            <ul>
              <li>Plan prices on both are before 18% GST.</li>
              <li>
                <strong>Oyklane</strong>: {oyklane.map((p) => `${p.name} ${p.commissionPercent}%`).join(", ")} of every paid order — online and cash on delivery
                once it&apos;s paid. Orders that are returned or cancelled pay no fee.
              </li>
              <li>
                <strong>Shopify</strong>: on orders paid through a third-party gateway such as Razorpay, PayU or Cashfree, Shopify adds{" "}
                {SHOPIFY.map((p) => `${p.feePercent}% on ${p.name}`).join(", ")}. It adds nothing on cash-on-delivery orders.
              </li>
              <li>Your payment gateway&apos;s own charges are the same on both, so they&apos;re left out.</li>
              <li>Paid apps and themes can add to the cost on either platform; they&apos;re not included.</li>
              <li>
                Shopify prices as listed on{" "}
                <a href="https://www.shopify.com/in/pricing" target="_blank" rel="noopener noreferrer">
                  shopify.com/in/pricing
                </a>{" "}
                on {CHECKED}. Oyklane prices are today&apos;s, from our <Link href="/pricing">pricing page</Link>.
              </li>
            </ul>

            <h2>Built in on Oyklane</h2>
            <ul>
              <li>Payments straight to your own Razorpay, Cashfree, PayU, Stripe or PayPal account, plus cash on delivery.</li>
              <li>GST invoices with HSN codes and your buyer&apos;s GSTIN (Growth and Pro).</li>
              <li>WhatsApp order updates from our number or your own, and abandoned-checkout reminder emails on every plan.</li>
              <li>Oyklane Shipping: compare couriers for each pincode, book in one click and print labels.</li>
              <li>Free themes made for Indian brands, and help from a real team — <Link href="/book-a-call">book a free setup call</Link>.</li>
            </ul>

            <h2>Where Shopify is stronger</h2>
            <ul>
              <li>A much larger app store and more themes.</li>
              <li>More tools for selling in many countries, and point-of-sale for physical shops.</li>
            </ul>
            <p>If most of your orders are cash on delivery, run your own numbers above — Shopify adds no fee on those orders, Oyklane does.</p>
          </article>
        </div>
      </section>

      <section className="band band--violet">
        <div className="wrap cta">
          <div>
            <h2 className="h2">Try Oyklane free for {pricing.trialDays} days.</h2>
            <p className="lead">Set up your store, connect your gateway and see it for yourself.</p>
          </div>
          <div className="hero__ctas">
            <a href={`${APP_URL}/register`} className="btn btn--white btn--lg">
              Start free trial
            </a>
            <Link href="/book-a-call" className="btn btn--outline-white btn--lg">
              Book a free 15-min setup call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
