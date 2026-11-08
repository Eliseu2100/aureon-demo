import type { Metadata } from "next";
import { M } from "@/components/comum/Marcadores";
import { BlocoInterno, Fonte } from "@/components/layout/BlocoInterno";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { BotaoFinalSimulacao } from "@/components/simulador/BotaoFinalSimulacao";
import { Simulador } from "@/components/simulador/Simulador";
import { dados } from "@/data/demo";
import { reajuste, revisadoEm } from "@/data/regras";
import { fotosTopoInterna } from "@/data/site";
import { ogBase, ogImagem } from "@/lib/config";

const titulo = "Simulação de energia solar no ABC, em faixa · AUREON";
const descricao =
  "Simule energia solar para casa ou empresa no ABC. Investimento e retorno em faixa, com a regra do fio B de 2026 já na conta.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: "/simulacao" },
  openGraph: { ...ogBase, title: titulo, description: descricao, url: "/simulacao", images: [ogImagem] },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: [ogImagem.url] },
};

// Texto: COPY.md, seção 2 (/simulacao). Tabela de premissas: bloco 4.
const premissasTabela = [
  {
    premissa: "Tarifa",
    valor: `R$ 1,03 por kWh com tributos (Enel SP, vigente desde ${reajuste.vigenciaDesde})`,
    fonte: "ANEEL, REH nº 3.596/2026 (TUSD + TE), com ICMS de 18%",
  },
  { premissa: "Fio B", valor: "60% em 2026, 75% em 2027, 90% em 2028", fonte: "Lei 14.300/2022, art. 27" },
  { premissa: "Depois de 2028", valor: "Não entra na conta", fonte: "Regra ainda em estudo na ANEEL" },
  {
    premissa: "Geração por kWp no ABC",
    valor: "100 a 115 kWh por mês (média do ano)",
    fonte: "PVGIS 5.3, Comissão Europeia, dados de Santo André",
  },
  dados.precoWpTabela,
  { premissa: "Tipo de sistema", valor: "Ligado à rede (on-grid), sem bateria", fonte: "" },
];

const indice = [
  { id: "financiamento", titulo: "Parcela ao lado da conta de hoje" },
  { id: "por-que-faixa", titulo: "Por que mostramos faixa e não um número" },
  { id: "premissas", titulo: "As premissas, uma por uma" },
  { id: "final", titulo: "Mande a simulação e a foto da conta" },
];

export default function Simulacao() {
  return (
    <PaginaInterna
      titulo="Simulação de energia solar para casa e empresa no ABC"
      resumo="Digite o valor da sua conta de luz e veja a potência, o investimento e o tempo de retorno em faixa. Todas as premissas ficam à vista e você pode mudar cada uma. O preço final sai depois da visita técnica."
      eyebrow="20h · Simulação em faixa"
      foto={fotosTopoInterna.simulacao}
      indice={indice}
      antesDoCorpo={
        <div className="painel-sim mt-[var(--sp-8)] border border-linha-claro">
          <Simulador variante="completo" contexto="simulacao" />
        </div>
      }
    >

      <BlocoInterno id="financiamento" titulo="Parcela ao lado da conta de hoje" largo>
        <p className="max-w-[var(--measure-body)]">
          Com o valor da simulação, mostramos a parcela por banco e prazo, ao lado da conta que você paga hoje. Assim dá
          para comparar uma saída de dinheiro com a outra, mês a mês.
        </p>
        <div className="overflow-x-auto">
          <table className="tabela min-w-[28rem]">
            <thead>
              <tr>
                <th scope="col">Banco</th>
                <th scope="col">Prazo</th>
                <th scope="col">Parcela estimada</th>
              </tr>
            </thead>
            <tbody>
              {dados.financiamento.map((f) => (
                <tr key={f.prazo}>
                  <td>
                    <M>{f.banco}</M>
                  </td>
                  <td>
                    <M>{f.prazo}</M>
                  </td>
                  <td>
                    <M>{f.parcela}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dados.financiamentoNota ? <Fonte>{dados.financiamentoNota}</Fonte> : null}
        <Fonte>Taxa sujeita à análise de crédito do banco.</Fonte>
      </BlocoInterno>

      <BlocoInterno id="por-que-faixa" titulo="Por que mostramos faixa e não um número">
        <p>O mesmo sistema de 4 kWp aparece com preços que chegam perto do dobro, conforme a fonte:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Estudo Greener de geração distribuída 2025, citado pelo Olhar Digital (17/05/2026): sistemas de 4 kWp entre
            R$ 16 mil e R$ 22 mil, com retorno de 4 a 6 anos.
          </li>
          <li>Página de uma empresa concorrente que atende Santo André: sistemas de 3 a 5 kWp entre R$ 10.976 e R$ 13.436.</li>
          <li>Radar Solfácil do 1º trimestre de 2026, via pv magazine: média nacional de R$ 2,45 por Wp.</li>
        </ul>
        <p>
          A diferença vem do equipamento, do telhado, da distância até o quadro e do que entra no preço. Por isso a
          simulação dá uma faixa, e o número exato sai da visita técnica, com o telhado medido.
        </p>
      </BlocoInterno>

      <BlocoInterno id="premissas" titulo="As premissas, uma por uma" largo>
        <div className="overflow-x-auto">
          <table className="tabela min-w-[36rem]">
            <thead>
              <tr>
                <th scope="col">Premissa</th>
                <th scope="col">Valor usado</th>
                <th scope="col">Fonte</th>
              </tr>
            </thead>
            <tbody>
              {premissasTabela.map((p) => (
                <tr key={p.premissa}>
                  <th scope="row" className="font-medium">
                    {p.premissa}
                  </th>
                  <td>
                    <M>{p.valor}</M>
                  </td>
                  <td className="text-titanio-escuro">
                    <M>{p.fonte}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Fonte>
          <M>{`Premissas atualizadas em ${revisadoEm}.`}</M>
        </Fonte>
      </BlocoInterno>

      <BlocoInterno id="final" titulo="Mande a simulação e a foto da conta" largo>
        <BotaoFinalSimulacao />
      </BlocoInterno>
    </PaginaInterna>
  );
}
