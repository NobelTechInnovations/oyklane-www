// Where the marketing site sends people.
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
// A live store to show visitors — only linked when one is configured.
export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_STORE_URL || "https://demo.oyklane.com";
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.oyklane.com").replace(/\/$/, "");

// How to reach Oyklane.
export const SUPPORT_EMAIL = "support@oyklane.com";
export const WHATSAPP = { display: "+91 89554 87847", url: "https://wa.me/918955487847" };
export const SOCIAL = [
  { name: "Instagram", url: "https://www.instagram.com/oyklane" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/oyklane-solution" },
  { name: "Facebook", url: "https://www.facebook.com/oyklane" },
];

export const inr =(n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
// The Oyklane Store — themes and apps from developers (apps/market).
export const MARKET_URL = (process.env.NEXT_PUBLIC_MARKET_URL || "https://market.oyklane.com").replace(/\/$/, "");
