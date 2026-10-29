import Link from "next/link";
import { Pricing } from "../Pricing";
import { getPlans } from "../plans";
import { Icon, I } from "../components/Icon";
import { APP_URL, inr } from "../components/site";

export const metadata = {
  title: "Pricing",
  description: "Simple monthly plans for Indian brands, with a free trial. Prices in INR, plus GST — no setup fees, no product limits.",
};

export default async function PricingPage() {
  const pricing = await getPlans();
  const { plans } = pricing;
  // Every feature any plan has, in plan order, with which plans include it.
  const seen = new Map();
  for (const p of plans) for (const f of p.features || []) if (!seen.has(f.key)) seen.set(f.key, f);
  const rows = [...seen.values()];
  const wa = pricing.whatsappMessagePrices;
  const waPrice = wa ? `₹${Number(wa.utility).toFixed(2)} (updates) to ₹${Number(wa.marketing).toFixed(2)} (offers)` : `₹${Number(pricing.whatsappMessagePrice).toFixed(2)}`;

  const faq = [
    ["Is there a free trial?", `Yes — ${pricing.trialDays} days on any plan${pricing.introEnabled ? `, then ${inr(pricing.introPrice)} for your first month` : ""}. You choose autopay (UPI or card) to carry on; nothing is charged during the trial.`],
    ["What's the fee per order?", `A small percentage of each paid order — ${plans.map((p) => `${p.name} ${p.commissionPercent}%`).join(", ")}. It's billed with your plan, never taken from your payments.`],
    ["Can I change plans later?", "Anytime. Upgrades apply straight away; downgrades at the end of the period you've paid for."],
    ["Do apps cost extra?", "Most apps are free, including Flow and One-Click Checkout (which adds a small fee on orders paid through it). Paid apps show their price before you install; Phone Login is free to install and costs ₹0.50 for each SMS code sent."],
    ["What do WhatsApp messages cost?", `${waPrice} per message (+ GST) from Oyklane's WhatsApp number. Connect your own WhatsApp Business number and there's no Oyklane fee — Meta charges you directly for its messages.`],
    ["Is GST included?", "No — prices are before 18% GST, and every bill comes with a GST invoice."],
  ];

  return (
    <>
      <section className="wrap page-hero page-hero--center">
        <div>
          <span className="eyebrow eyebrow--center">
            <span className="eyebrow__icon"><Icon d={I.tag} /></span>
            Pricing
          </span>
          <h1 className="h1">
            Simple plans. <span className="grad">Free for {pricing.trialDays} days.</span>
          </h1>
          <p className="lead">No setup fees, no product limits, and you can change plans whenever you like.</p>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 90 }}>
        <Pricing data={pricing} appUrl={APP_URL} />
        <p className="plans__note" style={{ marginTop: 10 }}>
          Not sure which plan fits? <Link href="/book-a-call">Book a free 15-min setup call</Link>.
        </p>
      </section>

      <section className="section section--tight" id="usage">
        <div className="wrap">
          <div className="head head--center" data-reveal>
            <h2 className="h2">Pay-as-you-go extras</h2>
            <p className="lead">Only if you use them. Prices exclude 18% GST and are added to your next bill.</p>
          </div>
          <div className="price-extras">
            <div className="card" id="whatsapp">
              <h3>WhatsApp messages</h3>
              <p>
                <strong>{waPrice} per message</strong> sent from Oyklane&apos;s WhatsApp number.
              </p>
              <p>
                <strong>No Oyklane fee</strong> when you connect your own WhatsApp Business number — Meta&apos;s own message charges apply, billed to you by Meta.
              </p>
            </div>
            <div className="card">
              <h3>Phone Login codes</h3>
              <p>
                <strong>₹0.50 per SMS code</strong> sent when shoppers sign in with their mobile number. The app is free to install.
              </p>
            </div>
            <div className="card">
              <h3>One-Click Checkout</h3>
              <p>
                <strong>+{pricing.oneClickFeePercent}% per order</strong> paid through it, on top of your plan&apos;s fee. Optional and free to install.
              </p>
            </div>
          </div>
        </div>
      </section>

      {rows.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <div className="head head--center" data-reveal>
              <h2 className="h2">Compare plans</h2>
            </div>
            <div className="table-wrap">
              <table className="compare">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    {plans.map((p) => (
                      <th key={p.key} scope="col">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price per month</td>
                    {plans.map((p) => (
                      <td key={p.key}>{inr(p.priceMonthly)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Fee per paid order</td>
                    {plans.map((p) => (
                      <td key={p.key}>{p.commissionPercent}%</td>
                    ))}
                  </tr>
                  <tr>
                    <td>
                      One-Click Checkout (optional app)
                      <span className="compare__note">Added to the fee only on orders paid through it.</span>
                    </td>
                    {plans.map((p) => (
                      <td key={p.key}>+{pricing.oneClickFeePercent}% per order</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Staff accounts</td>
                    {plans.map((p) => (
                      <td key={p.key}>{p.staffLimit}</td>
                    ))}
                  </tr>
                  {rows.map(({ key, name, note }) => (
                    <tr key={key}>
                      <td>
                        {name}
                        {note && <span className="compare__note">{note}</span>}
                      </td>
                      {plans.map((p) => (
                        <td key={p.key}>
                          {(p.features || []).some((f) => f.key === key) ? (
                            <>
                              <Icon d={I.check} />
                              <span className="sr-only">Included</span>
                            </>
                          ) : (
                            <span className="no" aria-label="Not included">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight" id="faq">
        <div className="wrap">
          <div className="head head--center" data-reveal>
            <h2 className="h2">Pricing questions</h2>
          </div>
          <div className="faq">
            {faq.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
