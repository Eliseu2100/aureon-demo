import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Rodape } from "@/components/layout/Rodape";
import { Topo } from "@/components/layout/Topo";
import { Revelar } from "@/components/movimento/Revelar";
import { INDEXAR, ogImagem, SITE_URL } from "@/lib/config";
import "./globals.css";

// Fontes servidas pelo próprio site (next/font baixa no build; nenhuma chamada ao Google no navegador).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Mono só aparece em número, abaixo da primeira tela: não entra no preload.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const titulo = "AUREON · Energia solar em Santo André e no ABC";
const descricao =
  "Projeto e instalação de energia solar para casas e empresas do ABC, calculado com a taxação de 2026. Simule sua conta e mande pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: titulo,
  description: descricao,
  applicationName: "AUREON Solar",
  creator: "Eliseu Souza · Criação de Sites Premium",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "AUREON Solar",
    title: titulo,
    description: descricao,
    images: [ogImagem],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["/og.jpg"] },
  robots: INDEXAR
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0f14",
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="botao botao-acento sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
        >
          Pular para o conteúdo
        </a>
        <Topo />
        <main id="conteudo" data-inerte-no-menu>
          {children}
        </main>
        <Rodape />
        <Revelar />
      </body>
    </html>
  );
}
