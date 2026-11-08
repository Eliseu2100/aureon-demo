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

## Publicação

Nenhuma. Deploy só com ordem do Eliseu.
