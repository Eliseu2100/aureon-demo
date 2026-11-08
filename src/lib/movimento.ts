// Ponto único de entrada do GSAP. Importar daqui (nunca de "gsap" direto nos componentes), para o
// plugin ser registrado uma vez só e as faixas de movimento serem as mesmas no site inteiro.
// Só usar dentro de componente "use client" (useEffect / useLayoutEffect).
// Tabela completa de cada animação: docs/MOTION.md.

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * cubic-bezier(x1, y1, x2, y2) como função de easing do GSAP (sem o plugin CustomEase).
 * Newton-Raphson com recaída em bisseção, igual ao que o navegador faz no CSS.
 */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const erro = sx(t) - x;
      const d = dx(t);
      if (Math.abs(erro) < 1e-5) return sy(t);
      if (Math.abs(d) < 1e-6) break;
      t -= erro / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 20; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-5) break;
      if (v < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}

/** Curvas do site (skill award-winning-web-design). Iguais às variáveis --ease-* do globals.css. */
export const CURVAS = {
  /** Revelação elegante (expo out): entradas de seção, frase do 1b. */
  revela: bezier(0.16, 1, 0.3, 1),
  /** Cortina (quart in-out): a máscara que recolhe a foto até o quadro. */
  cortina: bezier(0.76, 0, 0.24, 1),
  /** Saída (sai rápido, não fica): texto do Ato I deixando a cena. */
  saida: bezier(0.6, 0, 0.9, 0.35),
  /** Luz mudando (seno in-out): cruzamento das horas, janelas acendendo. */
  luz: bezier(0.37, 0, 0.63, 1),
} as const;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: CURVAS.revela, duration: 0.9 });
}

/**
 * Faixas para gsap.matchMedia() (STACK.md, "Troca de hora"):
 * - completa: 1280 px ou mais, sem pedido de movimento reduzido. 3 horas presas na rolagem + máscara.
 * - dois:     abaixo de 1280 px, sem pedido de movimento reduzido. 2 quadros (17h e 18h30) por opacidade.
 * - reduzido: prefers-reduced-motion. Nada preso, nada atrelado à rolagem; uma imagem parada por ato.
 */
export const FAIXAS = {
  completa: "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
  dois: "(max-width: 1279.98px) and (prefers-reduced-motion: no-preference)",
  movimento: "(prefers-reduced-motion: no-preference)",
  reduzido: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger };
