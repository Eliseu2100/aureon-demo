"use client";

// Link que registra o evento de medição (ARQUITETURA.md, seção 7) e, se pedido, pré-marca o tipo
// de imóvel no simulador (porta Casa -> "Casa").

import Link from "next/link";
import type { Imovel } from "@/data/simulador";
import { registrar, type Evento } from "@/lib/metricas";
import { atualizar } from "@/lib/simulacao-estado";

type Props = {
  href: string;
  evento: Evento;
  origem?: string;
  imovel?: Imovel;
  externo?: boolean;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
};

export function LinkRegistrado({ href, evento, origem, imovel, externo, className, children, ...resto }: Props) {
  const aoClicar = () => {
    registrar(evento, origem ? { origem } : {});
    if (imovel) atualizar({ imovel });
  };
  // Atributos de medição no HTML (revisão criativa, item 13): o GTM pode ler sem depender do JS do site.
  const track = { "data-track": evento, "data-track-origem": origem };
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener" className={className} onClick={aoClicar} aria-label={resto["aria-label"]} {...track}>
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={aoClicar} aria-label={resto["aria-label"]} {...track}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={aoClicar} aria-label={resto["aria-label"]} {...track}>
      {children}
    </Link>
  );
}
