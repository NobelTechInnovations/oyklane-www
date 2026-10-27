import "./globals.css";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { Reveal } from "./components/Reveal";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://oyklane.com"),
  title: {
    default: "Oyklane — The e-commerce platform for Indian brands",
    template: "%s · Oyklane",
  },
  description:
    "Oyklane is the commerce platform for Indian brands: a store you design without code, One-Click Checkout, UPI and cash on delivery, GST invoices, automated customer emails and an app store — live in an afternoon.",
  // Google Search Console's "HTML tag" ownership check (Google Cloud's
  // OAuth branding needs oyklane.com verified). Set the code on Vercel.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }),
  openGraph: {
    title: "Oyklane — The e-commerce platform for Indian brands",
    description: "Launch, manage and grow your own brand — UPI, COD and GST built in.",
    images: ["/showcase/atelier.webp"],
    type: "website",
  },
};

export const viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Plus Jakarta Sans for everything (docs/brand-guidelines.md). */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" />
      </head>
      <body>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
        <Reveal />
      </body>
    </html>
  );
}
