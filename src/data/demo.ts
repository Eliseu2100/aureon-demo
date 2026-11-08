// Modo demo (COPY.md, "Modo demo — valores de exemplo", 08/11/2026).
// Na demo, os marcadores visíveis viram valores de exemplo e um selo avisa que os dados não são
// reais. Os marcadores originais ficam guardados aqui: num cliente real, trocar `modoDemo` para
// false e os marcadores reaparecem (a lista vira o roteiro da conversa com o cliente).
//
// Nenhum dado aponta para empresa, pessoa ou registro real: CNPJ com dígito inválido de propósito,
// endereço sem número e CREA claramente fictício (000000000-0), para não coincidir com o registro de
// um engenheiro de verdade (decisão do Gerente, 08/11/2026).

export const modoDemo = true;

type Obra = {
  /** Base do arquivo em public/images (sem a largura). */
  foto: string;
  larguras: readonly number[];
  /** Ponto de foco da ficha (DIRECAO.md, item A). */
  foco: string;
  alt: string;
  local: string;
  tecnico: string;
  tipo: string;
  linha?: string;
  empresa: boolean;
};

const MARCADOR_OBRA = {
  local: "[Bairro], [Cidade]",
  tecnico: "[x,x] kWp · telhado [cerâmica | fibrocimento | laje | metálico]",
};

const fotosObras = {
  galpao: {
    foto: "/images/obra-galpao",
    larguras: [960, 1600],
    foco: "50% 55%",
    alt: "Galpão industrial visto do alto, com faixas de placas solares no telhado metálico e caminhões nas docas",
    empresa: true,
  },
  sobrado: {
    foto: "/images/obra-sobrado",
    larguras: [640, 960],
    foco: "50% 30%",
    alt: "Sobrado de tijolo aparente com doze placas solares no telhado de telha cerâmica",
    empresa: false,
  },
  clinica: {
    foto: "/images/obra-clinica",
    larguras: [640, 960],
    foco: "50% 35%",
    alt: "Clínica branca de dois andares com placas solares inclinadas sobre a laje, em rua arborizada",
    empresa: true,
  },
} as const;

const exemplo = {
  escritorio: "Escritório no Jardim, Santo André",
  primeiraObra: "Primeira obra em 2014",
  engenheiro: "Eng. Ricardo Almeida, CREA-SP 000000000-0",
  engenheiroRodape: "Eng. responsável: Ricardo Almeida, CREA-SP 000000000-0",
  endereco: "Rua das Figueiras, Jardim, Santo André",
  notaGoogle: "Nota 4,9 com 86 avaliações",
  sistemas: "480 sistemas ligados na distribuidora, contados pelos pedidos de acesso aprovados",
  cnpj: "CNPJ 12.345.678/0001-00",
  telefone: "(11) 91272-5107",
  horario: "segunda a sexta, 8h às 18h; sábado, 8h às 12h",
  quemResponde: "Quem responde: Renata, em até 2 horas úteis. O preço final sai depois da visita técnica.",
  respostaEmpresas: "Resposta em até 2 horas úteis. A proposta sai em nome do CNPJ.",
  revisadoEm: "07/11/2026",
  mediaDias: "Da visita à ligação: 45 dias em média",
  prazos: ["No mesmo dia", "Até 5 dias", "15 a 20 dias", "1 a 3 dias (casa)", "7 a 15 dias"],
  garantias: ["Módulo: 12 anos (25 de desempenho)", "Inversor: 10 anos", "Instalação: 5 anos", "Telhado: 5 anos sem goteira"],
  precoWp: "Preço por Wp: R$ 3,75 a R$ 5,50 (faixa de mercado, estudo Greener)",
  precoWpTabela: { premissa: "Preço por Wp", valor: "R$ 3,75 a R$ 5,50 (faixa de mercado)", fonte: "Estudo Greener de GD 2025, via Olhar Digital (17/05/2026)" },
  financiamento: [
    { banco: "Banco parceiro (exemplo)", prazo: "60 meses", parcela: "R$ 420 a R$ 575" },
    { banco: "Banco parceiro (exemplo)", prazo: "84 meses", parcela: "R$ 350 a R$ 480" },
  ],
  financiamentoNota: "Exemplo para um sistema de 4 kWp, de R$ 16 mil a R$ 22 mil.",
  /** Ordem do Ato IV (DIRECAO.md, item A): galpão na ficha grande, sobrado e clínica nas pequenas. */
  obras: [
    {
      ...fotosObras.galpao,
      local: "Demarchi, São Bernardo do Campo",
      tecnico: "287,5 kWp · telhado metálico",
      tipo: "Empresa · ligado em novembro de 2025",
      linha: "Minigeração montada com o galpão em operação, sem parar as docas.",
    },
    {
      ...fotosObras.sobrado,
      local: "Santa Paula, São Caetano do Sul",
      tecnico: "6,9 kWp · telhado cerâmico",
      tipo: "Casa · ligado em agosto de 2025",
      linha: "Doze módulos na água norte, com gancho próprio para telha cerâmica.",
    },
    {
      ...fotosObras.clinica,
      local: "Vila Bastos, Santo André",
      tecnico: "34,5 kWp · laje plana",
      tipo: "Empresa · ligado em março de 2026",
      linha: "Clínica de dois andares. Os consultórios abrem às 7h e usam boa parte da geração na hora.",
    },
  ] as Obra[],
  selo: "Dados de exemplo · empresa fictícia",
  seloLongo:
    "Dados de exemplo · empresa fictícia. Nomes, números e obras mostram como o site fica com os dados reais de uma empresa.",
};

