"use client";

// Bloco final de /simulacao e /empresas: usa a última simulação da sessão para montar a mensagem.
// Sem resultado na tela, as linhas com {...} saem vazias (COPY.md, seção 7).

import { WhatsappLogo } from "@phosphor-icons/react";
import { M } from "@/components/comum/Marcadores";
import { dados as dadosDemo } from "@/data/demo";
import { kwp, lerConta, real, simular } from "@/data/simulador";
import { linkWhatsApp, mensagemEmpresa, mensagemSimulacao, mensagemVisita, mensagens, type DadosSimulacao } from "@/data/site";
import { registrar } from "@/lib/metricas";
import { useEstadoSimulador } from "@/lib/simulacao-estado";

export function BotaoFinalSimulacao({ empresas }: { empresas?: boolean }) {
  const est = useEstadoSimulador();
  const conta = lerConta(est.contaTexto);
  const r = simular({ imovel: est.imovel, conta, horario: est.horario });
  const dados: DadosSimulacao = {
    cidade: est.cidade || undefined,
    imovel: est.imovel,
    conta: conta ? real(conta) : undefined,
    kwpMin: r.tipo === "faixa" ? kwp(r.kwp.min) : undefined,
    kwpMax: r.tipo === "faixa" ? kwp(r.kwp.max) : undefined,
  };
  const mensagem = empresas ? mensagemEmpresa(dados) : r.tipo === "vazio" ? mensagens.direta : mensagemSimulacao(dados);

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-8">
        <a
          href={linkWhatsApp(mensagem)}
          target="_blank"
          rel="noopener"
          className="botao botao-acento min-h-[52px]"
          data-track="whatsapp_clique"
          data-track-origem={empresas ? "empresas" : "simulacao-final"}
          onClick={() => registrar("whatsapp_clique", { origem: empresas ? "empresas" : "simulacao-final" })}
        >
          <WhatsappLogo size={24} weight="light" aria-hidden />
          {empresas ? "Enviar a conta da empresa no WhatsApp" : "Enviar minha simulação no WhatsApp"}
        </a>
        {empresas ? null : (
          <a
            href={linkWhatsApp(mensagemVisita(dados))}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center"
            data-track="visita_clique"
            data-track-origem="simulacao-final"
            onClick={() => registrar("visita_clique", { origem: "simulacao-final" })}
          >
            <span className="traco">Prefiro agendar a visita técnica</span>
          </a>
        )}
      </div>
      {empresas ? (
        <p className="text-small text-titanio-escuro">
          <M>{dadosDemo.respostaEmpresas}</M>
        </p>
      ) : null}
    </div>
  );
}
