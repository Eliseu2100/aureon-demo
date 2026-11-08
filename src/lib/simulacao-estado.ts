"use client";

// Estado do simulador compartilhado entre componentes (simulador, porta Casa, bloco final).
// Fica em sessionStorage: some ao fechar a aba (STACK.md, seção 8, "volta do WhatsApp").

import { useSyncExternalStore } from "react";
import { horarioPadrao, type Horario, type Imovel, type Telhado } from "@/data/simulador";

export type EstadoSimulador = {
  imovel: Imovel;
  cidade: string;
  contaTexto: string;
  telhado: Telhado;
  horario: Horario;
  /** true depois que a pessoa mexeu no horário: aí trocar Casa/Empresa não sobrescreve. */
  horarioManual: boolean;
};

const CHAVE = "aureon-simulador";

export const ESTADO_INICIAL: EstadoSimulador = {
  imovel: "Casa",
  cidade: "",
  contaTexto: "",
  telhado: "Não sei",
  horario: horarioPadrao("Casa"),
  horarioManual: false,
};

let atual: EstadoSimulador | null = null;
const ouvintes = new Set<() => void>();

function ler(): EstadoSimulador {
  if (atual) return atual;
  try {
    const salvo = sessionStorage.getItem(CHAVE);
    atual = salvo ? { ...ESTADO_INICIAL, ...(JSON.parse(salvo) as Partial<EstadoSimulador>) } : ESTADO_INICIAL;
  } catch {
    atual = ESTADO_INICIAL;
  }
  return atual;
}

export function atualizar(parcial: Partial<EstadoSimulador>) {
  const anterior = ler();
  const novo = { ...anterior, ...parcial };
  // Trocar o tipo puxa o horário padrão, a não ser que a pessoa já tenha escolhido.
  if (parcial.imovel && !novo.horarioManual && parcial.horario === undefined) {
    novo.horario = horarioPadrao(parcial.imovel);
  }
  atual = novo;
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(novo));
  } catch {
    /* navegação privada sem storage: segue só em memória */
  }
  ouvintes.forEach((f) => f());
}

function assinar(f: () => void) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

export function useEstadoSimulador() {
  return useSyncExternalStore(assinar, ler, () => ESTADO_INICIAL);
}
