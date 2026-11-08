"use client";

// Topo fixo (DESIGN.md, "Topo fixo"; ARQUITETURA.md, seção 5 "Menu no celular").
// Estado visual pela superfície que está passando atrás dele:
//   transparente = sobre a abertura da home (seção com data-topo="transparente")
//   escuro / claro = seção com data-superficie="escura" | "clara"
// O engenheiro-front-end só precisa marcar as seções com esses atributos.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contato, ctaSimular, empresa, linkWhatsApp, mensagens, navegacao } from "@/data/site";
import { registrar } from "@/lib/metricas";
import { IndicadorHora } from "./IndicadorHora";

type Estado = "transparente" | "escuro" | "claro";

export function Topo() {
  const pathname = usePathname();
  const [estado, setEstado] = useState<Estado>("escuro");
  // Superfície clara que pede o topo claro sólido (painel do simulador sobre a noite; rodada 2, item 4).
  const [solido, setSolido] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const linkWhats = linkWhatsApp(mensagens.direta);

  // Superfície atrás do topo: observa uma faixa fina no alto da tela.
  useEffect(() => {
    const secoes = Array.from(document.querySelectorAll<HTMLElement>("[data-superficie]"));
    if (secoes.length === 0) return;
    // Na troca de hora (desktop largo) a abertura e o 1b ficam presos um sobre o outro e cruzam a
    // faixa juntos. Regra: transparente enquanto uma seção com data-topo="transparente" estiver na
    // faixa; senão vale a última seção (a de cima na pilha). A cena tira o data-topo da abertura
    // quando a frase do 1b aparece e avisa com o evento "topo:recalcular".
    const dentro = new Set<HTMLElement>();
    const calcular = () => {
      const atuais = secoes.filter((s) => dentro.has(s));
      const alvo = atuais[atuais.length - 1];
      if (atuais.some((el) => el.dataset.topo === "transparente")) setEstado("transparente");
      else if (alvo) setEstado(alvo.dataset.superficie === "clara" ? "claro" : "escuro");
      setSolido(alvo?.dataset.topo === "solido");
    };
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) dentro.add(e.target as HTMLElement);
          else dentro.delete(e.target as HTMLElement);
        }
        calcular();
      },
      { rootMargin: "0px 0px -96% 0px" },
    );
    secoes.forEach((s) => io.observe(s));
    window.addEventListener("topo:recalcular", calcular);
    return () => {
      io.disconnect();
      window.removeEventListener("topo:recalcular", calcular);
    };
  }, [pathname]);

  // Menu do celular: Esc fecha, página por trás não rola nem recebe foco, foco volta ao botão.
  useEffect(() => {
    if (!menuAberto) return;
    const inertes = Array.from(document.querySelectorAll<HTMLElement>("[data-inerte-no-menu]"));
    inertes.forEach((el) => (el.inert = true));
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    painel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setMenuAberto(false);
    window.addEventListener("keydown", tecla);
    const botao = botaoMenu.current;
    return () => {
      inertes.forEach((el) => (el.inert = false));
      document.documentElement.style.overflow = overflow;
      window.removeEventListener("keydown", tecla);
      botao?.focus();
    };
  }, [menuAberto]);

  // Navegar fecha o menu (inclui o gesto de voltar do navegador). Ajuste durante o render, sem efeito.
  const [rotaAnterior, setRotaAnterior] = useState(pathname);
  if (rotaAnterior !== pathname) {
    setRotaAnterior(pathname);
    setMenuAberto(false);
  }

  // Com o menu aberto o topo fica escuro e opaco (o painel é obsidiana; QA, achado 22); fechado,
  // segue a superfície atrás.
  const estadoVisual: Estado = menuAberto ? "escuro" : estado;
  const contorno = estadoVisual === "claro" ? "botao-contorno-claro" : "botao-contorno-escuro";

  return (
    <header
      className="topo"
      data-estado={estadoVisual}
      data-solido={!menuAberto && solido ? "true" : undefined}
      data-menu={menuAberto ? "aberto" : undefined}
    >
      <div className="conteiner flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label="AUREON, página inicial" className="inline-flex min-h-11 items-center font-display text-logo font-semibold uppercase">
          {empresa.nome}
        </Link>

        {pathname === "/" ? <IndicadorHora /> : null}

        <nav aria-label="Principal" className="hidden shrink-0 items-center gap-8 lg:flex">
          {navegacao.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="text-small"
            >
              <span className="traco--hover">{item.rotulo}</span>
            </Link>
          ))}
          <a
            href={linkWhats}
            target="_blank"
            rel="noopener"
            className="text-small"
            data-track="whatsapp_clique"
            data-track-origem="topo"
            onClick={() => registrar("whatsapp_clique", { origem: "topo" })}
          >
            <span className="traco--hover">WhatsApp</span>
          </a>
          <Link href={ctaSimular.href} className={`botao ${contorno}`} data-track="simular_clique" data-track-origem="topo">
            {ctaSimular.rotulo}
          </Link>
        </nav>

        <button
          ref={botaoMenu}
          type="button"
          className={`botao ${contorno} lg:hidden`}
          aria-expanded={menuAberto}
          aria-controls="menu-celular"
          onClick={() => setMenuAberto((v) => !v)}
        >
          {menuAberto ? "Fechar" : "Menu"}
        </button>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!menuAberto}
        className="sup-escura fixed inset-x-0 bottom-0 top-[var(--topo-h)] overflow-y-auto lg:hidden"
      >
        <nav aria-label="Menu" className="conteiner flex min-h-full flex-col justify-between gap-10 py-10">
          {/* Links do painel: 56 px de altura, tipografia grande e hairline entre eles (QA, achado 23). */}
          <ul className="menu-links">
            {navegacao.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="menu-links__link"
                  onClick={() => setMenuAberto(false)}
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            <Link
              href={ctaSimular.href}
              className="botao botao-acento w-full"
              data-track="simular_clique"
              data-track-origem="menu"
              onClick={() => setMenuAberto(false)}
            >
              {ctaSimular.rotulo}
            </Link>
            <a
              href={linkWhats}
              target="_blank"
              rel="noopener"
              className="botao botao-contorno-escuro w-full"
              data-track="whatsapp_clique"
              data-track-origem="menu"
              onClick={() => registrar("whatsapp_clique", { origem: "menu" })}
            >
              Falar no WhatsApp
            </a>
            <p className="text-micro text-titanio">
              {empresa.endereco} · {contato.whatsappExibicao}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
