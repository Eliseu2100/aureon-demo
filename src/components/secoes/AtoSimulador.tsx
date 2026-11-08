// Ato VI. Simulador e WhatsApp (COPY.md, seção 6). 20h: a casa acesa é o clímax do dia.
// DIRECAO.md, "Ajustes pós-revisão", item C:
//   desktop: a foto da noite fica presa no fundo do ato inteiro (sticky, 100svh). Primeiro uma tela
//            só da noite (eyebrow + H2 sobre o céu, colunas 1-7); depois o painel sobe por cima, nas
//            colunas 1-6, e as janelas acesas (7-12) ficam à vista. Rolagem normal, sem sequestro.
//   celular: tela da noite de 85svh; o painel entra subindo 15svh sobre o pé da foto.
// Âmbar só no botão "Enviar minha simulação no WhatsApp". O id #simulador fica no painel: o botão
// da abertura desce direto para a ferramenta, e a barra do celular some quando o painel entra.

import { FotoHora } from "@/components/comum/FotoHora";
import { SubidaPainel } from "@/components/movimento/SubidaPainel";
import { Simulador } from "@/components/simulador/Simulador";

export function AtoSimulador() {
  return (
    <section
      id="ato-noite"
      aria-labelledby="simulador-titulo"
      data-superficie="escura"
      data-hora-ato="20h"
      className="noite sup-escura relative"
    >
      <div aria-hidden className="noite__fundo">
        <div className="noite__foto">
          <FotoHora hora="20h" modo="lazy" decorativa className="foto-cobre" />
          <div className="noite__scrim" />
          <p className="legenda-ilustrativa">imagem ilustrativa</p>
        </div>
      </div>

      <div className="conteiner grade relative">
        <div data-revela="grupo" className="noite__titulo col-span-4 sm:col-span-8 lg:col-span-7">
          <p className="text-eyebrow font-medium text-nevoa">
            <span className="xl:hidden">20h · </span>Simulação em faixa
          </p>
          <h2 id="simulador-titulo" className="mt-4 text-h2">
            Quanto custa e quando se paga.
          </h2>
        </div>

        <div
          id="simulador"
          data-superficie="clara"
          data-topo="solido"
          className="noite__painel painel-sim sup-clara col-span-4 sm:col-span-8 lg:col-span-6"
        >
          <p className="max-w-[var(--measure-lead)] px-5 pt-5 text-lead sm:px-8 sm:pt-8">
            Digite o valor da conta. A AUREON mostra a faixa e cada premissa usada no cálculo.
          </p>
          <Simulador variante="compacto" contexto="home" empilhado />
        </div>
      </div>
      {/* O painel sobe por cima da foto presa, ligado à rolagem (docs/MOTION.md, "Tela da noite"). */}
      <SubidaPainel alvo="simulador" />
    </section>
  );
}
