// Ato III. O projeto feito para a regra de hoje (COPY.md, seção 3). 18h30, blue hour.
// Âmbar só no marcador de 2026 na linha do tempo.
// Contraste no desktop (revisão, item 2): camada presa à coluna de texto (.fiob__texto) e faixa de
// obsidiana sob a linha do tempo (.fiob__faixa), as duas em globals.css.

import Link from "next/link";
import { FotoHora } from "@/components/comum/FotoHora";
import { LinhaDoTempo } from "@/components/comum/LinhaDoTempo";

export function AtoFioB() {
  return (
    <section id="fio-b" aria-labelledby="fio-b-titulo" data-superficie="escura" data-hora-ato="18h30" className="sup-escura relative overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-svh overflow-hidden lg:h-full">
        <FotoHora hora="18h30" modo="lazy" decorativa className="foto-cobre" />
        <div className="scrim" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-obsidiana lg:h-1/2 lg:from-obsidiana/0 lg:to-obsidiana/90" />
      </div>

      <div className="conteiner relative lg:flex lg:min-h-svh lg:flex-col">
        <div className="min-h-svh pt-[calc(var(--topo-h)+var(--sp-7))] lg:min-h-0 lg:pt-[calc(var(--topo-h)+var(--section-y))]">
          <div data-revela="grupo" className="fiob__texto relative max-w-[34rem] lg:w-5/12 lg:max-w-none">
            <p className="text-eyebrow font-medium text-nevoa">
              <span className="xl:hidden">18h30 · </span>Taxação solar, 2026
            </p>
            <h2 id="fio-b-titulo" className="mt-4 text-h2">
              Ainda compensa, com o fio B na conta.
            </h2>
            <p className="mt-5 max-w-[var(--measure-lead)] text-lead text-nevoa">
              Desde 2023, quem instala paga parte do fio B sobre a energia que manda para a rede. Em 2026, são 60%.
            </p>
            <p className="mt-4 max-w-[var(--measure-lead)] text-body">
              A AUREON dimensiona cada sistema com a parcela de cada ano, até 2028.
            </p>
          </div>
        </div>

        <div className="fiob__faixa relative pb-[var(--section-y)] lg:mt-auto lg:pt-[var(--sp-9)]">
          <h3 data-revela className="font-sans text-small font-medium text-nevoa">Fio B cobrado sobre a energia compensada</h3>
          <div className="mt-6">
            <LinhaDoTempo />
          </div>

          <div data-revela="grupo" className="grade mt-10 gap-y-4 text-body">
            <p className="col-span-4 lg:col-span-5">Em casa, o consumo da noite usa o crédito da rede, onde o fio B é cobrado.</p>
            <p className="col-span-4 lg:col-span-5 lg:col-start-7">
              Na empresa, o consumo de dia usa a energia na hora e sente menos a cobrança.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-micro text-titanio">
              Fonte: Lei 14.300/2022, art. 27. A regra de 2029 ainda está em estudo na ANEEL.
            </p>
            <Link href="/lei-14300" className="inline-flex min-h-12 items-center text-body">
              <span className="traco">Ler a regra da taxação, ano a ano</span>
            </Link>
          </div>
        </div>
      </div>
      <p className="legenda-ilustrativa !top-[calc(var(--topo-h)+var(--sp-3))] !bottom-auto">imagem ilustrativa</p>
    </section>
  );
}
