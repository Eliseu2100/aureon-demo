"use client";

// Troca de hora (STACK.md, seção 6; tabela de tempos em docs/MOTION.md). Envolve a abertura (Ato I)
// e o 1b, que vêm do servidor. O HTML/CSS padrão é o estado reduzido; aqui o JS liga a cena dentro do
// gsap.matchMedia:
//   completa (>= 1280): o 1b fica preso junto com o palco (grade de uma célula, os dois em sticky).
//                       17h -> 17h30 -> 18h30 (janelas acendem), a foto se recolhe por máscara até o
//                       quadro do 1b e SÓ DEPOIS a frase aparece e se revela por palavra, sobre o
//                       obsidiana. Nunca há texto passando por cima da foto.
//   dois (< 1280):      17h -> 17h30 por opacidade, seção de 200svh, sem máscara; o 1b vem depois e
//                       mostra a mesma 17h30 no quadro. O tempo nunca volta para trás: a 18h30 fica
//                       para o Ato III (revisão criativa, item 6, 08/11/2026).
//   reduzido:           nada (imagens paradas, uma por ato).
// A timeline nasce na hora (a 17h já é o LCP); as camadas 17h30 e 18h30 recebem o srcset depois do
// load, sem disputar banda com o LCP.

import { useEffect, useRef } from "react";
import { CURVAS, FAIXAS, gsap, ScrollTrigger } from "@/lib/movimento";

