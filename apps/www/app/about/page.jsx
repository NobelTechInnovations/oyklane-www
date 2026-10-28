import Link from "next/link";
import { LegalPage, LEGAL } from "../legal/LegalPage";
import { SOCIAL, WHATSAPP } from "../components/site";

export const metadata = {
  title: "About us",
  description: `Oyklane is an e-commerce platform for Indian brands, run by ${LEGAL.name}, Jaipur. Company details, GSTIN and how to reach us.`,
  alternates: { canonical: "/about" },
};

const sections = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <p>
          Oyklane helps Indian brands sell online from their own store — with checkout, payments to the seller&apos;s own gateway, GST invoices, WhatsApp
          updates and ads in one admin. Oyklane is a product of <strong>{LEGAL.name}</strong>, based in {LEGAL.city}.
        </p>
        <p>
          See what&apos;s included on <Link href="/pricing">Pricing</Link>, or try it with a free trial.
        </p>
      </>
    ),
  },
  {
    id: "company",
    title: "Company details",
    body: (
      <ul>
        <li>
          <strong>Legal name</strong>: {LEGAL.name}
        </li>
        <li>
          <strong>Brand</strong>: Oyklane
        </li>
        <li>
          <strong>Registered address</strong>: {LEGAL.address}
        </li>
        <li>
          <strong>GSTIN</strong>: {LEGAL.gstin}
        </li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <ul>
        <li>
          <strong>Email</strong>: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </li>
        <li>
          <strong>WhatsApp</strong>: <a href={WHATSAPP.url}>{WHATSAPP.display}</a>
        </li>
        <li>
          <strong>Setup help</strong>: <Link href="/book-a-call">book a free 15-minute setup call</Link>
        </li>
        <li>
          <strong>Follow us</strong>:{" "}
          {SOCIAL.map((s, i) => (
            <span key={s.name}>
              {i > 0 && " · "}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            </span>
          ))}
        </li>
      </ul>
    ),
  },
];

export default function AboutPage() {
  return <LegalPage eyebrow="About us" title="About Oyklane" intro="Your own online store, made for selling in India." sections={sections} updated={null} />;
}
