import Link from "next/link";
import { getPlans } from "../plans";
import { Icon, I } from "../components/Icon";
import { APP_URL, SUPPORT_EMAIL, WHATSAPP, inr } from "../components/site";

export const metadata = {
  title: "Help centre",
  description: "Answers to common questions about starting and running your store on Oyklane — trial, payments, shipping, domains, WhatsApp and support.",
  alternates: { canonical: "/help" },
};

export default async function HelpPage() {
  const pricing = await getPlans();
  const waPrice = `₹${Number(pricing.whatsappMessagePrice).toFixed(2)}`;
  const groups = [
    {
      title: "Getting started",
      items: [
        [
          "How do I start a store?",
          <>
            <a href={`${APP_URL}/register`}>Sign up</a> with your email or Google, name your store and pick a plan. You get a {pricing.trialDays}-day free trial
            {pricing.introEnabled ? `, then ${inr(pricing.introPrice)} for your first month` : ""}. Nothing is charged during the trial.
          </>,
        ],
        ["Do I need to know coding?", "No. Pick one of the free themes and change text, photos and colours in the visual editor."],
        [
          "When does my store go live?",
          "A new store starts behind a password, so nobody sees it half-built. When you're ready, open Settings ▸ Store access in your admin and switch password protection off.",
        ],
        ["Can I use my own domain?", "Yes. Your store gets a free oyklane.com address straight away, and you can connect your own domain from the admin. SSL is included."],
      ],
    },
    {
      title: "Payments and fees",
      items: [
        [
          "Which payment gateways can I use?",
          "Razorpay, Cashfree, PayU, Stripe and PayPal, plus cash on delivery. You connect your own gateway account, so shoppers' payments go straight to you.",
        ],
        [
          "Does Oyklane take a cut of my payments?",
          <>
            No. Your plan has a small fee per paid order, billed with your plan — never taken from your payments. See <Link href="/pricing">Pricing</Link>.
          </>,
        ],
        [
          "What does One-Click Checkout cost?",
          `It's an optional app, free to install. It adds ${pricing.oneClickFeePercent}% to the fee on orders paid through it.`,
        ],
        ["Are prices with GST?", "Plan prices are before 18% GST, and every bill comes with a GST invoice."],
      ],
    },
    {
      title: "Orders, shipping and messages",
      items: [
        [
          "How do I ship orders?",
          "Oyklane Shipping is built in: compare couriers and prices for each pincode, book in one click and print labels. You can also add any courier and tracking number yourself, and the shopper gets a tracking link. One-click Delhivery and Shiprocket connections are coming soon.",
        ],
        [
          "Can I send WhatsApp messages to customers?",
          `Yes — order updates and messages from Oyklane's WhatsApp number at ${waPrice} per message (+ GST), or connect your own WhatsApp Business number with no Oyklane fee (Meta's charges apply).`,
        ],
        ["Do shoppers get reminded about carts they left?", "Yes, on every plan. A shopper who reached checkout and left gets one reminder email with a link that restores their cart."],
      ],
    },
    {
      title: "Help and your account",
      items: [
        [
          "How do I get help?",
          <>
            Ask the Help assistant inside your admin, message us on <a href={WHATSAPP.url}>WhatsApp {WHATSAPP.display}</a>, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, or <Link href="/book-a-call">book a free 15-minute setup call</Link>.
          </>,
        ],
        ["Can I change my plan later?", "Anytime. Upgrades apply straight away; downgrades at the end of the period you've paid for."],
        [
          "How do I delete my data?",
          <>
            See <Link href="/data-deletion">Data deletion</Link> for your seller account, connected Google or Facebook accounts, and shopper details.
          </>,
        ],
      ],
    },
  ];

  return (
    <>
      <section className="wrap page-hero page-hero--center">
        <div>
          <span className="eyebrow eyebrow--center">
            <span className="eyebrow__icon"><Icon d={I.chat} /></span>
            Help centre
          </span>
          <h1 className="h1">How can we help?</h1>
          <p className="lead">
            Quick answers below. Still stuck? <a href={WHATSAPP.url}>WhatsApp us</a> or <Link href="/book-a-call">book a free setup call</Link>.
          </p>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.title} className="section section--tight">
          <div className="wrap">
            <div className="head head--center">
              <h2 className="h2">{g.title}</h2>
            </div>
            <div className="faq">
              {g.items.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
