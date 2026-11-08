"use client";

// Simulador (COPY.md, seção 5; ARQUITETURA.md, seção 5). Cálculo no navegador, nada vai a servidor.
// Resultado sempre em faixa, com as premissas à vista. Monta a mensagem do WhatsApp (A, C ou D).
//   compacto  = home (3 campos + "Ajustar premissas" recolhido)
//   completo  = /simulacao e /empresas (os 5 campos abertos)

import { Info, Minus, Plus, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { M, SeloDemo } from "@/components/comum/Marcadores";
import { dados as dadosDemo } from "@/data/demo";
import { reajuste, revisadoEm } from "@/data/regras";
import {
  anos,
  HORARIOS,
  formatarDigitacao,
  kwp,
  lerConta,
  premissas,
  real,
  simular,
  TELHADOS,
  type Horario,
  type Imovel,
  type Telhado,
} from "@/data/simulador";
import {
  cidades,
  contato,
  linkWhatsApp,
  mensagemEmpresa,
  mensagemSimulacao,
  mensagemVisita,
  mensagens,
  type DadosSimulacao,
} from "@/data/site";
import { registrar } from "@/lib/metricas";
import { CURVAS, FAIXAS, gsap } from "@/lib/movimento";
import { atualizar, useEstadoSimulador } from "@/lib/simulacao-estado";

const OUTRA = "Outra cidade";

type Props = {
  variante: "compacto" | "completo";
  contexto: "home" | "simulacao" | "empresas";
  /** Pré-marca o tipo ao montar (ex.: /empresas abre em "Empresa"). */
  imovelInicial?: Imovel;
  /** Painel estreito (6 colunas na home, coluna de leitura em /empresas): campos e resultado empilhados. */
  empilhado?: boolean;
};

export function Simulador({ variante, contexto, imovelInicial, empilhado }: Props) {
  const id = useId();
  const est = useEstadoSimulador();
  const [ajustesAbertos, setAjustesAbertos] = useState(variante === "completo");
  const [erroCidade, setErroCidade] = useState(false);
  const [anuncio, setAnuncio] = useState("");
  const campoCidade = useRef<HTMLSelectElement>(null);
  const campoConta = useRef<HTMLInputElement>(null);
  const iniciou = useRef(false);
  const mostrouResultado = useRef(false);

  useEffect(() => {
    if (imovelInicial) atualizar({ imovel: imovelInicial });
  }, [imovelInicial]);

  const conta = lerConta(est.contaTexto);
  const resultado = simular({ imovel: est.imovel, conta, horario: est.horario });

  // Leitor de tela: avisa que o resultado mudou, sem ler todos os números a cada tecla.
  const chaveResultado = resultado.tipo === "faixa" ? `${resultado.kwp.min}-${resultado.kwp.max}` : resultado.tipo;
  useEffect(() => {
    if (resultado.tipo === "vazio") return;
    const t = window.setTimeout(() => setAnuncio("Resultado da simulação atualizado."), 600);
    return () => {
      window.clearTimeout(t);
      setAnuncio("");
    };
  }, [chaveResultado, resultado.tipo]);

  useEffect(() => {
    if (resultado.tipo === "faixa" && !mostrouResultado.current) {
      mostrouResultado.current = true;
      registrar("simulador_resultado", { origem: contexto });
    }
  }, [resultado.tipo, contexto]);

  function mexeu() {
    if (iniciou.current) return;
    iniciou.current = true;
    registrar("simulador_inicio", { origem: contexto });
  }

  const dados: DadosSimulacao = {
    cidade: est.cidade || undefined,
    imovel: est.imovel,
    conta: conta ? real(conta) : undefined,
    kwpMin: resultado.tipo === "faixa" ? kwp(resultado.kwp.min) : undefined,
    kwpMax: resultado.tipo === "faixa" ? kwp(resultado.kwp.max) : undefined,
  };

  const mensagemPrincipal =
    contexto === "empresas"
      ? mensagemEmpresa(dados)
      : resultado.tipo === "vazio"
        ? mensagens.direta
        : mensagemSimulacao(dados);

  function enviar(e: React.MouseEvent<HTMLAnchorElement>, origem: string) {
    if (resultado.tipo === "faixa" && !est.cidade) {
      e.preventDefault();
      setErroCidade(true);
      campoCidade.current?.focus();
      return;
    }
    registrar(origem === "visita" ? "visita_clique" : "whatsapp_clique", { origem });
  }

  const textoBotao =
    resultado.tipo === "baixa"
      ? "Tirar a dúvida no WhatsApp"
      : resultado.tipo === "alta"
        ? "Mandar minha conta no WhatsApp"
        : "Enviar minha simulação no WhatsApp";

  const ids = {
    cidade: `${id}-cidade`,
    cidadeAviso: `${id}-cidade-aviso`,
    conta: `${id}-conta`,
    contaAjuda: `${id}-conta-ajuda`,
    ajustes: `${id}-ajustes`,
  };

  const blocoAjustes = (
    <div className="flex flex-col gap-6">
      <Grupo
        legenda="Tipo de telhado"
        nome={`${id}-telhado`}
        opcoes={TELHADOS}
        valor={est.telhado}
        onChange={(v) => {
          mexeu();
          atualizar({ telhado: v as Telhado });
        }}
      />
      <Grupo
        legenda="Quando você mais usa energia"
        nome={`${id}-horario`}
        opcoes={HORARIOS}
        valor={est.horario}
        onChange={(v) => {
          mexeu();
          atualizar({ horario: v as Horario, horarioManual: true });
        }}
      />
    </div>
  );

  return (
    <div className="sim">
      <noscript>
        <style>{`.sim__vivo{display:none!important}`}</style>
        <div className="flex flex-col items-start gap-4 p-6">
          <p className="text-body">Mande sua conta pelo WhatsApp e a AUREON faz a simulação para você.</p>
          <a href={linkWhatsApp(mensagens.direta)} target="_blank" rel="noopener" className="botao botao-acento">
            <WhatsappLogo size={24} weight="light" aria-hidden />
            Pedir minha simulação no WhatsApp
          </a>
        </div>
      </noscript>

      <div className={`sim__vivo grid gap-8 p-5 sm:p-8 ${empilhado ? "" : "xl:grid-cols-2 xl:gap-10"}`}>
        {/* Campos */}
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()} noValidate>
          <fieldset>
            <legend className="sim__rotulo">Onde vai o sistema</legend>
            <div role="radiogroup" aria-label="Tipo de imóvel" className="sim__chave">
              {(["Casa", "Empresa"] as Imovel[]).map((op) => (
                <label key={op} className="sim__chave-op">
                  <input
                    type="radio"
                    name={`${id}-imovel`}
                    value={op}
                    checked={est.imovel === op}
                    onChange={() => {
                      mexeu();
                      atualizar({ imovel: op });
                    }}
                    className="sr-only"
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor={ids.cidade} className="sim__rotulo">
              Cidade
            </label>
            <select
              id={ids.cidade}
              ref={campoCidade}
              className="sim__campo"
              autoComplete="address-level2"
              value={est.cidade}
              aria-invalid={erroCidade && !est.cidade ? true : undefined}
              aria-describedby={ids.cidadeAviso}
              onChange={(e) => {
                mexeu();
                setErroCidade(false);
                atualizar({ cidade: e.target.value });
              }}
            >
              <option value="">Escolha a cidade</option>
              {cidades.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={OUTRA}>{OUTRA}</option>
            </select>
            <div id={ids.cidadeAviso} className="mt-2 text-small">
              {erroCidade && !est.cidade ? (
                <p className="font-medium text-carvao">Escolha a cidade para usar a tarifa certa.</p>
              ) : resultado.tipo !== "vazio" && !est.cidade ? (
                <p className="text-titanio-escuro">Calculado para o ABC. Escolha a cidade para a mensagem sair completa.</p>
              ) : est.cidade === OUTRA ? (
                <p className="text-titanio-escuro">
                  Calculado como ABC. A AUREON atende o ABC; para outras cidades, confirme pelo WhatsApp.
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor={ids.conta} className="sim__rotulo">
              Valor médio da conta de luz
            </label>
            <p id={ids.contaAjuda} className="-mt-1 mb-2 text-micro text-titanio-escuro">
              R$ por mês. Some 3 contas e divida por 3.
            </p>
            {/* Tocar em qualquer ponto da caixa (inclusive no "R$") foca o campo. */}
            <div
              className="sim__campo flex cursor-text items-center gap-2 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-ambar-escuro"
              onClick={() => campoConta.current?.focus()}
            >
              <span aria-hidden className="num text-titanio-escuro">
                R$
              </span>
              <input
                id={ids.conta}
                ref={campoConta}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                aria-describedby={ids.contaAjuda}
                className="num w-full self-stretch bg-transparent text-base outline-none"
                value={est.contaTexto}
                onChange={(e) => {
                  mexeu();
                  // Mantém a vírgula e os centavos enquanto a pessoa digita (QA, item 4).
                  const tipo = (e.nativeEvent as InputEvent).inputType;
                  atualizar({ contaTexto: formatarDigitacao(e.target.value, tipo) });
                }}
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="sim__passo"
                aria-label="Diminuir R$ 10"
                onClick={() => {
                  mexeu();
                  atualizar({ contaTexto: real(Math.max(0, (conta ?? 0) - premissas.deslizante.passo)) });
                }}
              >
                <Minus size={20} weight="light" aria-hidden />
              </button>
              <input
                type="range"
                aria-label="Ajustar o valor da conta de luz"
                className="sim__deslizante"
                min={premissas.deslizante.min}
                max={premissas.deslizante.max}
                step={premissas.deslizante.passo}
                value={Math.min(Math.max(conta ?? premissas.deslizante.min, premissas.deslizante.min), premissas.deslizante.max)}
                onChange={(e) => {
                  mexeu();
                  atualizar({ contaTexto: real(Number(e.target.value)) });
                }}
              />
              <button
                type="button"
                className="sim__passo"
                aria-label="Aumentar R$ 10"
                onClick={() => {
                  mexeu();
                  atualizar({ contaTexto: real((conta ?? 0) + premissas.deslizante.passo) });
                }}
              >
                <Plus size={20} weight="light" aria-hidden />
              </button>
            </div>
          </div>

          {variante === "compacto" ? (
            <div>
              <button
                type="button"
                className="flex min-h-12 items-center gap-2 text-left text-body font-medium underline underline-offset-4"
                aria-expanded={ajustesAbertos}
                aria-controls={ids.ajustes}
                onClick={() => setAjustesAbertos((v) => !v)}
              >
                {ajustesAbertos ? <Minus size={20} weight="light" aria-hidden /> : <Plus size={20} weight="light" aria-hidden />}
                Ajustar premissas
              </button>
              <p className="text-micro text-titanio-escuro">Telhado e horário de consumo</p>
              <div id={ids.ajustes} hidden={!ajustesAbertos} className="mt-5">
                {blocoAjustes}
              </div>
            </div>
          ) : (
            blocoAjustes
          )}
        </form>

        {/* Resultado + premissas (sempre à vista) */}
        <div className="flex flex-col gap-6">
          <section aria-labelledby={`${id}-faixa`} className="rounded-r2 bg-papel p-5 sm:p-6">
            <h3 id={`${id}-faixa`} className="text-h3">
              Sua faixa
            </h3>
            <p className="sr-only" aria-live="polite">
              {anuncio}
            </p>
            <div className="mt-4">
              {resultado.tipo === "vazio" ? (
                <p className="text-body text-titanio-escuro">Digite o valor da sua conta para ver a faixa.</p>
              ) : resultado.tipo === "baixa" ? (
                <p className="text-body">
                  Com uma conta nesse valor, o sistema costuma demorar a se pagar. Vale conversar antes de investir.
                </p>
              ) : resultado.tipo === "alta" ? (
                <p className="text-body">Acima desse valor, a conta pede projeto sob medida.</p>
              ) : (
                <dl className="divide-y divide-linha-claro">
                  <Linha ordem={0} rotulo="Potência" valor={`${kwp(resultado.kwp.min)} a ${kwp(resultado.kwp.max)} kWp`} />
                  <Linha
                    ordem={1}
                    rotulo="Investimento"
                    valor={`R$ ${real(resultado.investimento.min)} a R$ ${real(resultado.investimento.max)}`}
                  />
                  <Linha
                    ordem={2}
                    rotulo="Economia por mês em 2026"
                    valor={`R$ ${real(resultado.economiaMes2026.min)} a R$ ${real(resultado.economiaMes2026.max)}`}
                    verde
                  />
                  <Linha ordem={3} rotulo="Retorno" valor={`${anos(resultado.retornoAnos.min)} a ${anos(resultado.retornoAnos.max)} anos`} />
                </dl>
              )}
            </div>
            {est.imovel === "Empresa" && contexto !== "empresas" ? (
              <p className="mt-4 border-t border-linha-claro pt-4 text-small">
                Conta de alta tensão tem outra regra. A simulação certa está em Para empresas.{" "}
                <Link href="/empresas" className="font-medium">
                  <span className="traco">Ver Para empresas</span>
                </Link>
              </p>
            ) : null}
          </section>

          <div>
            <h3 className="flex items-center gap-2 text-small font-medium">
              <Info size={20} weight="light" aria-hidden />
              Premissas
            </h3>
            <ul className="mt-3 space-y-1.5 text-small text-titanio-escuro">
              <li>Tarifa da distribuidora vigente desde {reajuste.vigenciaDesde}</li>
              <li>Fio B: 60% em 2026, 90% em 2028</li>
              <li>
                <M>{dadosDemo.precoWp}</M>
              </li>
              <li>Sistema ligado à rede (on-grid). Não inclui bateria.</li>
              <li>
                <M>{`Atualizado em ${revisadoEm}`}</M>
              </li>
            </ul>
            <SeloDemo className="mt-4" />
          </div>
        </div>

        {/* Ações */}
        <div className={`flex flex-col gap-4 border-t border-linha-claro pt-6 ${empilhado ? "" : "xl:col-span-2"}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
            <a
              href={linkWhatsApp(mensagemPrincipal)}
              target="_blank"
              rel="noopener"
              className="botao botao-acento min-h-[52px] w-full sm:w-auto"
              data-track="whatsapp_clique"
              data-track-origem={contexto === "empresas" ? "empresas" : "simulador"}
              onClick={(e) => enviar(e, contexto === "empresas" ? "empresas" : "simulador")}
            >
              <WhatsappLogo size={24} weight="light" aria-hidden />
              {textoBotao}
            </a>
            <a
              href={linkWhatsApp(mensagemVisita(dados))}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center text-body"
              data-track="visita_clique"
              data-track-origem="simulador"
              onClick={(e) => enviar(e, "visita")}
            >
              <span className="traco">Prefiro agendar a visita técnica</span>
            </a>
          </div>
          <p className="text-small text-titanio-escuro">
            <M>{dadosDemo.quemResponde}</M>
          </p>
          <p className="hidden text-micro text-titanio-escuro lg:block">
            Abre o WhatsApp Web. Prefere copiar o número: <span className="num">{contato.whatsappExibicao}</span>
          </p>
          {contexto === "home" ? (
            <Link href="/simulacao" className="inline-flex min-h-11 items-center self-start text-body">
              <span className="traco">Ver a simulação completa, com financiamento</span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Número da faixa entrando (docs/MOTION.md, "Microinteração"): quando o valor muda, ele sobe 6 px e
// acende (opacity 0,2 -> 1), 0,4 s, curva revela. Na primeira vez que a faixa aparece, as 4 linhas
// entram em cascata de 60 ms. Só opacity e transform; com movimento reduzido, troca seca.
function Linha({ rotulo, valor, verde, ordem = 0 }: { rotulo: string; valor: string; verde?: boolean; ordem?: number }) {
  const ref = useRef<HTMLElement>(null);
  const anterior = useRef<string | null>(null);
  useEffect(() => {
    const el = ref.current;
    const primeira = anterior.current === null;
    if (anterior.current === valor) return;
    anterior.current = valor;
    if (!el || !window.matchMedia(FAIXAS.movimento).matches) return;
    gsap.fromTo(
      el,
      { opacity: primeira ? 0 : 0.2, y: primeira ? 8 : 6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: CURVAS.revela,
        delay: primeira ? ordem * 0.06 : 0,
        overwrite: true,
        clearProps: "transform,opacity",
      },
    );
  }, [valor, ordem]);
  return (
    <div className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-small text-titanio-escuro">{rotulo}</dt>
      <dd ref={ref} className={`num text-num-sm font-medium sm:text-right ${verde ? "text-verde" : "text-carvao"}`}>{valor}</dd>
    </div>
  );
}

function Grupo<T extends string>({
  legenda,
  nome,
  opcoes,
  valor,
  onChange,
}: {
  legenda: string;
  nome: string;
  opcoes: readonly T[];
  valor: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="sim__rotulo">{legenda}</legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((op) => (
          <label key={op} className="sim__opcao">
            <input type="radio" name={nome} value={op} checked={valor === op} onChange={() => onChange(op)} className="sr-only" />
            <span>{op}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