const marcadores: typeof exemplo = {
  escritorio: "Escritório em [bairro], Santo André",
  primeiraObra: "Primeira obra em [ano]",
  engenheiro: "Eng. [nome], CREA [nº]",
  engenheiroRodape: "Eng. responsável: [nome], CREA [nº]",
  endereco: "[Rua, nº], [bairro], Santo André",
  notaGoogle: "Nota [x] com [n] avaliações",
  sistemas: "[n] sistemas ligados na distribuidora, contados por [método]",
  cnpj: "CNPJ [nº]",
  telefone: "[número]",
  horario: "[dias e horário]",
  quemResponde: "Quem responde: [nome], em até [x] horas úteis. O preço final sai depois da visita técnica.",
  respostaEmpresas: "Resposta em até [x] horas úteis. A proposta sai em nome do CNPJ.",
  revisadoEm: "[data]",
  mediaDias: "Da visita à ligação: [x] dias em média",
  prazos: ["[prazo]", "[prazo]", "[prazo]", "[prazo]", "[prazo]"],
  garantias: ["Módulo: [x] anos", "Inversor: [x] anos", "Instalação: [x] anos", "Telhado: [x] anos"],
  precoWp: "Preço por Wp da AUREON: R$ [a] a R$ [b]",
  precoWpTabela: { premissa: "Preço por Wp da AUREON", valor: "R$ [a] a R$ [b]", fonte: "Tabela da AUREON, [data]" },
  financiamento: [{ banco: "[banco]", prazo: "[x] meses", parcela: "R$ [a] a R$ [b]" }],
  financiamentoNota: "",
  // Com cliente real, as fotos são trocadas pelas obras dele.
  obras: [
    { ...fotosObras.galpao, ...MARCADOR_OBRA, tipo: "Empresa · ligado em [mês/ano]" },
    { ...fotosObras.sobrado, ...MARCADOR_OBRA, tipo: "Casa · ligado em [mês/ano]" },
    { ...fotosObras.clinica, ...MARCADOR_OBRA, tipo: "Empresa · ligado em [mês/ano]" },
  ],
  selo: "",
  seloLongo: "",
};

/** Valores em uso no site. */
export const dados = modoDemo ? exemplo : marcadores;

/** Os dois conjuntos, para conferir ou trocar. */
export const conjuntos = { exemplo, marcadores } as const;

export function srcSetObra(o: Pick<Obra, "foto" | "larguras">) {
  return o.larguras.map((w) => `${o.foto}-${w}.webp ${w}w`).join(", ");
}
