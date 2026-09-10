# gizzmoelectronics.com

Public site for **Gizzmo Electronics**. SvelteKit 2, Svelte 5, Tailwind, Netlify.

## Setup

Use [Bun](https://bun.sh) 1.2 or later. Deploys pin Bun `1.2.18` in `netlify.toml`.

```bash
bun install
cp .env.example .env
bun run dev
```

Dev server: http://localhost:5173

Do not use npm, yarn, or pnpm. Do not commit real Stripe keys.

## Scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Vite dev server |
| `bun run check` | `svelte-check` / types |
| `bun test` | unit tests |
| `bun run format` | Prettier check (allowlisted files) |
| `bun run build` | production build |
| `bun run preview` | preview the production build |
| `bun run test` | check + unit tests + build |

## Environment

Checkout stays hidden until `STRIPE_SECRET_KEY` and a public site origin are set. Locally set `PUBLIC_BASE_URL` (for example `http://localhost:5173`). On Netlify, `URL` is set automatically.

`STRIPE_WEBHOOK_SECRET` is only required for `/api/webhook/stripe`.

## Routes

- `/` — B1 preorder landing (`/b1` redirects here)
- `/b1/instructions` — interactive B1 interface guide
- `/ve/instructions` — interactive VE climate interface
- `/downloads` — product manuals
- `/support` — contact
- `/store` — V4+ catalog
- `/checkout/success`, `/checkout/cancel`

B1 on-screen instruction copy in `src/lib/data/b1InstructionCopy.json` is still placeholder text.

## License

MPL-2.0
