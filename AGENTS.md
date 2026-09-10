# Gizzmo Electronics site

SvelteKit 2 + Svelte 5, Bun for all JS/TS, Netlify adapter. Do not use npm, yarn, or pnpm.

## Commands

- `bun install`
- `bun run dev`
- `bun run check`
- `bun test`
- `bun run format`
- `bun run build`
- `bun run test` — check + unit tests + build

## Constraints

- Do not commit secrets or real Stripe keys.
- Do not make risky deploy-config changes (`netlify.toml`, adapter, redirects) unless asked.
- Do not invent product specs or replace B1 instruction placeholders without source copy.
- Keep existing comments verbatim.

## Layout

Home is the B1 landing at `/`. `/b1` redirects there. Checkout needs `STRIPE_SECRET_KEY` plus a public base URL (`PUBLIC_BASE_URL` locally; Netlify `URL` in production).
