import type { Metadata } from "next";
import { BlocoInterno } from "@/components/layout/BlocoInterno";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { assinatura } from "@/data/site";
import { ogBase, ogImagem } from "@/lib/config";

// Página de privacidade (REVISAO-CRIATIVA.md, rodada 2, item 5). Curta, sem foto no topo.
// Texto conferido no código em 08/11/2026: sem formulário que envie dados, simulador só em
// sessionStorage (src/lib/simulacao-estado.ts), WhatsApp só por link wa.me, nenhum cookie e nenhum
// script de terceiro (a CSP de next.config.ts só libera o próprio domínio). Passou no revisar_copy.py (5/5).

const titulo = "Privacidade · AUREON";
const descricao =
  "O que o site da AUREON guarda sobre você: os valores do simulador ficam só no seu navegador, e a mensagem do WhatsApp só sai se você confirmar.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: "/privacidade" },
  openGraph: { ...ogBase, title: titulo, description: descricao, url: "/privacidade", images: [ogImagem] },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: [ogImagem.url] },
};

export default function Privacidade() {
  return (
    <PaginaInterna
      titulo="Privacidade: o que este site guarda sobre você"
      resumo="O site não tem cadastro nem formulário que envie dados. Abaixo, o que acontece com o que você digita no simulador e com o clique no WhatsApp."
    >
      <BlocoInterno id="simulador" titulo="O que você digita no simulador">
        <p>
          O valor da conta, a cidade, o tipo de imóvel, o telhado e o horário de consumo ficam só no seu navegador,
          enquanto a aba estiver aberta. Assim a simulação continua igual quando você troca de página.
        </p>
        <p>Esses valores não são enviados a lugar nenhum. Ao fechar a aba, o navegador apaga tudo.</p>
      </BlocoInterno>

      <BlocoInterno id="whatsapp" titulo="O que acontece ao clicar no WhatsApp">
        <p>
          O botão abre o WhatsApp no seu celular ou computador com uma mensagem já escrita: cidade, tipo de imóvel, conta
          média e a faixa simulada.
        </p>
        <p>A mensagem só é enviada se você confirmar no aplicativo. Antes disso, dá para mudar ou apagar o texto.</p>
      </BlocoInterno>

      <BlocoInterno id="cookies" titulo="Cookies e rastreamento">
        <p>
          O site não usa cookies de publicidade nem script de rastreamento de terceiros. As fontes e as imagens vêm do
          próprio site.
        </p>
        <p>Os links para outros sites, como as fontes da página sobre a taxação, levam a páginas com regras próprias.</p>
      </BlocoInterno>

      <BlocoInterno id="quem-fez" titulo="Quem fez este site">
        <p>
          A AUREON é uma empresa fictícia. Este é um site de demonstração de Eliseu Souza. Dúvidas sobre esta página:{" "}
          <a href={`mailto:${assinatura.email}`} className="break-all">
            <span className="traco">{assinatura.email}</span>
          </a>
          .
        </p>
      </BlocoInterno>
    </PaginaInterna>
  );
}