function depoisDoLoad() {
  return new Promise<void>((ok) => {
    const seguir = () => {
      const ric = (window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (ric) ric(() => ok(), { timeout: 1200 });
      else window.setTimeout(ok, 200);
    };
    if (document.readyState === "complete") seguir();
    else window.addEventListener("load", seguir, { once: true });
  });
}

/** Liga o srcset adiado das camadas pedidas e espera a decodificação (sem piscar). */
async function carregarCamadas(raiz: HTMLElement, horas: string[]) {
  const imgs: HTMLImageElement[] = [];
  for (const hora of horas) {
    const picture = raiz.querySelector<HTMLElement>(`.troca__camada[data-hora="${hora}"]`);
    if (!picture) continue;
    picture.querySelectorAll<HTMLSourceElement>("source[data-srcset]").forEach((s) => {
      s.srcset = s.dataset.srcset ?? "";
    });
    const img = picture.querySelector<HTMLImageElement>("img");
    if (img && img.dataset.srcset && !img.srcset) {
      img.srcset = img.dataset.srcset;
      img.src = img.dataset.src ?? "";
      imgs.push(img);
    }
  }
  await Promise.all(imgs.map((i) => i.decode().catch(() => undefined)));
}

export function TrocaDeHora({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const mm = gsap.matchMedia();
    const camadas = (horas: string[]) => {
      depoisDoLoad().then(() => carregarCamadas(raiz, horas));
    };

    mm.add(FAIXAS.completa, () => {
      raiz.classList.add("troca--completa");
      const cena = raiz.querySelector<HTMLElement>(".troca__cena")!;
      const midia = raiz.querySelector<HTMLElement>(".troca__midia")!;
      const quadro = raiz.querySelector<HTMLElement>(".troca__quadro")!;

      // Retângulo final da máscara = quadro do 1b. Os dois estão presos no mesmo lugar da tela durante
      // a cena, então a conta vale em qualquer ponto da rolagem (e é refeita no refresh).
      const inset = () => {
        const m = midia.getBoundingClientRect();
        const q = quadro.getBoundingClientRect();
        return `inset(${q.top - m.top}px ${m.right - q.right}px ${m.bottom - q.bottom}px ${q.left - m.left}px)`;
      };

      // Escala de 0 a 1 = 200svh de rolagem (seção de 300svh menos a tela presa).
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: cena, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });
      tl
        // 17h: o texto da abertura sai cedo, para a casa mudar de hora sem nada por cima.
        .to(".troca__ato1", { autoAlpha: 0, y: -32, duration: 0.14, ease: CURVAS.saida }, 0.04)
        // 17h -> 17h30: o sol baixa.
        .to('.troca__camada[data-hora="17h30"]', { opacity: 1, duration: 0.24, ease: CURVAS.luz }, 0.06)
        // 17h30 -> 18h30: o céu esfria e as janelas acendem. Cruzamento longo, sem degrau.
        .to('.troca__camada[data-hora="18h30"]', { opacity: 1, duration: 0.26, ease: CURVAS.luz }, 0.28)
        // A foto se recolhe até o quadro (cortina). O scrim lateral sai junto: no quadro não há texto.
        .to(".troca__scrim", { opacity: 0, duration: 0.14, ease: CURVAS.luz }, 0.46)
        .fromTo(midia, { clipPath: "inset(0px 0px 0px 0px)" }, { clipPath: inset, duration: 0.26, ease: CURVAS.cortina }, 0.48)
        // Só com a foto já no quadro: rótulo, frase (fantasma) e revelação por palavra, sobre o obsidiana.
        .fromTo(".troca__1b-rotulo", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.06, ease: CURVAS.revela }, 0.74)
        .fromTo(".troca__frase", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.07, ease: CURVAS.revela }, 0.755)
        .fromTo(".troca__palavra", { opacity: 0.16 }, { opacity: 1, duration: 0.05, stagger: { amount: 0.13 } }, 0.78)
        .fromTo([".troca__1b-nota", ".troca__1b-legenda"], { opacity: 0 }, { opacity: 1, duration: 0.05, ease: CURVAS.luz }, 0.92)
        // Respiro: a frase inteira fica parada um pouco antes de a cena soltar.
        .to({}, { duration: 0.03 }, 0.97);

      // O indicador de rolagem aponta para #quem-somos, que agora está preso no alto da cena:
      // a âncora levaria a lugar nenhum. Leva para o fim da cena (a frase já revelada).
      const fimDaCena = () => cena.offsetTop + cena.offsetHeight - window.innerHeight;
      const irPara1b = (e: Event) => {
        e.preventDefault();
        window.scrollTo({ top: fimDaCena(), behavior: "smooth" });
      };
      const links = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('a[href="#quem-somos"]'));
      links.forEach((a) => a.addEventListener("click", irPara1b));
      if (window.location.hash === "#quem-somos") window.scrollTo({ top: fimDaCena() });

      // Topo fixo: transparente sobre a casa; quando a frase do 1b aparece (0,74 da cena), o topo
      // passa a ler o 1b (escuro com desfoque), para o texto nunca correr por baixo de um topo vazado.
      const topoDaCena = (st: ScrollTrigger) => {
        const antes = cena.dataset.topo;
        if (st.progress < 0.74) cena.dataset.topo = "transparente";
        else delete cena.dataset.topo;
        if (antes !== cena.dataset.topo) window.dispatchEvent(new Event("topo:recalcular"));
      };
      ScrollTrigger.create({ trigger: cena, start: "top top", end: "bottom bottom", onUpdate: topoDaCena, onRefresh: topoDaCena });

      // Indicador de hora (DIRECAO.md, item B): na troca completa, abertura e 1b ficam presos juntos,
      // então a hora vem da foto que está na tela, não do topo de cada seção. O 1b sai do cálculo
      // (seria lido logo no começo da cena) e a cena troca a própria parada conforme a foto muda.
      const quemSomos = raiz.querySelector<HTMLElement>(".troca__1b");
      const horaDoQuemSomos = quemSomos?.dataset.horaAto;
      if (quemSomos) delete quemSomos.dataset.horaAto;
      const horaDaCena = (st: ScrollTrigger) => {
        const antes = cena.dataset.horaAto;
        // 17h30 com a camada já quase toda acesa (0,06 + 0,24 * 0,6); 18h30 idem (0,28 + 0,26 * 0,6).
        cena.dataset.horaAto = st.progress < 0.2 ? "17h" : st.progress < 0.44 ? "17h30" : "18h30";
        if (antes !== cena.dataset.horaAto) window.dispatchEvent(new Event("hora:recalcular"));
      };
      ScrollTrigger.create({ trigger: cena, start: "top top", end: "bottom bottom", onUpdate: horaDaCena, onRefresh: horaDaCena });

      camadas(["17h30", "18h30"]);

      return () => {
        links.forEach((a) => a.removeEventListener("click", irPara1b));
        cena.dataset.topo = "transparente";
        cena.dataset.horaAto = "17h";
        if (quemSomos && horaDoQuemSomos) quemSomos.dataset.horaAto = horaDoQuemSomos;
        window.dispatchEvent(new Event("topo:recalcular"));
        window.dispatchEvent(new Event("hora:recalcular"));
        raiz.classList.remove("troca--completa");
      };
    });

    mm.add(FAIXAS.dois, () => {
      raiz.classList.add("troca--dois");
      const cena = raiz.querySelector<HTMLElement>(".troca__cena")!;
      const frase = raiz.querySelector<HTMLElement>(".troca__frase")!;

      // Escala de 0 a 1 = 100svh de rolagem. O texto da abertura fica legível sobre o scrim enquanto
      // a casa passa de 17h para 17h30 e só sai no fim, quando a seção solta.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: cena, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.to('.troca__camada[data-hora="17h30"]', { opacity: 1, duration: 0.6, ease: CURVAS.luz }, 0.05).to(
        ".troca__ato1",
        { autoAlpha: 0, y: -24, duration: 0.3, ease: CURVAS.saida },
        0.66,
      );

      gsap.fromTo(
        ".troca__palavra",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: frase, start: "top 85%", end: "bottom 50%", scrub: 0.6 },
        },
      );

      camadas(["17h30"]);
      ScrollTrigger.refresh();

      return () => raiz.classList.remove("troca--dois");
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="troca">
      {children}
    </div>
  );
}
