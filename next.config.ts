import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// CSP sem nonce: mantém as páginas estáticas (nonce obrigaria renderização dinâmica e mataria o
// cache de CDN). 'unsafe-inline' em script é exigido pelos scripts inline do Next sem nonce.
// Nada de domínio de terceiro: fontes são servidas pelo próprio site (next/font), WhatsApp é link.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Next 16 exige a lista de qualidades. As 4 horas da casa NÃO passam pelo otimizador
    // (já são WebP prontos, ver STACK.md, seção 5); next/image fica para as demais imagens.
    qualities: [75],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
