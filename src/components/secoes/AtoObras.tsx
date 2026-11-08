// Ato IV. Obras no ABC e quem assina (COPY.md, seção 4). Todos os dados [confirmar com o cliente]:
// na demo, valores de exemplo (src/data/demo.ts) com o selo "Dados de exemplo".
// Fotos: 3 obras diferentes (galpão, sobrado, clínica), legendadas "Imagem ilustrativa".
// Composição (DIRECAO.md, "Ajustes pós-revisão", item A): galpão grande em 1-8 ocupando 2 linhas,
// sobrado e clínica em 9-12; a foto da ficha grande cresce até o pé da ficha (sem caixa vazia).
// H2 monumental de borda a borda (item E): "Cada obra tem endereço / e assinatura."
// Link "Ver todas as obras" removido: /obras fica fora da demo (Decisões do Eliseu, COPY, item 3).

import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { M, SeloDemo } from "@/components/comum/Marcadores";
import { dados, srcSetObra } from "@/data/demo";

const quemAssina = [
  { rotulo: "Engenharia", texto: dados.engenheiro },
  // "Ver no mapa" e "Ver no Google" entram como link quando o cliente passar o endereço e o perfil.
  { rotulo: "Endereço", texto: dados.endereco },
  { rotulo: "Google", texto: dados.notaGoogle },
  { rotulo: "Sistemas", texto: dados.sistemas },
];

export function AtoObras() {
  const [principal, ...outras] = dados.obras;
  return (
    <section
      id="obras"
      aria-labelledby="obras-titulo"
      data-superficie="clara"
      data-hora-ato="pausa"
      className="sup-clara py-[var(--section-y)]"
    >
      <div className="conteiner">
        <div data-revela="grupo">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between">
            <p className="text-eyebrow font-medium text-titanio-escuro">
              Obras no ABC
            </p>
            <SeloDemo className="self-start" />
          </div>
          <h2 id="obras-titulo" className="monumental mt-6">
            <span className="lg:block">Cada obra tem endereço</span> <span className="lg:block">e assinatura.</span>
          </h2>
          <p className="mt-[var(--sp-8)] max-w-[var(--measure-lead)] text-lead">
            Bairro, potência e mês da ligação de cada obra. ART com o nome do engenheiro da AUREON em cada projeto.
          </p>
        </div>

        <ul data-revela="grupo" className="obras mt-[var(--sp-8)]">
          <Ficha obra={principal} grande sizes="(min-width: 1024px) 60vw, (min-width: 640px) 90vw, 100vw" />
          {outras.map((o) => (
            <Ficha key={o.foto} obra={o} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
          ))}
        </ul>

        <div className="mt-[var(--sp-9)] border-t border-linha-claro pt-8">
          <h3 className="text-h3">Quem assina</h3>
          <dl data-revela="grupo" className="mt-6 grid gap-x-[var(--col-gap)] gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {quemAssina.map((q) => (
              <div key={q.rotulo}>
                <dt className="text-small text-titanio-escuro">{q.rotulo}</dt>
                <dd className="mt-1 text-body">
                  <M>{q.texto}</M>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const PROPORCAO = 2160 / 2864; // origem 4:3

export function Ficha({
  obra,
  grande,
  sizes,
  className = "",
}: {
  obra: (typeof dados.obras)[number];
  grande?: boolean;
  sizes: string;
  className?: string;
}) {
  const maior = obra.larguras[obra.larguras.length - 1];
  return (
    <li className={`ficha ${grande ? "ficha--grande" : ""} ${className}`}>
      <figure className="flex h-full flex-col overflow-hidden rounded-r1 bg-papel">
        <div className="ficha__foto relative">
          {/* WebP pré-gerado em 4:3 (scripts/otimizar-imagens.mjs); o recorte de cada lugar é CSS (cover).
              Fora do next/image pelo mesmo motivo das horas (STACK.md, seção 5). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${obra.foto}-${maior}.webp`}
            srcSet={srcSetObra(obra)}
            sizes={sizes}
            width={maior}
            height={Math.round(maior * PROPORCAO)}
            alt={obra.alt}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: obra.foco }}
          />
          <span className="legenda-ilustrativa !right-3 !bottom-3">
            Imagem ilustrativa
          </span>
        </div>
        <figcaption className="flex flex-col gap-1 p-5 sm:p-6">
          <span className="flex items-center gap-2 text-body font-medium">
            <MapPin size={20} weight="light" aria-hidden />
            <M>{obra.local}</M>
          </span>
          <span className="text-small">
            <M>{obra.tecnico}</M>
          </span>
          <span className="text-small text-titanio-escuro">
            <M>{obra.tipo}</M>
          </span>
          {obra.linha ? <span className="mt-2 max-w-[48ch] text-small">{obra.linha}</span> : null}
        </figcaption>
      </figure>
    </li>
  );
}
