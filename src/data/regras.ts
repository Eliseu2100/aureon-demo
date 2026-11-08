// Todo dado que muda com o tempo (reajuste, fio B) mora SÓ aqui (ARQUITETURA.md, "Regra que muda").
// Home, /simulacao, /empresas e /lei-14300 leem daqui. Trocar o número num lugar só.
// Fontes: docs/PESQUISA.md. Antes de publicar em cliente real: [revisão técnica].

import { dados } from "./demo";

export const revisadoEm = dados.revisadoEm; // [confirmar antes de publicar]; marcador em src/data/demo.ts

export const reajuste = {
  vigenciaDesde: "04/07/2026",
  rotulo: "reajuste de julho de 2026",
  baixaTensao: { valor: 8.97, texto: "+8,97%" }, // casa
  altaTensao: { valor: 15, texto: "+15%" }, // empresa
  fonte: "ANEEL, reajuste em vigor desde 04/07/2026 (via Agência iNFRA)",
};

export type AnoFioB = { ano: number; percentual: number | null; hoje?: boolean; nota?: string };

/** Parcela do fio B cobrada sobre a energia compensada. Lei 14.300/2022, art. 27. */
export const fioB: AnoFioB[] = [
  { ano: 2023, percentual: 15 },
  { ano: 2024, percentual: 30 },
  { ano: 2025, percentual: 45 },
  { ano: 2026, percentual: 60, hoje: true },
  { ano: 2027, percentual: 75 },
  { ano: 2028, percentual: 90 },
  { ano: 2029, percentual: null, nota: "regra em aberto na ANEEL" },
];

export const fonteFioB = "Lei 14.300/2022, art. 27";
