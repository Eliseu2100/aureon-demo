// Rodapé de todas as páginas (COPY.md, seção 7) + faixa da assinatura do desenvolvedor.
// Esqueleto estrutural: o engenheiro-front-end faz a composição final (frase monumental, colunas
// recolhíveis no celular) seguindo DIRECAO.md, seção 7.

import Link from "next/link";
import { cidades, empresa, linkWhatsApp, mensagens, paginasRodape } from "@/data/site";
import { revisadoEm } from "@/data/regras";
import { AssinaturaDev } from "./AssinaturaDev";

export function Rodape() {
  return (
    <footer className="sup-escura" data-superficie="escura" data-inerte-no-menu>
      <div className="conteiner py-[var(--section-y)]">
        <p data-revela className="max-w-[var(--measure-frase)] font-display text-frase font-medium">O sol já chega ao seu telhado. Falta o projeto.</p>
        <a
          href={linkWhatsApp(mensagens.direta)}
          target="_blank"
          rel="noopener"
          className="botao botao-contorno-escuro mt-8"
          data-track="whatsapp_clique"
          data-track-origem="rodape"
        >
          Falar com a AUREON no WhatsApp
        </a>

        <div data-revela="grupo" className="grade mt-[var(--sp-9)] gap-y-10 border-t border-linha-escuro pt-10 text-small">
          <div className="col-span-4 sm:col-span-4 lg:col-span-3">
            <h2 className="mb-3 font-sans text-small font-medium text-nevoa">Empresa</h2>
            <ul className="space-y-2 text-titanio">
              <li className="text-alabastro">{empresa.nomeCompleto}</li>
              <li>{empresa.endereco}</li>
              <li>{empresa.cnpj}</li>
              <li>{empresa.engenheiro}</li>
            </ul>
          </div>
          <div className="col-span-4 sm:col-span-4 lg:col-span-3">
            <h2 className="mb-3 font-sans text-small font-medium text-nevoa">Páginas</h2>
            <ul className="lg:space-y-2">
              {paginasRodape.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="link-discreto alvo-toque text-titanio">
                    <span className="traco--hover">{p.rotulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 sm:col-span-4 lg:col-span-3">
            <h2 className="mb-3 font-sans text-small font-medium text-nevoa">Contato</h2>
            <ul className="space-y-2 text-titanio">
              <li>
                <a href={linkWhatsApp(mensagens.direta)} target="_blank" rel="noopener" className="link-discreto alvo-toque">
                  <span className="traco--hover">WhatsApp</span>
                </a>
              </li>
              <li>Telefone: {empresa.telefone}</li>
              <li>Atendimento: {empresa.horario}</li>
            </ul>
          </div>
          <div className="col-span-4 sm:col-span-4 lg:col-span-3">
            <h2 className="mb-3 font-sans text-small font-medium text-nevoa">Cidades atendidas</h2>
            <ul className="space-y-2 text-titanio">
              {cidades.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-micro text-titanio">
          <Link href="/privacidade" className="link-discreto alvo-toque">
            <span className="traco">Privacidade</span>
          </Link>{" "}
          · A simulação é uma estimativa: o valor final sai depois da visita técnica · Regras citadas revisadas
          em {revisadoEm} · © 2026 AUREON Solar
        </p>
      </div>
      <AssinaturaDev />
    </footer>
  );
}
