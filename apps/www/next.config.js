// Security headers on every page: no MIME sniffing, no full URLs leaked to
// other sites, HTTPS remembered, plugins off, and the app can't be framed by
// another site (clickjacking).
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
  { key: "Permissions-Policy", value: "microphone=(), geolocation=(), payment=(self \"https://checkout.razorpay.com\" \"https://api.razorpay.com\")" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // See apps/admin/next.config.js — shared-hosting process quotas are far
  // below this host's real core count, so the default one-worker-per-core
  // build kills itself with `spawn ... EAGAIN`.
  experimental: { cpus: 2 },
  // No "X-Powered-By: Next.js" header.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

module.exports = nextConfig;
