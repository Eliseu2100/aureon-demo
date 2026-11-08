// Endereço público e chave de indexação.
// INDEXAR fica desligado nesta demo: a AUREON é fictícia e não pode aparecer em buscador nem em
// resposta de IA como se fosse real. Num cliente real: NEXT_PUBLIC_INDEXAR=1 e NEXT_PUBLIC_SITE_URL.

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercel ? `https://${vercel}` : "http://localhost:3200")
).replace(/\/$/, "");

export const INDEXAR = process.env.NEXT_PUBLIC_INDEXAR === "1";

export const DEMO = true;

// Robôs de busca e de IA liberados quando INDEXAR estiver ligado.
export const ROBOS_DE_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

// Cartão social padrão. As internas declaram openGraph próprio, e o Next não herda as imagens do
// layout nesse caso (QA, achado 14): cada página repete esta.
export const ogImagem = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Casa com placas solares pretas no telhado ao entardecer",
};
export const ogBase = { type: "website", locale: "pt_BR", siteName: "AUREON Solar" } as const;
