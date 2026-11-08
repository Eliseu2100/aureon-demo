// Texto do COPY com campos a confirmar ("[nome]", "[x] dias"): o trecho entre colchetes sai com o
// estilo .marcador (discreto, só na demo). O resto do texto fica exatamente como no COPY.

import { Fragment } from "react";
import { dados, modoDemo } from "@/data/demo";

export function M({ children }: { children: string }) {
  const partes = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="marcador">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Selo "Dados de exemplo · empresa fictícia" (COPY.md, "Modo demo"). Some fora do modo demo. */
export function SeloDemo({ className = "" }: { className?: string }) {
  if (!modoDemo) return null;
  return <p className={`selo-demo ${className}`}>{dados.selo}</p>;
}
