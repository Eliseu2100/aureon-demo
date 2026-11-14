# AUREON Solar (site de demonstração)

Demo interna de energia solar feita por **Eliseu Souza · Criação de Sites Premium**. A AUREON é
fictícia; as imagens são ilustrativas. Todo botão de WhatsApp fala com o Eliseu, com a mensagem
começando por "[Demo AUREON]".

- Next.js 16, React 19, TypeScript, Tailwind 4, GSAP + ScrollTrigger
- Decisões técnicas: `../docs/STACK.md`. Tokens: `../DESIGN.md`.

## Rodar

```bash
npm install
npm run dev          # http://localhost:3200
npm run lint && npm run typecheck && npm run build
npm run imagens      # refaz os WebP a partir de ../imagens-geradas
```

## Indexação

Desligada (`noindex` e `robots.txt` bloqueando). Num cliente real: `NEXT_PUBLIC_INDEXAR=1` e
`NEXT_PUBLIC_SITE_URL` com o domínio.

## Auditoria automática (14/11/2026)

Rodada com `auditar_site.py` (skill `site-sem-cara-de-ia`). Corrigido: `obra-galpao-1600.webp` de 353 KB
para 292 KB (`npm run imagens -- obra-galpao`, teto de 300 KB nas obras) e `apple-icon.png` de 180x180
(`src/app/apple-icon.png`). Dois apontamentos ficam como estão, de propósito:
- **Formulário sem proteção contra spam:** o simulador só monta o link do WhatsApp no navegador e não envia
  nada a servidor, então campo-isca ou Turnstile não protegeria nada. Num cliente com formulário que envia
  (Netlify Forms, Formspree), entra honeypot ou Turnstile.
- **Nenhuma ferramenta de medição:** a AUREON é fictícia, a `/privacidade` afirma que não há script de
  terceiro e a CSP só libera o próprio domínio. Num cliente real: GA4 depois do aceite de cookies, CSP e
  `/privacidade` atualizadas (`metricas.ts` já deixa os eventos prontos no `dataLayer`).
Também esperados: `noindex` e `Disallow: /` (demo) e "não está em HTTPS" ao auditar `localhost`.

## Publicação

Nenhuma. Deploy só com ordem do Eliseu.
