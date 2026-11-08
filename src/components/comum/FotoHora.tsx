// Foto de uma hora da casa. <picture> com a vertical (2160 x 3856) no celular/tablet em pé e a
// horizontal 16:9 no resto. As horas não passam pelo next/image (STACK.md, seção 5): WebP prontos.
//
// modo:
//   "lcp"     = a 17h da abertura: fetchpriority alto, nunca lazy.
//   "lazy"    = foto abaixo da dobra.
//   "adiado"  = camada da troca de hora: o srcset vai em data-*, o JS liga depois do load.

import { horas, MIDIA_VERTICAL, PROPORCAO_M, srcSetHora, srcSetHoraM, type Hora } from "@/data/site";

type Props = {
  hora: Hora;
  modo: "lcp" | "lazy" | "adiado";
  /** Leitor de tela: camadas repetidas da mesma cena ficam decorativas (alt vazio). */
  decorativa?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Só a horizontal (ex.: quadro do 1b no desktop). */
  semVertical?: boolean;
};

export function FotoHora({ hora, modo, decorativa, sizes = "100vw", className = "", imgClassName = "", semVertical }: Props) {
  const h = horas[hora];
  const srcset = srcSetHora(h.base);
  const srcsetM = srcSetHoraM(h.base);
  const adiado = modo === "adiado";

  return (
    <picture className={className} data-hora={hora}>
      {semVertical ? null : (
        <source
          media={MIDIA_VERTICAL}
          sizes="100vw"
          width={PROPORCAO_M.largura}
          height={PROPORCAO_M.altura}
          {...(adiado ? { "data-srcset": srcsetM } : { srcSet: srcsetM })}
        />
      )}
      {/* <img> nativo dentro de <picture>: WebP pré-gerados com srcset (STACK.md, seção 5) */}
      <img
        alt={decorativa ? "" : h.alt}
        width={1920}
        height={1080}
        sizes={sizes}
        className={imgClassName}
        decoding={modo === "lcp" ? "sync" : "async"}
        {...(modo === "lcp" ? { fetchPriority: "high" as const, src: `${h.base}-1920.webp`, srcSet: srcset } : {})}
        {...(modo === "lazy" ? { loading: "lazy" as const, src: `${h.base}-1920.webp`, srcSet: srcset } : {})}
        {...(adiado ? { "data-srcset": srcset, "data-src": `${h.base}-1920.webp` } : {})}
      />
    </picture>
  );
}
