// Ato V. Do pedido à ligação (COPY.md, seção 5). Numeração 01 a 05 só aqui (é sequência).
// Borda de luz só no bloco do apagão. Links para /como-trabalhamos e /perguntas removidos
// (páginas fora da demo, Decisões do Eliseu, COPY, item 3).

import { BatteryCharging } from "@phosphor-icons/react/dist/ssr";
import { M, SeloDemo } from "@/components/comum/Marcadores";
import { dados } from "@/data/demo";

const etapas = [
  { n: "01", nome: "Mensagem e simulação", linha: "Você manda a conta de luz; a AUREON devolve a faixa." },
  { n: "02", nome: "Visita técnica", linha: "Telhado, quadro de luz e conta, no seu endereço." },
  { n: "03", nome: "Projeto, ART e pedido", linha: "Projeto assinado e pedido de ligação na distribuidora." },
  { n: "04", nome: "Instalação", linha: "Equipe em obra, com o telhado vedado no mesmo dia." },
  { n: "05", nome: "Vistoria e ligação", linha: "A distribuidora vistoria e troca o medidor." },
];

const garantias = dados.garantias;

export function AtoEtapas() {
  return (
    <section id="etapas" aria-labelledby="etapas-titulo" data-superficie="clara" data-hora-ato="pausa" className="sup-clara py-[var(--section-y)]">
      <div className="conteiner">
        <div data-revela="grupo" className="grade gap-y-6">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <p className="text-eyebrow font-medium text-titanio-escuro">
              Do pedido à ligação
            </p>
            <h2 id="etapas-titulo" className="mt-4 text-h2">
              Cinco etapas, com prazo em cada uma.
            </h2>
            <p className="mt-5 max-w-[var(--measure-lead)] text-lead">
              A AUREON cuida do pedido na distribuidora, da ART e da vistoria. Você acompanha.
            </p>
          </div>
          <p className="col-span-4 self-end text-body sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:text-right">
            <M>{dados.mediaDias}</M>
          </p>
        </div>

        <div className="grade mt-[var(--sp-9)]">
          <ol data-revela="grupo" className="col-span-4 sm:col-span-8 lg:col-span-8 lg:col-start-3">
            {etapas.map((e, i) => (
              <li key={e.n} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-linha-claro py-6 last:border-b sm:grid-cols-[4.5rem_1fr_auto] sm:gap-x-6">
                <span className="font-display text-h3 font-semibold" aria-hidden>
                  {e.n}
                </span>
                <div>
                  <h3 className="text-h3">{e.nome}</h3>
                  <p className="mt-1 text-body">{e.linha}</p>
                </div>
                <p className="col-start-2 mt-2 text-small text-titanio-escuro sm:col-start-3 sm:mt-0 sm:text-right">
                  Prazo: <M>{dados.prazos[i]}</M>
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grade mt-[var(--sp-8)]">
          <div className="col-span-4 sm:col-span-8 lg:col-span-8 lg:col-start-3">
            <h3 className="text-small font-medium">Garantias</h3>
            <ul data-revela="grupo" className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-body sm:grid-cols-4">
              {garantias.map((g) => (
                <li key={g}>
                  <M>{g}</M>
                </li>
              ))}
            </ul>
            <SeloDemo className="mt-6" />
          </div>
        </div>

        <aside
          data-revela
          aria-labelledby="apagao-titulo"
          className="borda-luz mt-[var(--sp-9)] bg-grafite p-6 text-alabastro sm:p-10 [&_:focus-visible]:outline-[var(--c-foco-escuro)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <BatteryCharging size={24} weight="light" aria-hidden className="shrink-0 text-nevoa" />
            <div>
              <h3 id="apagao-titulo" className="text-h3">
                O que o sistema não faz
              </h3>
              <p className="mt-3 max-w-[var(--measure-body)] text-body text-nevoa">
                Sistema ligado à rede desliga quando a rede cai, para proteger quem trabalha na linha. Para manter a casa
                ligada no apagão, o projeto precisa de bateria.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
