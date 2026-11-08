// Molde das páginas da Camada 2 (ARQUITETURA.md, seção 6): título que responde a dúvida, resumo de
// até 3 linhas no topo, corpo em blocos.
// 08/11/2026 (DIRECAO.md, "Ajustes pós-revisão", item D):
//   - faixa do topo com a foto da hora do assunto (56svh no desktop, 44svh no celular). No desktop,
//     eyebrow e H1 sobre a foto (colunas 1-7, alinhados ao pé); no celular, logo abaixo, no alabastro.
//   - corpo: texto nas colunas 1-7 e índice "Nesta página" preso nas 9-12 (recolhível abaixo de 1024).
// Sem `foto` (ex.: 404), a página abre como antes, só com texto.

import { IndiceNestaPagina, type ItemIndice } from "./IndiceNestaPagina";

export type FotoTopo = {
  /** srcset da faixa larga (desktop). */
  srcSet: string;
  src: string;
  /** srcset da foto do celular e tablet em pé (faixa quase quadrada). */
  srcSetRetrato: string;
  width: number;
  height: number;
  alt: string;
  /** object-position (DIRECAO.md, item D). */
  foco: string;
};

export function PaginaInterna({
  titulo,
  resumo,
  eyebrow,
  foto,
  revisao,
  antesDoCorpo,
  indice,
  children,
}: {
  titulo: string;
  resumo?: string;
  eyebrow?: string;
  foto?: FotoTopo;
  /** Linha logo abaixo do resumo (ex.: "Texto revisado em ..."). */
  revisao?: React.ReactNode;
  /** Bloco de largura total antes do corpo (ex.: o simulador de /simulacao). */
  antesDoCorpo?: React.ReactNode;
  indice?: ItemIndice[];
  children?: React.ReactNode;
}) {
  if (!foto) {
    return (
      <section
        aria-labelledby="pagina-titulo"
        data-superficie="clara"
        className="sup-clara min-h-[70svh] pb-[var(--section-y)] pt-[calc(var(--topo-h)+var(--section-y))]"
      >
        <div className="conteiner">
          <h1 id="pagina-titulo" className="max-w-[20ch] text-h2">
            {titulo}
          </h1>
          {resumo ? <p className="mt-6 max-w-[var(--measure-lead)] text-lead">{resumo}</p> : null}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="pagina-titulo" data-superficie="clara" className="sup-clara pb-[var(--section-y)]">
      <div className="interna-topo">
        <div className="interna-topo__foto sup-escura" data-superficie="escura">
          <picture>
            <source media="(max-width: 1023.98px)" srcSet={foto.srcSetRetrato} sizes="100vw" />
            {/* Maior imagem da primeira tela: prioridade alta, nunca lazy. WebP pré-gerado. */}
            <img
              src={foto.src}
              srcSet={foto.srcSet}
              sizes="100vw"
              width={foto.width}
              height={foto.height}
              alt={foto.alt}
              fetchPriority="high"
              decoding="async"
              style={{ objectPosition: foto.foco }}
            />
          </picture>
          <div className="interna-topo__scrim" />
          <p className="legenda-ilustrativa">imagem ilustrativa</p>
        </div>
        <div className="interna-topo__texto-wrap conteiner">
          <div className="interna-topo__texto">
            {eyebrow ? <p className="interna-topo__eyebrow text-eyebrow font-medium">{eyebrow}</p> : null}
            <h1 id="pagina-titulo" className="mt-4 text-h1-interna">
              {titulo}
            </h1>
          </div>
        </div>
      </div>

      <div className="conteiner">
        {resumo ? <p className="mt-8 max-w-[var(--measure-lead)] text-lead lg:mt-10">{resumo}</p> : null}
        {revisao}
        {indice ? <IndiceNestaPagina itens={indice} variante="recolhivel" /> : null}
        {antesDoCorpo}
        <div className="grade">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">{children}</div>
          {indice ? (
            <div className="hidden pt-[var(--sp-9)] lg:col-span-4 lg:col-start-9 lg:block">
              <IndiceNestaPagina itens={indice} variante="preso" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
