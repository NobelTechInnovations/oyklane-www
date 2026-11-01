import "./globals.css";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { Reveal } from "./components/Reveal";
import { Analytics } from "./components/Analytics";
import { UtmCapture } from "./components/UtmCapture";
import { API_URL, SOCIAL, SUPPORT_EMAIL } from "./components/site";
import { getSite, SITE_URL } from "./site-data";

/** The title, description, keywords and share image come from Super
 * admin ▸ Website (site-data.js), so a change there shows at once —
 * in Google, and in the WhatsApp preview once WhatsApp refetches it. */
export async function generateMetadata() {
  const site = await getSite();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.title, template: "%s · oyklane" },
    description: site.description,
    keywords: site.keywords,
    applicationName: "oyklane",
    // Google Search Console's "HTML tag" ownership check (Google Cloud's
    // OAuth branding needs oyklane.com verified). Set the code on Vercel.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }),
    openGraph: {
      type: "website",
      siteName: "oyklane",
      locale: "en_IN",
      title: site.title,
      description: site.description,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: "oyklane — premium online stores for Indian brands" }],
    },
    twitter: { card: "summary_large_image", title: site.title, description: site.description, images: [site.ogImage] },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}

export const viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

// Who we are, for search engines and AI assistants.
const ORG_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "oyklane",
      url: SITE_URL,
      logo: `${SITE_URL}/android-chrome-512x512.png`,
      email: SUPPORT_EMAIL,
      sameAs: SOCIAL.map((s) => s.url),
      areaServed: "IN",
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "oyklane", url: SITE_URL, inLanguage: "en-IN", publisher: { "@id": `${SITE_URL}/#org` } },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Inter for reading, Inter Tight for headlines. */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&display=swap" />
        {/* Icons: Phosphor from jsDelivr (components/Icon.jsx). */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/duotone/style.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
        <Reveal />
        <Analytics />
        <UtmCapture site="www" apiUrl={API_URL} />
      </body>
    </html>
  );
}
