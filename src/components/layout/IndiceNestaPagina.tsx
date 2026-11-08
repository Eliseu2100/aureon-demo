"use client";

// Índice "Nesta página" das internas (DIRECAO.md, item D; DESIGN.md, "Topo das páginas internas").
//   preso:      colunas 9-12 a partir de 1024 px, preso a 96 px do topo; solta no fim do corpo.
//   recolhivel: abaixo de 1024 px, bloco recolhível logo depois do resumo, sem prender.
// Item atual: o último título de bloco que passou de 40% da altura da tela. Nenhum âmbar.

import { useEffect, useState } from "react";

export type ItemIndice = { id: string; titulo: string };

export function IndiceNestaPagina({ itens, variante }: { itens: ItemIndice[]; variante: "preso" | "recolhivel" }) {
  const [atual, setAtual] = useState(itens[0]?.id);

  useEffect(() => {
    if (variante !== "preso") return;
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const linha = window.innerHeight * 0.4;
      let ultimo = itens[0]?.id;
      for (const it of itens) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= linha) ultimo = it.id;
      }
      setAtual(ultimo);
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(calcular);
    };
    agendar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [itens, variante]);

  const lista = (
    <ol className="indice__lista">
      {itens.map((it) => (
        <li key={it.id}>
          <a
            href={`#${it.id}`}
            className="indice__link"
            aria-current={variante === "preso" && it.id === atual ? "location" : undefined}
          >
            {it.titulo}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variante === "recolhivel") {
    return (
      <details className="indice indice--recolhivel mt-8 lg:hidden">
        <summary className="indice__titulo">Nesta página</summary>
        {lista}
      </details>
    );
  }

  return (
    <nav aria-labelledby="indice-titulo" className="indice indice--preso">
      <p id="indice-titulo" className="indice__titulo">
        Nesta página
      </p>
      {lista}
    </nav>
  );
}
