// Ato II. A conta e as duas portas (COPY.md, seção 2). Superfície clara, sem acento.

import { Buildings, HouseLine } from "@phosphor-icons/react/dist/ssr";
import { LinkRegistrado } from "@/components/comum/LinkRegistrado";
import { reajuste } from "@/data/regras";

export function AtoConta() {
  return (
    <section id="conta" aria-labelledby="conta-titulo" data-superficie="clara" data-hora-ato="17h30" className="sup-clara py-[var(--section-y)]">
      <div className="conteiner">
        <div className="grade">
          <div data-revela="grupo" className="col-span-4 sm:col-span-8 lg:col-span-7">
            <p className="text-eyebrow font-medium text-titanio-escuro">
              <span className="xl:hidden">17h30 · </span>Reajuste de julho
            </p>
            <h2 id="conta-titulo" className="mt-4 text-h2">
              A conta de luz subiu de novo.
            </h2>
            <p className="mt-5 max-w-[var(--measure-lead)] text-lead">
              Por isso a AUREON começa todo projeto pela conta de luz que você paga.
            </p>
          </div>
        </div>

        <div data-revela="grupo" className="grade mt-[var(--sp-9)] gap-y-6">
          <LinkRegistrado
            href="#fio-b"
            evento="porta_casa"
            origem="ato-conta"
            imovel="Casa"
            className="porta col-span-4 sm:col-span-4 lg:col-span-5"
          >
            <Porta
              icone={<HouseLine size={20} weight="light" aria-hidden />}
              numero={reajuste.baixaTensao.texto}
              rotulo="Baixa tensão · casas"
              linha="O consumo pesa à noite: ar-condicionado, piscina, carro na tomada."
              link="Ver como fica na minha casa"
            />
          </LinkRegistrado>
          <div aria-hidden className="hidden lg:col-span-1 lg:flex lg:justify-center">
            <span className="h-full w-px bg-linha-claro" />
          </div>
          <LinkRegistrado
            href="/empresas"
            evento="porta_empresa"
            origem="ato-conta"
            className="porta col-span-4 sm:col-span-4 lg:col-span-6 lg:mt-[var(--sp-9)]"
          >
            <Porta
              icone={<Buildings size={20} weight="light" aria-hidden />}
              numero={reajuste.altaTensao.texto}
              rotulo="Alta tensão · empresas"
              linha="O consumo pesa de dia, na hora em que o painel gera."
              link="Ver a conta da minha empresa"
            />
          </LinkRegistrado>
        </div>

        <p data-revela className="mt-10 text-micro text-titanio-escuro">
          Reajuste da ANEEL em vigor desde {reajuste.vigenciaDesde}. Fonte: Agência iNFRA.
        </p>
      </div>
    </section>
  );
}

function Porta({
  icone,
  numero,
  rotulo,
  linha,
  link,
}: {
  icone: React.ReactNode;
  numero: string;
  rotulo: string;
  linha: string;
  link: string;
}) {
  return (
    <span className="flex h-full flex-col gap-4 rounded-r1 bg-papel p-6 sm:p-8">
      <span className="flex items-center gap-2 text-small text-titanio-escuro">
        {icone}
        {rotulo}
      </span>
      <span className="num text-num-xl font-medium">
        {numero.split(",").map((parte, i) => (
          <span key={i}>
            {i > 0 ? <span className="num-virgula">,</span> : null}
            {parte}
          </span>
        ))}
      </span>
      <span className="max-w-[34ch] text-body">{linha}</span>
      <span className="mt-auto pt-4 text-body font-medium underline underline-offset-4">{link}</span>
    </span>
  );
}
