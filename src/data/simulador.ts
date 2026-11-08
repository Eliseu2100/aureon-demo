// Lógica e premissas do simulador (home, /simulacao, /empresas). Cálculo só no navegador.
//
// REGRA: o resultado é sempre FAIXA, com as premissas à vista (COPY.md, seção 5).
// Cada número abaixo traz a fonte. Onde a PESQUISA.md não levantou o dado, o valor está marcado
// como PROVISÓRIO DA DEMO e precisa de [revisão técnica] / [confirmar com o cliente] antes de
// qualquer uso real. Na tela, a premissa correspondente aparece com o marcador do COPY.

import { fioB } from "./regras";

export type Imovel = "Casa" | "Empresa";
export type Telhado = "Cerâmica" | "Fibrocimento" | "Laje" | "Metálico" | "Não sei";
export type Horario = "Mais de dia" | "Meio a meio" | "Mais à noite";

export const TELHADOS: Telhado[] = ["Cerâmica", "Fibrocimento", "Laje", "Metálico", "Não sei"];
export const HORARIOS: Horario[] = ["Mais de dia", "Meio a meio", "Mais à noite"];

/** Padrão do horário pelo tipo (ARQUITETURA.md, seção 5): casa = mais à noite; empresa = mais de dia. */
export const horarioPadrao = (imovel: Imovel): Horario => (imovel === "Empresa" ? "Mais de dia" : "Mais à noite");

export const premissas = {
  /**
   * Tarifa média com impostos, R$/kWh. Enel SP (agente ELETROPAULO), REH ANEEL nº 3.596/2026,
   * vigência 04/07/2026 a 03/07/2027: TUSD R$ 472,42 + TE R$ 316,96 por MWh = R$ 0,7894/kWh sem
   * tributos (B1 e B3 convencional). Com ICMS 18% (LC 194/2022) e PIS/COFINS estimado em 4–6%:
   * R$ 1,01–1,04. Usado o meio da faixa. PESQUISA.md, seção 11. [conferir numa fatura real]
   */
  tarifaKwh: 1.03,

  /**
   * Geração mensal por kWp instalado em Santo André, kWh. PVGIS 5.3 (JRC/Comissão Europeia, dados
   * 2005–2023, perda total 24%): média de 106 (10°) a 108 (23°, norte); pior mês 95, melhor 120.
   * Faixa conservadora para o simulador. PESQUISA.md, seção 11. [conferir no CRESESB/SunData]
   */
  geracaoKwhPorKwp: { min: 100, max: 115 },

  /**
   * Fio B integral, R$ por kWh compensado. Componente TUSD_FioB da Enel SP 2026 = R$ 212,08/MWh
   * sem tributos (ANEEL, componentes tarifárias). Se ICMS/PIS/COFINS incidirem sobre a parcela
   * compensada, sobe para cerca de R$ 0,275 — regra de SP não confirmada. PESQUISA.md, seção 11.
   * [revisão técnica]
   */
  fioBIntegralKwh: 0.2121,

  /**
   * Custo de disponibilidade (o mínimo que a distribuidora cobra mesmo com solar), em kWh.
   * REN ANEEL 1.000/2021: 30 kWh monofásico, 50 kWh bifásico, 100 kWh trifásico. Casa = bifásico,
   * empresa = trifásico, por hipótese. [revisão técnica]
   */
  disponibilidadeKwh: { Casa: 50, Empresa: 100 } satisfies Record<Imovel, number>,

  /**
   * Parte da geração que passa pela rede e volta como crédito (é sobre ela que o fio B incide,
   * Lei 14.300/2022, art. 27). Depende do horário de consumo (COPY.md, /lei-14300, bloco 7).
   * PROVISÓRIO DA DEMO: faixas largas de propósito; o número real sai da visita. [revisão técnica]
   */
  fracaoCompensada: {
    "Mais de dia": { min: 0.3, max: 0.6 },
    "Meio a meio": { min: 0.5, max: 0.8 },
    "Mais à noite": { min: 0.7, max: 1.0 },
  } satisfies Record<Horario, { min: number; max: number }>,

  /**
   * Preço por Wp, R$. O COPY pede "Preço por Wp da AUREON: R$ [a] a R$ [b] [confirmar com o
   * cliente]". Enquanto o cliente não informa, o cálculo usa a faixa do mercado citada no próprio
   * COPY (/simulacao, bloco 3): estudo Greener de GD 2025, via Olhar Digital (17/05/2026):
   * 4 kWp entre R$ 16 mil e R$ 22 mil; 8 kWp entre R$ 30 mil e R$ 40 mil (PESQUISA, seção 2).
   * Entre 4 e 8 kWp, interpolação linear; fora disso, o preço por Wp do ponto mais próximo.
   */
  precoWp: [
    { kwp: 4, min: 16000 / 4000, max: 22000 / 4000 },
    { kwp: 8, min: 30000 / 8000, max: 40000 / 8000 },
  ],

  /**
   * Limites do simulador, R$ por mês. COPY.md: "Conta abaixo de R$ [mínimo] [confirmar]" e
   * "Conta acima de R$ [máximo] [confirmar]". PROVISÓRIO DA DEMO. [confirmar com o cliente]
   */
  contaMinima: 150,
  contaMaxima: { Casa: 5000, Empresa: 20000 } satisfies Record<Imovel, number>,

  /** Controle deslizante: faixa de arraste (o campo de texto aceita além disso). */
  deslizante: { min: 100, max: 5000, passo: 10 },
};

