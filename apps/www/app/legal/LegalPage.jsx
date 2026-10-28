import Link from "next/link";
import { WHATSAPP } from "../components/site";

/**
 * Who Oyklane is, for the legal pages. Set on Vercel (www project) when
 * known — the registered address and the Grievance Officer's name are
 * required to be published under India's IT Rules and the DPDP Act.
 */
export const LEGAL = {
  name: process.env.NEXT_PUBLIC_LEGAL_NAME || "Upsway",
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL || "support@oyklane.com",
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || process.env.NEXT_PUBLIC_LEGAL_EMAIL || "support@oyklane.com",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "Mansarovar, Jaipur, Rajasthan 302020, India",
  gstin: process.env.NEXT_PUBLIC_LEGAL_GSTIN || "08GFBPP1123R1Z2",
  grievanceOfficer: process.env.NEXT_PUBLIC_GRIEVANCE_OFFICER || "",
  city: process.env.NEXT_PUBLIC_LEGAL_CITY || "Jaipur",
  updated: "28 October 2026",
};

/** A legal document: title, last-updated date, contents and sections.
 * Also used for About and Help (`updated={null}` hides the date). */
export function LegalPage({ eyebrow, title, intro, sections, updated = LEGAL.updated }) {
  return (
    <>
      <section className="wrap page-hero" style={{ paddingBottom: 0 }}>
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="h1" style={{ fontSize: "clamp(36px, 5.4vw, 60px)" }}>
            {title}
          </h1>
          {intro && <p className="lead" style={{ marginTop: 18, maxWidth: "62ch" }}>{intro}</p>}
          {updated && <p className="legal__meta">Last updated {updated}</p>}
        </div>
      </section>
      <div className="wrap legal">
        <nav className="legal__toc" aria-label="On this page">
          <strong>On this page</strong>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>
          <p className="muted" style={{ marginTop: 22, fontSize: 13.5 }}>
            Also: <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/data-deletion">Data deletion</Link>
          </p>
        </nav>
        <article className="legal__body">
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id}>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}

/** The contact block every legal page ends with. */
export function ContactBlock() {
  return (
    <>
      <p>
        <strong>{LEGAL.name}</strong>
        {LEGAL.address ? (
          <>
            <br />
            {LEGAL.address}
          </>
        ) : null}
        {LEGAL.gstin ? (
          <>
            <br />
            GSTIN: {LEGAL.gstin}
          </>
        ) : null}
        <br />
        Email: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> · WhatsApp: <a href={WHATSAPP.url}>{WHATSAPP.display}</a>
      </p>
      <p>
        <strong>Grievance Officer</strong> (Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023):{" "}
        {LEGAL.grievanceOfficer ? `${LEGAL.grievanceOfficer}, ` : ""}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. We acknowledge complaints within 48 hours and resolve them within 30 days.
      </p>
    </>
  );
}
