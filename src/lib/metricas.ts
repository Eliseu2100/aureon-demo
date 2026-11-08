// Eventos de medição pedidos na ARQUITETURA.md (seção 7, handoff do front-end).
// Na demo não há ferramenta de análise ligada: o evento só vai para window.dataLayer se ela existir
// (GTM/GA4 entram depois, com aviso de cookies na /privacidade). Nada é enviado a servidor próprio.

export type Evento =
  | "porta_casa"
  | "porta_empresa"
  | "simulador_inicio"
  | "simulador_resultado"
  | "whatsapp_clique"
  | "visita_clique";

type ComDataLayer = Window & { dataLayer?: Record<string, unknown>[] };

export function registrar(evento: Evento, dados: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  (window as ComDataLayer).dataLayer?.push({ event: evento, ...dados });
}