export type Entrada = {
  imovel: Imovel;
  conta: number | null;
  horario: Horario;
};

export type Faixa = { min: number; max: number };

export type Resultado =
  | { tipo: "vazio" }
  | { tipo: "baixa" }
  | { tipo: "alta" }
  | {
      tipo: "faixa";
      kwp: Faixa;
      investimento: Faixa;
      economiaMes2026: Faixa;
      retornoAnos: Faixa;
    };

function precoPorWp(kwp: number) {
  const [a, b] = premissas.precoWp;
  if (kwp <= a.kwp) return { min: a.min, max: a.max };
  if (kwp >= b.kwp) return { min: b.min, max: b.max };
  const t = (kwp - a.kwp) / (b.kwp - a.kwp);
  return { min: a.min + t * (b.min - a.min), max: a.max + t * (b.max - a.max) };
}

/** Parcela do fio B no ano. Depois de 2028 a regra não existe: mantém 90% (a última conhecida). */
function parcelaFioB(ano: number) {
  const conhecidos = fioB.filter((f) => f.percentual !== null);
  const linha = conhecidos.find((f) => f.ano === ano) ?? conhecidos[conhecidos.length - 1];
  return (linha.percentual ?? 0) / 100;
}

/** Economia mensal num ano: conta de hoje menos o que sobra (disponibilidade + fio B). */
function economiaMensal(conta: number, imovel: Imovel, energiaCompensavel: number, fracao: number, ano: number) {
  const disponibilidade = premissas.disponibilidadeKwh[imovel] * premissas.tarifaKwh;
  const fio = energiaCompensavel * fracao * parcelaFioB(ano) * premissas.fioBIntegralKwh;
  return Math.max(0, conta - disponibilidade - fio);
}

/** Anos até a economia somada pagar o investimento, com a parcela do fio B de cada ano. */
function anosDeRetorno(investimento: number, mensalPorAno: (ano: number) => number) {
  let acumulado = 0;
  for (let i = 0; i < 40; i++) {
    const anual = mensalPorAno(2026 + i) * 12;
    if (anual <= 0) return Infinity;
    if (acumulado + anual >= investimento) return i + (investimento - acumulado) / anual;
    acumulado += anual;
  }
  return Infinity;
}

