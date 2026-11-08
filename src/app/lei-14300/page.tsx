import type { Metadata } from "next";
import { ogBase, ogImagem } from "@/lib/config";
import Link from "next/link";
import { M } from "@/components/comum/Marcadores";
import { BlocoInterno, Fonte } from "@/components/layout/BlocoInterno";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { fioB, fonteFioB, revisadoEm } from "@/data/regras";
import { fotosTopoInterna } from "@/data/site";

const titulo = "Taxação solar e fio B em 2026: Lei 14.300 · AUREON";
const descricao =
  "O que a Lei 14.300 muda na conta de quem tem energia solar: fio B de 60% em 2026 e 90% em 2028, quem fica na regra antiga e o que está em aberto.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: "/lei-14300" },
  openGraph: { ...ogBase, title: titulo, description: descricao, url: "/lei-14300", images: [ogImagem] },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: [ogImagem.url] },
};

// Texto: COPY.md, seção 4 (/lei-14300). Tabela lê src/data/regras.ts.
const fontes = [
  { rotulo: "Lei 14.300/2022, texto no Planalto", href: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14300.htm" },
  { rotulo: "Canal Solar, “Consumidores pagam 60% do fio B em 2026”", href: "https://canalsolar.com.br/consumidores-60-do-fio-b-2026/" },
  {
    rotulo: "Agência iNFRA, reajuste da Enel SP aprovado pela ANEEL",
    href: "https://agenciainfra.com/blog/aneel-aprova-reajuste-de-1018-nas-tarifas-da-enel-sp/",
  },
];

const indice = [
  { id: "o-que-e", titulo: "O que é o fio B" },
  { id: "antes-depois", titulo: "Antes e depois da lei" },
  { id: "regra-antiga", titulo: "Quem fica na regra antiga" },
  { id: "tabela", titulo: "A tabela, ano a ano" },
  { id: "2029", titulo: "O que está em aberto em 2029" },
  { id: "quanto-pesa", titulo: "Quanto isso pesa na conta" },
  { id: "casa-empresa", titulo: "Casa e empresa sentem diferente" },
  { id: "no-projeto", titulo: "O que isso muda no projeto da AUREON" },
  { id: "fontes", titulo: "Fontes" },
  { id: "final", titulo: "Veja a taxação na sua conta" },
];

export default function Lei14300() {
  return (
    <PaginaInterna
      titulo="Taxação solar: o que a Lei 14.300 muda na sua conta"
      resumo="Quem instalou energia solar depois de 2022 paga uma parte do fio B sobre a energia que injeta na rede. Em 2026, essa parte é de 60%, e vai a 90% em 2028. Ainda compensa, desde que o projeto já conte com essa cobrança."
      eyebrow="18h30 · Taxação solar"
      foto={fotosTopoInterna["lei-14300"]}
      indice={indice}
      revisao={
        <p className="mt-4 text-small text-titanio-escuro">
          <M>{`Texto revisado em ${revisadoEm} com base na Lei 14.300/2022.`}</M>
        </p>
      }
    >

      <BlocoInterno id="o-que-e" titulo="O que é o fio B">
        <p>
          A conta de luz tem duas partes: a energia que você consome e o uso da rede que leva essa energia até a sua casa.
          A parte do uso da rede se divide de novo. Uma delas, o fio B, paga os postes, os cabos e a manutenção da
          distribuidora, que no ABC é a Enel SP.
        </p>
        <p>
          Quem tem painel solar gera energia de dia. O que não usa na hora vai para a rede e volta como crédito, para abater
          o consumo da noite ou de outro mês. A taxação incide sobre esse vai e volta.
        </p>
      </BlocoInterno>

      <BlocoInterno id="antes-depois" titulo="Antes e depois da lei">
        <p>
          <strong className="font-medium">Antes:</strong> cada kWh que o sistema mandava para a rede voltava inteiro como
          crédito.
        </p>
        <p>
          <strong className="font-medium">Depois:</strong> para quem entrou na regra nova, cada kWh compensado paga uma
          parcela do fio B. A parcela cresce ano a ano até 2028.
        </p>
        <p>
          A energia usada no mesmo momento em que é gerada não entra nessa conta. A cobrança vale só para a parte que passa
          pela rede.
        </p>
      </BlocoInterno>

      <BlocoInterno id="regra-antiga" titulo="Quem fica na regra antiga">
        <p>
          Fica na regra antiga, até 31/12/2045, quem já tinha sistema ligado em 07/01/2022, data em que a lei foi
          publicada, ou quem protocolou o pedido de acesso na distribuidora em até 12 meses depois disso (art. 26).
        </p>
        <p>Pedidos feitos entre o 13º e o 18º mês depois da publicação têm regra própria.</p>
      </BlocoInterno>

      <BlocoInterno id="tabela" titulo="A tabela, ano a ano" largo>
        <div className="overflow-x-auto">
          <table className="tabela max-w-[44rem]">
            <thead>
              <tr>
                <th scope="col">Ano</th>
                <th scope="col">Parcela do fio B cobrada sobre a energia compensada</th>
              </tr>
            </thead>
            <tbody>
              {fioB.map((f) => (
                <tr key={f.ano} className={f.hoje ? "font-medium" : undefined} aria-current={f.hoje ? "date" : undefined}>
                  <th scope="row" className="num font-normal">
                    {f.percentual === null ? `${f.ano} em diante` : f.hoje ? `${f.ano} (hoje)` : f.ano}
                  </th>
                  <td className={f.percentual === null ? "" : "num"}>
                    {f.percentual === null ? "Regra do art. 17, ainda sem valor final definido pela ANEEL" : `${f.percentual}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Fonte>Fonte: {fonteFioB}.</Fonte>
      </BlocoInterno>

      <BlocoInterno id="2029" titulo="O que está em aberto em 2029">
        <p>
          Para 2029, a lei manda a ANEEL definir como a energia compensada será valorada. A agência abriu a Tomada de
          Subsídios nº 23/2025 e ainda não tem data para concluir. Por isso nenhuma simulação séria consegue dizer hoje
          como será a conta depois de 2028, e a da AUREON para em 2028.
        </p>
        <Fonte>Fonte: Canal Solar.</Fonte>
      </BlocoInterno>

      <BlocoInterno id="quanto-pesa" titulo="Quanto isso pesa na conta">
        <p>
          Um exemplo de outra distribuidora, só para dar a escala: na CPFL Paulista, 60% do fio B sobre 1.000 kWh injetados
          equivalem a cerca de R$ 123,90 que deixam de virar crédito (Canal Solar).
        </p>
        <p>
          Na Enel SP, com a tarifa vigente desde 04/07/2026, são cerca de R$ 127 para os mesmos 1.000 kWh, antes de
          tributos (fio B de R$ 212,08 por MWh, componentes tarifárias da ANEEL).
        </p>
      </BlocoInterno>

      <BlocoInterno id="casa-empresa" titulo="Casa e empresa sentem diferente" largo>
        <div className="overflow-x-auto">
          <table className="tabela min-w-[32rem] max-w-[52rem]">
            <thead>
              <tr>
                <td />
                <th scope="col">Casa</th>
                <th scope="col">Empresa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="font-medium">
                  Quando consome
                </th>
                <td>Mais à noite, quando o painel não gera</td>
                <td>Mais de dia, quando o painel gera</td>
              </tr>
              <tr>
                <th scope="row" className="font-medium">
                  Quanto passa pela rede
                </th>
                <td>Boa parte da geração vira crédito</td>
                <td>Boa parte é usada na hora</td>
              </tr>
              <tr>
                <th scope="row" className="font-medium">
                  Efeito do fio B
                </th>
                <td>Pesa mais</td>
                <td>Pesa menos</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Fonte>
          Leitura técnica a partir do art. 27, que cobra o fio B só sobre a energia compensada. A conta exata depende do
          perfil de consumo de cada imóvel.
        </Fonte>
      </BlocoInterno>

      <BlocoInterno id="no-projeto" titulo="O que isso muda no projeto da AUREON">
        <ol className="list-decimal space-y-2 pl-5">
          <li>A AUREON mede o horário de consumo antes de dimensionar o sistema, com a conta e na visita.</li>
          <li>A simulação usa a parcela de cada ano: 60% em 2026, 75% em 2027, 90% em 2028.</li>
          <li>Depois de 2028, a simulação não promete nada, porque a regra ainda não existe.</li>
          <li>Se a sua casa já está na regra antiga, o projeto de ampliação considera o que muda para a parte nova.</li>
        </ol>
      </BlocoInterno>

      <BlocoInterno id="fontes" titulo="Fontes">
        <ul className="lg:space-y-2">
          {fontes.map((f) => (
            <li key={f.href}>
              <a href={f.href} target="_blank" rel="noopener" className="alvo-toque">
                <span className="traco">{f.rotulo}</span>
              </a>
            </li>
          ))}
        </ul>
        <Fonte>
          <M>{`Texto informativo, revisado em ${revisadoEm}. Não substitui a análise do seu caso na visita técnica.`}</M>
        </Fonte>
      </BlocoInterno>

      <BlocoInterno id="final" titulo="Veja a taxação na sua conta" largo>
        <Link href="/simulacao" className="botao botao-acento min-h-[52px]">
          Simular minha conta
        </Link>
      </BlocoInterno>
    </PaginaInterna>
  );
}
