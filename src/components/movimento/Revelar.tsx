"use client";

// Entradas de seção (docs/MOTION.md, "Entradas de seção"). Um só observador para o site inteiro.
// Marcação no servidor, sem mudar layout:
//   data-revela="grupo"  -> os filhos diretos entram em cascata (80 ms entre um e outro)
//   data-revela          -> o próprio elemento entra
//   data-revela-atraso   -> atraso extra em segundos (ex.: botão logo depois da frase)
// Entrada: translateY(24px) -> 0 e opacity 0 -> 1, 0,9 s, cubic-bezier(0.16, 1, 0.3, 1). Uma vez só.
// Sem JS ou com movimento reduzido: nada é escondido. O que já está na tela ao montar fica parado
// (nada pisca nem some depois de pintado).

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CURVAS, FAIXAS, gsap } from "@/lib/movimento";

const STAGGER = 0.08;

export function Revelar() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(FAIXAS.movimento, () => {
      const alturaTela = window.innerHeight;
      const pendentes = new Map<Element, HTMLElement[]>();

      document.querySelectorAll<HTMLElement>("[data-revela]").forEach((el) => {
        if (el.getBoundingClientRect().top < alturaTela * 0.95) return; // já visto: fica como está
        const itens = el.dataset.revela === "grupo" ? (Array.from(el.children) as HTMLElement[]) : [el];
        if (itens.length === 0) return;
        gsap.set(itens, { opacity: 0, y: 24 });
        pendentes.set(el, itens);
      });

      const io = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue;
            const itens = pendentes.get(e.target);
            if (!itens) continue;
            io.unobserve(e.target);
            pendentes.delete(e.target);
            const atraso = Number((e.target as HTMLElement).dataset.revelaAtraso ?? 0);
            gsap.to(itens, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: CURVAS.revela,
              stagger: STAGGER,
              delay: atraso,
              clearProps: "transform,opacity",
            });
          }
        },
        // Dispara quando o topo do bloco passa de 92% da altura da tela.
        { rootMargin: "0px 0px -8% 0px" },
      );
      pendentes.forEach((_, el) => io.observe(el));

      return () => io.disconnect();
    });
    return () => mm.revert();
  }, [pathname]);

  return null;
}