const arred = (x: number, passo: number, modo: "baixo" | "cima") =>
  (modo === "baixo" ? Math.floor(x / passo) : Math.ceil(x / passo)) * passo;

export function simular({ imovel, conta, horario }: Entrada): Resultado {
  if (conta === null || conta <= 0) return { tipo: "vazio" };
  if (conta < premissas.contaMinima) return { tipo: "baixa" };
  if (conta > premissas.contaMaxima[imovel]) return { tipo: "alta" };

  const consumoKwh = conta / premissas.tarifaKwh;
  const energiaCompensavel = Math.max(0, consumoKwh - premissas.disponibilidadeKwh[imovel]);
  const g = premissas.geracaoKwhPorKwp;
  const kwpMin = energiaCompensavel / g.max;
  const kwpMax = energiaCompensavel / g.min;

  const investMin = kwpMin * 1000 * precoPorWp(kwpMin).min;
  const investMax = kwpMax * 1000 * precoPorWp(kwpMax).max;

  const f = premissas.fracaoCompensada[horario];
  const econMax = (ano: number) => economiaMensal(conta, imovel, energiaCompensavel, f.min, ano);
  const econMin = (ano: number) => economiaMensal(conta, imovel, energiaCompensavel, f.max, ano);

  return {
    tipo: "faixa",
    kwp: { min: arred(kwpMin, 0.1, "baixo"), max: arred(kwpMax, 0.1, "cima") },
    investimento: { min: arred(investMin, 500, "baixo"), max: arred(investMax, 500, "cima") },
    economiaMes2026: { min: arred(econMin(2026), 10, "baixo"), max: arred(econMax(2026), 10, "cima") },
    retornoAnos: {
      min: arred(anosDeRetorno(investMin, econMax), 0.5, "baixo"),
      max: arred(anosDeRetorno(investMax, econMin), 0.5, "cima"),
    },
  };
}

// Formatação pt-BR
const fmtReal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const fmt1 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const real = (n: number) => fmtReal.format(n);
export const kwp = (n: number) => fmt1.format(n);
export const anos = (n: number) => (Number.isInteger(n) ? String(n) : fmt1.format(n));

/** Lei de Postel: aceita "680", "680,50", "680.50", "R$680", "1.200", "R$ 1.234,56". Guarda só reais inteiros. */
export function lerConta(texto: string): number | null {
  const semCentavos = texto.includes(",")
    ? texto.replace(/,\d{0,2}\s*$/, "")
    : texto.replace(/\.\d{1,2}\s*$/, "");
  const digitos = semCentavos.replace(/\D/g, "");
  if (!digitos) return null;
  return Math.min(Number(digitos), 999999);
}

/**
 * Máscara do campo da conta enquanto a pessoa digita: milhar com ponto, decimal com vírgula (até 2
 * casas). "680,50" fica "680,50" (antes a vírgula sumia e virava 68.050). Ponto digitado no fim
 * ("680." ou "680.5") vira vírgula decimal, porque o teclado numérico de muito celular só tem ponto.
 * Apagando (inputType "delete..."), "1.234" -> "1.23" não vira decimal: volta a ser 123.
 */
export function formatarDigitacao(bruto: string, inputType?: string): string {
  let texto = bruto;
  const apagando = inputType?.startsWith("delete") ?? false;
  if (!apagando && !texto.includes(",")) {
    texto = texto.replace(/\.(\d{0,2})\s*$/, ",$1");
  }
  const virgula = texto.indexOf(",");
  const parteInteira = (virgula === -1 ? texto : texto.slice(0, virgula)).replace(/\D/g, "");
  if (!parteInteira) return "";
  const inteiro = real(Math.min(Number(parteInteira), 999999));
  if (virgula === -1) return inteiro;
  const centavos = texto.slice(virgula + 1).replace(/\D/g, "").slice(0, 2);
  return `${inteiro},${centavos}`;
}
