import type { Metadata } from "next";
import Link from "next/link";
import { PaginaInterna } from "@/components/layout/PaginaInterna";

// Título próprio da 404 (QA, achado 16): antes herdava o da home.
export const metadata: Metadata = {
  title: "Página não encontrada · AUREON",
  robots: { index: false, follow: false },
};

export default function NaoEncontrada() {
  return (
    <PaginaInterna titulo="Esta página não existe." resumo="O endereço pode ter mudado. As páginas mais procuradas estão aqui.">
      <Link href="/simulacao" className="botao botao-acento mt-8">
        Simular minha conta
      </Link>
      <ul className="mt-8 flex flex-wrap gap-6 text-body">
        <li>
          <Link href="/simulacao"><span className="traco">Simulação</span></Link>
        </li>
        <li>
          <Link href="/lei-14300"><span className="traco">Taxação solar</span></Link>
        </li>
        <li>
          <Link href="/empresas"><span className="traco">Para empresas</span></Link>
        </li>
      </ul>
    </PaginaInterna>
  );
}
