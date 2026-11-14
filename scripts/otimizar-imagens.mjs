// Converte as 4 horas da casa e as 3 obras (PNG do Higgsfield) em WebP nos tamanhos do DESIGN.md.
// Uso: npm run imagens   (lê ../imagens-geradas, grava em public/images)
//
// Origem (07/11/2026): horizontais em 3856 x 2160 (upscale) e verticais do celular em 2160 x 3856
// (sufixo -m, mesma casa recomposta em pé, placas inteiras e céu livre no alto para o texto).
// base-a.png, base-b.png e vert-b.png NÃO entram no site.

import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const origem = path.resolve(aqui, "../../imagens-geradas");
const destino = path.resolve(aqui, "../public/images");

const horas = ["casa-17h", "casa-1730", "casa-1830", "casa-20h"];
const LIMITE_KB = 350;

// Horizontal 16:9 (desktop e tablet deitado). 1280 alimenta o srcset em tela pequena.
const HORIZONTAL = { sufixo: "", larguras: [2560, 1920, 1280], proporcao: 9 / 16 };
// Vertical do celular. Proporção da origem (2160 x 3856), sem corte.
const VERTICAL = { sufixo: "-m", larguras: [1080, 750], proporcao: 3856 / 2160 };

// Obras do Ato IV e topo de /empresas (08/11/2026, DESIGN.md, "Obras e topo das internas").
// Origem 4:3, 2864 x 2160. Exporta em 4:3 sem corte: o enquadramento de cada lugar (ficha grande,
// pequena 5:3, faixa do topo) é feito no CSS com object-fit: cover e o ponto de foco do DESIGN.
// Substituem os recortes antigos da casa da abertura (obra-1, obra-2, obra-3), que saíram.
const OBRAS = [
  { nome: "obra-galpao", larguras: [1600, 960] },
  { nome: "obra-sobrado", larguras: [960, 640] },
  { nome: "obra-clinica", larguras: [960, 640] },
];

// Faixa do topo de /empresas (56svh no desktop, entre 2:1 e 3:1): recorte 2:1 da clínica, com o
// foco do DESIGN (50% 32%), para não baixar 4:3 inteiro e mostrar só um terço dele. O celular usa a
// ficha 4:3 (a faixa de 44svh é quase quadrada).
const FAIXAS = [{ nome: "obra-clinica", sufixo: "-faixa", larguras: [2560, 1920, 1280], proporcao: 1 / 2, focoY: 0.32 }];

// Filtro opcional: `node scripts/otimizar-imagens.mjs obra-galpao` regrava só as imagens daquele nome.
const filtro = process.argv[2];
const quer = (nome) => !filtro || nome.startsWith(filtro);

await mkdir(destino, { recursive: true });

// A 17h é o LCP: no celular (vertical) e no 1280 o teto é 200 KB (STACK.md, seção 4).
const LIMITE_LCP_KB = 200;

async function gravar(pipelineFn, saida, rotulo, limite = LIMITE_KB, piso = 70) {
  let qualidade = 80;
  // Desce a qualidade até caber no limite, sem passar do piso (70 por padrão).
  for (;;) {
    await pipelineFn().webp({ quality: qualidade, effort: 6, smartSubsample: true }).toFile(saida);
    const kb = (await stat(saida)).size / 1024;
    if (kb <= limite || qualidade <= piso) {
      console.log(`${path.basename(saida)}  ${rotulo}  q${qualidade}  ${kb.toFixed(0)} KB`);
      return;
    }
    qualidade -= 4;
  }
}

for (const nome of horas.filter(quer)) {
  for (const formato of [HORIZONTAL, VERTICAL]) {
    const entrada = path.join(origem, `${nome}${formato.sufixo}.png`);
    for (const largura of formato.larguras) {
      const altura = Math.round(largura * formato.proporcao);
      const saida = path.join(destino, `${nome}${formato.sufixo}-${largura}.webp`);
      await gravar(
        () => sharp(entrada).resize(largura, altura, { fit: "cover", position: "centre", kernel: "lanczos3" }),
        saida,
        `${largura}x${altura}`,
        nome === "casa-17h" && largura <= 1280 ? LIMITE_LCP_KB : LIMITE_KB,
      );
    }
  }
}

// Obras: 300 KB por arquivo (auditoria de 14/11/2026 apontou obra-galpao-1600 com 353 KB). O piso de
// qualidade desce a 50 só aqui: são fotos de ficha, não o LCP, e o recorte fica com detalhe de sobra.
const LIMITE_OBRA_KB = 300;
for (const o of OBRAS.filter((x) => quer(x.nome))) {
  const entrada = path.join(origem, `${o.nome}.png`);
  const meta = await sharp(entrada).metadata();
  for (const largura of o.larguras) {
    const saida = path.join(destino, `${o.nome}-${largura}.webp`);
    const altura = Math.round((largura * meta.height) / meta.width);
    await gravar(() => sharp(entrada).resize(largura, altura, { kernel: "lanczos3" }), saida, `${largura}x${altura}`, LIMITE_OBRA_KB, 50);
  }
}

for (const f of FAIXAS.filter((x) => quer(x.nome))) {
  const entrada = path.join(origem, `${f.nome}.png`);
  const meta = await sharp(entrada).metadata();
  const h = Math.round(meta.width * f.proporcao);
  const extract = { left: 0, top: Math.round((meta.height - h) * f.focoY), width: meta.width, height: h };
  for (const largura of f.larguras) {
    const saida = path.join(destino, `${f.nome}${f.sufixo}-${largura}.webp`);
    const altura = Math.round(largura * f.proporcao);
    await gravar(() => sharp(entrada).extract(extract).resize(largura, altura, { kernel: "lanczos3" }), saida, `${largura}x${altura}`);
  }
}
