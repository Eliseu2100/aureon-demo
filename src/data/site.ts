// Contatos, navegação e mensagens de WhatsApp. Texto aprovado em docs/COPY.md.
import { dados, modoDemo } from "./demo";

// A AUREON é fictícia. Na demo, TODO WhatsApp fala com o Eliseu (quem fez o site), com a mensagem
// prefixada por "[Demo AUREON]". Nunca usar número inventado.

export const empresa = {
  nome: "AUREON",
  nomeCompleto: "AUREON Solar",
  cidade: "Santo André",
  regiao: "ABC paulista",
  // Dados abaixo: [confirmar com o cliente]. Valores de exemplo ou marcadores: src/data/demo.ts.
  endereco: dados.endereco,
  cnpj: dados.cnpj,
  engenheiro: dados.engenheiroRodape,
  telefone: dados.telefone,
  horario: dados.horario,
};

export const contato = {
  whatsappNumero: "5511912725107",
  whatsappExibicao: "(11) 91272-5107",
};

const PREFIXO_DEMO = "[Demo AUREON]";

export type OrigemWhatsApp = "topo" | "abertura" | "barra" | "simulador" | "visita" | "empresas" | "rodape" | "menu" | "sem-js";

/** Link wa.me com a mensagem codificada. A origem é só para medição (evento), não vai no texto. */
export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${contato.whatsappNumero}?text=${encodeURIComponent(`${PREFIXO_DEMO} ${mensagem}`)}`;
}

// Mensagens prontas (COPY.md, seção 7). As de simulação são montadas pelo simulador.
export const mensagens = {
  direta: [
    "Olá, AUREON. Quero uma simulação de energia solar.",
    "Cidade:",
    "Imóvel (casa ou empresa):",
    "Conta média: R$",
    "Vou mandar a foto da conta de luz em seguida.",
  ].join("\n"),
};

export type DadosSimulacao = {
  cidade?: string;
  imovel?: "Casa" | "Empresa";
  conta?: string;
  kwpMin?: string;
  kwpMax?: string;
  segmento?: string;
};

const v = (x?: string) => (x ? ` ${x}` : "");
const faixa = (d: DadosSimulacao) => (d.kwpMin && d.kwpMax ? ` ${d.kwpMin} a ${d.kwpMax} kWp` : "");

export function mensagemSimulacao(d: DadosSimulacao) {
  return [
    "Olá, AUREON. Fiz a simulação no site.",
    `Cidade:${v(d.cidade)}`,
    `Imóvel:${v(d.imovel)}`,
    `Conta média: R$${v(d.conta)}`,
    `Faixa simulada:${faixa(d)}`,
    "Vou mandar a foto da conta de luz em seguida.",
  ].join("\n");
}

export function mensagemVisita(d: DadosSimulacao) {
  return [
    "Olá, AUREON. Quero agendar a visita técnica.",
    `Cidade:${v(d.cidade)}`,
    `Imóvel:${v(d.imovel)}`,
    `Conta média: R$${v(d.conta)}`,
    `Faixa simulada:${faixa(d)}`,
    "Melhor dia e período:",
  ].join("\n");
}

export function mensagemEmpresa(d: DadosSimulacao) {
  return [
    "Olá, AUREON. Quero uma simulação para a minha empresa.",
    `Cidade:${v(d.cidade)}`,
    `Segmento (comércio, clínica, galpão...):${v(d.segmento)}`,
    `Conta média: R$${v(d.conta)}`,
    `Faixa simulada:${faixa(d)}`,
    "Vou mandar a foto da conta de luz em seguida.",
  ].join("\n");
}

// Navegação da demo: só páginas construídas (Decisões do Eliseu, COPY.md, item 3).
export const navegacao = [
  { href: "/empresas", rotulo: "Para empresas" },
  { href: "/lei-14300", rotulo: "Taxação solar" },
] as const;

export const ctaSimular = { href: "/simulacao", rotulo: "Simular minha conta" } as const;

export const paginasRodape = [
  { href: "/simulacao", rotulo: "Simulação" },
  { href: "/empresas", rotulo: "Para empresas" },
  { href: "/lei-14300", rotulo: "Taxação solar" },
] as const;

// [confirmar com o cliente], inclusive a lista.
export const cidades = [
  "Santo André",
  "São Bernardo do Campo",
  "São Caetano do Sul",
  "Diadema",
  "Mauá",
  "Ribeirão Pires",
  "Rio Grande da Serra",
] as const;

// Assinatura do desenvolvedor (COPY.md, "Rodapé — assinatura do desenvolvedor").
export const assinatura = {
  texto: "Desenvolvido por Eliseu Souza · Criação de Sites Premium",
  link: `https://wa.me/${contato.whatsappNumero}?text=${encodeURIComponent(
    "Olá, Eliseu! Vi o site da AUREON e quero conversar sobre um site assim.",
  )}`,
  rotuloLink: "Quero um site assim",
  email: "eliseusouzadossantos@gmail.com",
  nota: modoDemo ? dados.seloLongo : "Empresa fictícia. Site de demonstração.",
};

// As 4 horas da mesma casa (DESIGN.md, "Imagens"). Um arquivo por largura, para o srcset.
export const horas = {
  "17h": { base: "/images/casa-17h", alt: "Casa de concreto e madeira com placas solares pretas no telhado, ao sol das 17h" },
  "17h30": { base: "/images/casa-1730", alt: "A mesma casa no fim da tarde, com a primeira janela acesa" },
  "18h30": { base: "/images/casa-1830", alt: "A mesma casa na hora azul, com metade das janelas acesas" },
  "20h": { base: "/images/casa-20h", alt: "A mesma casa à noite, com o interior todo aceso" },
} as const;

export type Hora = keyof typeof horas;

export const LARGURAS_FOTO = [1280, 1920, 2560] as const;
// Verticais do celular (2160 x 3856 na origem): mesma casa recomposta em pé, céu livre no alto.
export const LARGURAS_FOTO_M = [750, 1080] as const;
export const PROPORCAO_M = { largura: 1080, altura: 1928 } as const;

/** Quando servir a vertical: celular e tablet em pé. */
export const MIDIA_VERTICAL = "(max-width: 1023.98px) and (orientation: portrait)";

export function srcSetHora(base: string) {
  return LARGURAS_FOTO.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
}

export function srcSetHoraM(base: string) {
  return LARGURAS_FOTO_M.map((w) => `${base}-m-${w}.webp ${w}w`).join(", ");
}

// Topo das páginas internas (DIRECAO.md, "Ajustes pós-revisão", item D). Desktop: faixa larga;
// celular e tablet em pé: a vertical da casa ou a foto 4:3 da obra.
export const fotosTopoInterna = {
  "lei-14300": {
    srcSet: srcSetHora(horas["18h30"].base),
    src: `${horas["18h30"].base}-1920.webp`,
    srcSetRetrato: srcSetHoraM(horas["18h30"].base),
    width: 1920,
    height: 1080,
    alt: "A casa com placas solares na hora azul, às 18h30, com metade das janelas acesas",
    foco: "62% 55%",
  },
  simulacao: {
    srcSet: srcSetHora(horas["20h"].base),
    src: `${horas["20h"].base}-1920.webp`,
    srcSetRetrato: srcSetHoraM(horas["20h"].base),
    width: 1920,
    height: 1080,
    alt: "A casa com placas solares à noite, às 20h, com o interior todo aceso",
    foco: "65% 55%",
  },
  empresas: {
    srcSet: [1280, 1920, 2560].map((w) => `/images/obra-clinica-faixa-${w}.webp ${w}w`).join(", "),
    src: "/images/obra-clinica-faixa-1920.webp",
    srcSetRetrato: [640, 960].map((w) => `/images/obra-clinica-${w}.webp ${w}w`).join(", "),
    width: 1920,
    height: 960,
    alt: "Clínica branca de dois andares com placas solares sobre a laje, de dia",
    // Faixa: recorte 2:1 já feito no foco do DESIGN; celular: a ficha 4:3.
    foco: "50% 32%",
  },
} as const;
