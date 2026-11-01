import { SITE_URL } from "./site-data";

// Search engines and AI assistants are welcome everywhere but the API —
// named so a blanket block elsewhere can't shut them out by accident.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"];

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
