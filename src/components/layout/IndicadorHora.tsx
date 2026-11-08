"use client";

// Indicador de hora (DIRECAO.md, "Ajustes pós-revisão", item B; DESIGN.md, "Indicador de hora").
// Trilho "17h · 17h30 · 18h30 · 20h" no centro do topo fixo, só na home e só de 1280 px para cima
// (abaixo disso a hora vai para o eyebrow de cada ato).
//
// Cada ato marca a sua parada com data-hora-ato. Um ato acende a parada quando o topo dele passa
// da metade da tela, e o ponto aceso só desce pelo trilho enquanto a pessoa rola para baixo (vale a
// parada mais adiantada entre os atos já passados). Na troca de hora do desktop, a abertura troca
// o próprio data-hora-ato conforme a foto muda (TrocaDeHora.tsx).
// Ajustes da rodada 2 (08/11/2026, REVISAO-CRIATIVA.md, item 1): sem a parada "dia", o tempo nunca
// volta. Os Atos IV e V (obras e etapas, seções claras de dia) marcam data-hora-ato="pausa": o
// trilho fica parado na última hora acesa (18h30) e esmaecido até o Ato VI acender as 20h.
// Movimento (docs/MOTION.md, "Indicador de hora"): só opacity e transform, em CSS (globals.css).

import { SunHorizon } from "@phosphor-icons/react";
import { Fragment, useEffect, useState } from "react";

export const PARADAS = ["17h", "17h30", "18h30", "20h"] as const;
export type Parada = (typeof PARADAS)[number];

export function IndicadorHora() {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const meio = window.innerHeight * 0.5;
      let indice = 0;
      // Último ato (na ordem do documento) cujo topo já passou da metade da tela: o ato da vez.
      let daVez: string | undefined;
      document.querySelectorAll<HTMLElement>("[data-hora-ato]").forEach((el) => {
        if (el.getBoundingClientRect().top > meio) return;
        daVez = el.dataset.horaAto;
        const i = PARADAS.indexOf(el.dataset.horaAto as Parada);
        if (i > indice) indice = i;
      });
      setAtual(indice);
      setPausado(daVez === "pausa");
      // Entra depois de cerca de 10% da primeira rolagem: o primeiro quadro da abertura não muda.
      setVisivel(window.scrollY > window.innerHeight * 0.1);
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(calcular);
    };
    agendar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    window.addEventListener("hora:recalcular", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      window.removeEventListener("hora:recalcular", agendar);
    };
  }, []);

  return (
    <div
      className="hora hidden xl:flex"
      data-visivel={visivel}
      data-pausado={pausado}
      role="img"
      aria-label={`Hora da cena: ${PARADAS[atual]}`}
    >
      <SunHorizon size={20} weight="light" aria-hidden className="hora__icone" />
      {PARADAS.map((p, i) => (
        <Fragment key={p}>
          {i > 0 ? <span aria-hidden className="hora__traco" data-feito={i <= atual} /> : null}
          {/* Dois rótulos no mesmo lugar (apagado e aceso): a troca é um cruzamento de opacity com
              3 px de translateY, sem animar cor (docs/MOTION.md, "Indicador de hora"). */}
          <span aria-hidden className="hora__parada" data-estado={i === atual ? "acesa" : "apagada"}>
            <span className="hora__rotulo hora__rotulo--apagado">{p}</span>
            <span className="hora__rotulo hora__rotulo--aceso">{p}</span>
          </span>
        </Fragment>
      ))}
    </div>
  );
}
