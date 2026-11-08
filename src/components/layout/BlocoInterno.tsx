// Bloco de corpo das páginas internas: subtítulo + conteúdo, com hairline em cima.

export function BlocoInterno({
  id,
  titulo,
  children,
  largo,
}: {
  id: string;
  titulo?: string;
  children: React.ReactNode;
  /** Ocupa a largura toda (tabela, simulador). Padrão: medida de leitura. */
  largo?: boolean;
}) {
  return (
    <section data-revela aria-labelledby={titulo ? id : undefined} className="mt-[var(--sp-9)] border-t border-linha-claro pt-10">
      {titulo ? (
        <h2 id={id} className="max-w-[24ch] text-h3">
          {titulo}
        </h2>
      ) : null}
      <div className={`${titulo ? "mt-5" : ""} ${largo ? "" : "max-w-[var(--measure-body)]"} space-y-4 text-body`}>
        {children}
      </div>
    </section>
  );
}

export function Fonte({ children }: { children: React.ReactNode }) {
  return <p className="text-micro text-titanio-escuro">{children}</p>;
}
