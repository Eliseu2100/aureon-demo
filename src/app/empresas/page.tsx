import type { Metadata } from "next";
import { ogBase, ogImagem } from "@/lib/config";
import Link from "next/link";
import { BlocoInterno, Fonte } from "@/components/layout/BlocoInterno";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { BotaoFinalSimulacao } from "@/components/simulador/BotaoFinalSimulacao";
import { Simulador } from "@/components/simulador/Simulador";
import { SeloDemo } from "@/components/comum/Marcadores";
import { Ficha } from "@/components/secoes/AtoObras";
import { dados, modoDemo } from "@/data/demo";
import { reajuste } from "@/data/regras";
import { fotosTopoInterna } from "@/data/site";

const titulo = "Energia solar para empresas no ABC · AUREON";
const descricao =
  "Energia solar para loja, clínica ou galpão no ABC. Consumo de dia, fio B, retorno no caixa e documentação com CNPJ e ART.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: "/empresas" },
  openGraph: { ...ogBase, title: titulo, description: descricao, url: "/empresas", images: [ogImagem] },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: [ogImagem.url] },
};

// Texto: COPY.md, seção 3 (/empresas). Bloco 5 (obras de empresa) não aparece sem obra confirmada
// (na demo, galpão e clínica de exemplo); bloco 7 (mercado livre) fica fora até a regra ser confirmada.
const documentos = [
  { doc: "Contrato com CNPJ", oque: "Contrato em nome da empresa, com garantias por item" },
  { doc: "ART", oque: "Anotação de Responsabilidade Técnica, com o nome do engenheiro que assina o projeto" },
  { doc: "Nota fiscal", oque: "Equipamento e serviço, para a contabilidade da empresa" },
  { doc: "Pedido na distribuidora", oque: "A AUREON faz o pedido de ligação e acompanha até a vistoria" },
];

// Na demo, as obras de exemplo; num cliente real, só as obras de empresa confirmadas.
const obrasEmpresa = modoDemo ? dados.obras.filter((o) => o.empresa) : [];

const indice = [
  { id: "alta-tensao", titulo: "A conta de alta tensão subiu 15%" },
  { id: "consumo-de-dia", titulo: "Consumo de dia e o fio B" },
  { id: "retorno", titulo: "Simule com a conta da empresa" },
  { id: "documentacao", titulo: "Documentação" },
  { id: "obras-empresa", titulo: "Obras de empresa no ABC" },
  { id: "nao-pode-parar", titulo: "Empresa que não pode parar" },
  { id: "final", titulo: "Mande a conta da empresa" },
].filter((i) => i.id !== "obras-empresa" || obrasEmpresa.length > 0);

export default function Empresas() {
  return (
    <PaginaInterna
      titulo="Energia solar para empresas do ABC"
      resumo="Loja, clínica ou galpão consomem energia de dia, na hora em que o painel gera. Isso muda a conta do fio B e o tempo de retorno. Esta página mostra os números da empresa, com CNPJ, ART e nota fiscal."      eyebrow="De dia · Para empresas"
      foto={fotosTopoInterna.empresas}
      indice={indice}
    >
      <BlocoInterno id="alta-tensao" titulo="A conta de alta tensão subiu 15%">
        <p>
          No reajuste aprovado pela ANEEL para a Enel SP, em vigor desde {reajuste.vigenciaDesde}, a alta tensão subiu
          15%, contra 8,97% da baixa tensão. Para quem tem custo fixo de energia todo mês, essa diferença vai direto para
          o caixa.
        </p>
        <Fonte>Fonte: Agência iNFRA.</Fonte>
        <p className="text-small text-titanio-escuro">
          Empresa em alta tensão tem tarifa com demanda contratada e regra própria de compensação. O projeto é sob
          medida, depois da análise da conta.
        </p>
      </BlocoInterno>

      <BlocoInterno id="consumo-de-dia" titulo="Consumo de dia e o fio B">
        <p>
          O fio B é cobrado sobre a energia que vai para a rede e volta como crédito. A energia usada no mesmo momento em
          que é gerada não passa por essa conta.
        </p>
        <p>
          Uma loja aberta das 9h às 18h, com ar-condicionado ligado, usa boa parte da geração na hora. Por isso a empresa
          costuma sentir menos a taxação do que uma casa, onde o consumo pesa à noite.
        </p>
        <p>A AUREON mede esse perfil na visita técnica, com a conta e o horário de funcionamento.</p>
        <Fonte>
          Fonte: Lei 14.300/2022, art. 27. Ver{" "}
          <Link href="/lei-14300">
            <span className="traco">Taxação solar</span>
          </Link>
          .
        </Fonte>
      </BlocoInterno>

      <BlocoInterno id="retorno" titulo="Simule com a conta da empresa" largo>
        <p className="max-w-[var(--measure-body)]">
          A parcela do financiamento aparece ao lado da conta atual. Para a empresa, a pergunta é simples: a parcela cabe
          no lugar da conta que já sai todo mês?
        </p>
        <div className="painel-sim mt-6 border border-linha-claro">
          <Simulador variante="completo" contexto="empresas" imovelInicial="Empresa" empilhado />
        </div>
      </BlocoInterno>

      <BlocoInterno id="documentacao" titulo="Documentação" largo>
        <div className="overflow-x-auto">
          <table className="tabela min-w-[30rem]">
            <thead>
              <tr>
                <th scope="col">Documento</th>
                <th scope="col">O que é</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((d) => (
                <tr key={d.doc}>
                  <th scope="row" className="font-medium">
                    {d.doc}
                  </th>
                  <td>{d.oque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BlocoInterno>

      {/* Bloco 5 (COPY.md): só aparece com obra para mostrar. Na demo, as de exemplo (galpão e clínica). */}
      {obrasEmpresa.length > 0 ? (
        <BlocoInterno id="obras-empresa" titulo="Obras de empresa no ABC" largo>
          <ul className="obras-empresa">
            {obrasEmpresa.map((o) => (
              <Ficha key={o.foto} obra={o} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
            ))}
          </ul>
          <SeloDemo />
        </BlocoInterno>
      ) : null}

      <BlocoInterno id="nao-pode-parar" titulo="Empresa que não pode parar">
        <p>
          Sistema ligado à rede desliga quando a rede cai, por segurança. Ele não resolve a queda de energia. Para
          clínica, câmara fria ou comércio que não pode parar, bateria ou gerador entram como projeto à parte, conversado
          na visita.
        </p>
      </BlocoInterno>

      <BlocoInterno id="final" titulo="Mande a conta da empresa" largo>
        <BotaoFinalSimulacao empresas />
      </BlocoInterno>
    </PaginaInterna>
  );
}
