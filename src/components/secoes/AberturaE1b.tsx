// Ato I (abertura, 17h) e 1b (quem é a AUREON, 17h30). Texto: COPY.md, seções 1 e 1b.
// A cena (troca de hora, máscara, frase por palavra) é ligada por <TrocaDeHora> no cliente.

import { M } from "@/components/comum/Marcadores";
import { dados } from "@/data/demo";
import { FotoHora } from "@/components/comum/FotoHora";
import { TrocaDeHora } from "@/components/movimento/TrocaDeHora";

const FRASE_1B =
  "A AUREON é uma empresa de engenharia solar de Santo André. Faz do projeto à ligação na distribuidora, e acompanha cada sistema pelo aplicativo.";

export function AberturaE1b() {
  const palavras = FRASE_1B.split(" ");
  return (
    <TrocaDeHora>
      <section
        id="abertura"
        aria-labelledby="abertura-titulo"
        data-topo="transparente"
        data-superficie="escura"
        data-hora-ato="17h"
        className="troca__cena sup-escura"
      >
        <div className="troca__palco">
          <div className="troca__midia">
            <FotoHora hora="17h" modo="lcp" className="troca__camada foto-cobre" />
            <FotoHora hora="17h30" modo="adiado" decorativa className="troca__camada foto-cobre" />
            <FotoHora hora="18h30" modo="adiado" decorativa className="troca__camada foto-cobre" />
            <div className="scrim troca__scrim" />
            <p className="legenda-ilustrativa">imagem ilustrativa</p>
          </div>

          <div className="troca__ato1 conteiner relative z-[1] flex min-h-svh flex-col pb-8 pt-[calc(var(--topo-h)+var(--sp-6))] lg:pt-[calc(var(--topo-h)+clamp(3rem,13vh,9rem))]">
            <div className="troca__entrada max-w-[34rem] lg:max-w-[max(46rem,calc(7/12*100%))]">
              <p className="text-eyebrow font-medium text-nevoa">AUREON · Energia solar · Santo André</p>
              <h1 id="abertura-titulo" className="mt-4 max-w-[13em] text-h1">
                A AUREON projeta energia solar como arquitetura.
              </h1>
              <p className="mt-5 max-w-[var(--measure-lead)] text-lead text-nevoa">
                Para casas e empresas do ABC. Cada sistema é calculado com a regra da taxação de 2026 e assinado por
                engenheiro da casa.
              </p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-start">
                <a
                  id="abertura-botao"
                  href="#simulador"
                  className="botao botao-acento min-h-[52px]"
                  data-track="simular_clique"
                  data-track-origem="abertura"
                >
                  Simular minha conta
                </a>
                <p className="text-small text-nevoa">Resultado em faixa, com as premissas à vista.</p>
              </div>
            </div>
            <a href="#quem-somos" aria-label="Rolar para conhecer a AUREON" className="indicador-rolagem mt-auto self-center">
              <span className="indicador-rolagem__linha" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="quem-somos"
        aria-labelledby="quem-somos-titulo"
        data-superficie="escura"
        data-hora-ato="17h30"
        className="troca__1b sup-escura py-[var(--section-y)]"
      >
        <div className="conteiner grade items-center gap-y-12">
          <div className="col-span-4 sm:col-span-8 lg:col-span-6">
            <h2 id="quem-somos-titulo" className="troca__1b-rotulo font-sans text-eyebrow font-medium text-nevoa">
              <span className="xl:hidden">17h30 · </span>Quem somos
            </h2>
            <p className="troca__frase mt-6 max-w-[var(--measure-frase)] font-display text-frase">
              {palavras.map((p, i) => (
                <span key={i} className="troca__palavra palavra">
                  {p}
                  {i < palavras.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
            <p className="troca__1b-nota mt-8 text-small text-titanio">
              <M>{`${dados.escritorio} · ${dados.primeiraObra}`}</M>
            </p>
          </div>
          <div className="troca__quadro relative col-span-4 aspect-[4/5] overflow-hidden sm:col-span-6 sm:col-start-2 lg:col-span-5 lg:col-start-8">
            <FotoHora
              hora="17h30"
              modo="lazy"
              className="troca__quadro-img foto-cobre"
              sizes="(min-width: 1024px) 40vw, 90vw"
            />
            <p className="legenda-ilustrativa troca__1b-legenda !right-3 !bottom-3">imagem ilustrativa</p>
          </div>
        </div>
      </section>
    </TrocaDeHora>
  );
}
