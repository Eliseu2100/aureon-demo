// Home: abertura (Ato I) -> 1b -> atos II a VI -> rodapé (layout). Textos: docs/COPY.md.
// Ids dos atos fixos: o botão da abertura desce para #simulador e a porta Casa para #fio-b.

import { BarraInferior } from "@/components/layout/BarraInferior";
import { AberturaE1b } from "@/components/secoes/AberturaE1b";
import { AtoConta } from "@/components/secoes/AtoConta";
import { AtoEtapas } from "@/components/secoes/AtoEtapas";
import { AtoFioB } from "@/components/secoes/AtoFioB";
import { AtoObras } from "@/components/secoes/AtoObras";
import { AtoSimulador } from "@/components/secoes/AtoSimulador";
import { cidades, contato, empresa } from "@/data/site";
import { SITE_URL } from "@/lib/config";

// JSON-LD LocalBusiness. Na demo, os dados ficam marcados como fictícios (STACK.md, seção 9).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: empresa.nomeCompleto,
  description: "Empresa fictícia. Site de demonstração de Eliseu Souza. Projeto e instalação de energia solar no ABC.",
  url: SITE_URL,
  telephone: `+${contato.whatsappNumero}`,
  address: { "@type": "PostalAddress", addressLocality: empresa.cidade, addressRegion: "SP", addressCountry: "BR" },
  areaServed: cidades.map((c) => ({ "@type": "City", name: c })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AberturaE1b />
      <AtoConta />
      <AtoFioB />
      <AtoObras />
      <AtoEtapas />
      <AtoSimulador />
      <BarraInferior />
    </>
  );
}
