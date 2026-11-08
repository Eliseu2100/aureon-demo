"use client";

// Barra inferior fixa do celular (COPY.md, seção 6; DIRECAO.md, seção 3).
// Aparece quando o botão da abertura sai da tela; some quando o simulador (Ato VI) ou o rodapé
// entram. Assim nunca há dois botões âmbar juntos.

import { WhatsappLogo } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { linkWhatsApp, mensagens } from "@/data/site";
import { registrar } from "@/lib/metricas";

export function BarraInferior() {
  const [passouAbertura, setPassouAbertura] = useState(false);
  const [noFim, setNoFim] = useState(false);

  useEffect(() => {
    const botao = document.getElementById("abertura-botao");
    const fins = [document.getElementById("simulador"), document.querySelector("footer")].filter(
      (x): x is HTMLElement => !!x,
    );
    const visiveis = new Set<Element>();

    const ioBotao = new IntersectionObserver(([e]) => {
      // Passou = saiu pela parte de cima da tela.
      setPassouAbertura(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    if (botao) ioBotao.observe(botao);

    const ioFim = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
      setNoFim(visiveis.size > 0);
    });
    fins.forEach((f) => ioFim.observe(f));

    return () => {
      ioBotao.disconnect();
      ioFim.disconnect();
    };
  }, []);

  const visivel = passouAbertura && !noFim;

  return (
    <div className="barra" data-visivel={visivel} inert={!visivel}>
      <div className="flex items-center gap-3">
        <a href="#simulador" className="botao botao-acento min-h-12 flex-1" data-track="simular_clique" data-track-origem="barra">
          Simular minha conta
        </a>
        <a
          href={linkWhatsApp(mensagens.direta)}
          target="_blank"
          rel="noopener"
          aria-label="Falar com a AUREON no WhatsApp"
          className="botao botao-contorno-escuro size-12 shrink-0 p-0"
          data-track="whatsapp_clique"
          data-track-origem="barra"
          onClick={() => registrar("whatsapp_clique", { origem: "barra" })}
        >
          <WhatsappLogo size={24} weight="light" aria-hidden />
        </a>
      </div>
    </div>
  );
}
