// Linha do tempo do fio B (Lei 14.300/2022, art. 27). Lê src/data/regras.ts.
// Celular: vertical. Desktop: horizontal, 7 colunas. Âmbar só no marcador do ano atual.

import { fioB } from "@/data/regras";

export function LinhaDoTempo() {
  return (
    <ol className="tempo" data-revela="grupo">
      {fioB.map((f) => (
        <li
          key={f.ano}
          className="tempo__item"
          data-hoje={f.hoje ? "" : undefined}
          data-aberto={f.percentual === null ? "" : undefined}
          aria-current={f.hoje ? "date" : undefined}
        >
          <span className="num text-num-sm text-nevoa">{f.ano}</span>
          {f.percentual === null ? (
            <span className="text-small text-nevoa">regra em aberto</span>
          ) : (
            <span className={`num ${f.hoje ? "text-num-md text-alabastro" : "text-num-sm text-alabastro"}`}>
              {f.percentual}%{f.hoje ? <span className="font-sans text-small text-nevoa"> · hoje</span> : null}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
