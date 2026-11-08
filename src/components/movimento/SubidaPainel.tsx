"use client";

// Tela da noite (docs/MOTION.md, "Tela da noite"; DIRECAO.md, "Ajustes pós-revisão", item C).
// O painel do simulador sobe por cima da foto presa da casa às 20h, ligado à rolagem (scrub), sem
// sequestro: translateY de 72 px até 0 (curva revela) e opacity de 0 a 1 no primeiro terço do trecho.
// Trecho: do topo do painel no pé da tela até o topo do painel a 55% da tela. Dali para cima o painel
// está parado e inteiro, para a pessoa ler e digitar.
// Os links para #simulador (abertura, barra do celular) zeram o deslocamento antes de o navegador
// calcular o destino, para a âncora parar no lugar certo.
// Movimento reduzido ou sem JS: nada roda; o painel fica onde o CSS põe.

import { useEffect } from "react";
import { CURVAS, FAIXAS, gsap } from "@/lib/movimento";

export function SubidaPainel({ alvo }: { alvo: string }) {
  useEffect(() => {
    const painel = document.getElementById(alvo);
    if (!painel) return;
    const mm = gsap.matchMedia();
    mm.add(FAIXAS.movimento, () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: painel, start: "top 100%", end: "top 55%", scrub: 0.6 },
      });
      tl.fromTo(painel, { y: 72 }, { y: 0, ease: CURVAS.revela, duration: 1 }, 0).fromTo(
        painel,
        { opacity: 0 },
        { opacity: 1, duration: 0.34 },
        0,
      );

      const antesDaAncora = (e: MouseEvent) => {
        const link = (e.target as Element | null)?.closest?.(`a[href="#${alvo}"]`);
        if (link) gsap.set(painel, { y: 0, opacity: 1 });
      };
      document.addEventListener("click", antesDaAncora, true);
      return () => document.removeEventListener("click", antesDaAncora, true);
    });
    return () => mm.revert();
  }, [alvo]);

  return null;
}
