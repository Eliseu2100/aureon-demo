// Faixa da assinatura do desenvolvedor (DESIGN.md, "Rodapé com a assinatura do desenvolvedor").
// Discreta: 13 px, cinza titânio, não compete com o botão da AUREON.

import Image from "next/image";
import { assinatura } from "@/data/site";

export function AssinaturaDev() {
  return (
    <div className="border-t border-linha-escuro">
      <div className="conteiner flex flex-col items-start gap-[var(--assin-gap)] py-[var(--assin-py)] text-micro text-titanio lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-[var(--assin-gap)]">
          <Image
            src="/images/assinatura-es.png"
            alt=""
            width={28}
            height={28}
            className="size-[var(--assin-logo)]"
          />
          <span>{assinatura.texto}</span>
        </div>
        <div className="flex flex-col items-start gap-x-[var(--assin-gap)] sm:flex-row sm:flex-wrap sm:items-center">
          <a href={assinatura.link} target="_blank" rel="noopener" className="link-discreto alvo-toque">
            <span className="traco--hover">{assinatura.rotuloLink}</span>
          </a>
          <a href={`mailto:${assinatura.email}`} className="link-discreto alvo-toque">
            <span className="traco--hover">{assinatura.email}</span>
          </a>
          <span>{assinatura.nota}</span>
        </div>
      </div>
    </div>
  );
}
