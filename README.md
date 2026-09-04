# REHMAT PANJAB

Concentrated perfume oils. Made to be worn, not announced.

This repository is the small-business commerce foundation for the house: catalogue, scent finder, next-drop vote, local cart, honest checkout (request / WhatsApp — not a fake payment), private-house auth UI, and a locked admin preview.

## Features

- Editorial homepage with eight scenes (arrival, oil, notes, first bottle, worn line, collection, finder, origin)
- Collection and product pages with composition + scent character
- Cart drawer and cart page, persisted in `localStorage`, totals recomputed on the server
- Checkout coming soon — manual / WhatsApp request with a request number, never a fake charge
- Fragrance finder (six questions) with primary + secondary scent match
- Next Rehmat vote + 5% thank-you reward (server-locked percent, one per email, hashed / signed)
- Auth vault UI with honest “archive not connected” when Supabase is missing
- Account surfaces for orders, profile, saved oils, quiz, rewards, votes (local / empty states)
- Admin preview: overview, products, inventory, orders, quiz, next drop, rewards — locked unless `ADMIN_PREVIEW_KEY` is set
- SEO: metadata, OG, robots, sitemap, JSON-LD (no fake ratings)
- First-party analytics events (no PII)

## Stack

Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4, Motion, Zod, Vitest.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Future public client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only, later. Never `NEXT_PUBLIC_` |
| `ADMIN_PREVIEW_KEY` | Gates `/admin`. If unset, admin stays locked |
| `REWARD_SIGNING_SECRET` | HMAC for reward tokens. Local fallback is documented and not multi-instance safe |
| `WHATSAPP_ORDER_NUMBER` | Optional E.164 digits for request links |
| `RAZORPAY_*` | Reserved. Checkout does not charge |

## Supabase later

The shop is written against a stub (`lib/supabase-stub`). When a project is linked: put the URL and anon key in env, keep the service role on the server, apply `docs/DATABASE.md` with RLS, then replace the stub with a real client. Do not fake login success before that.

## Deployment

`docs/DEPLOYMENT.md`. Project name on Vercel: `rehmat_panjab`.

## Images

Placeholder SVG/CSS compositions live in `public/images/placeholders/` and are labelled as placeholders. Commissioned photography: `docs/IMAGE_PROMPTS.md`. Update `data/fragrance-config.ts` when a real file replaces a placeholder.

## Prices and names

Prices are INR **paise integers**. `null` means **LAUNCHING SOON**. Do not invent prices.

`01 Musk Rizali` is named. `02–05` use working titles (`Product Two` …) until the house names them. Edit `data/fragrance-config.ts`.

## Future Razorpay

Types and comments live in `lib/commerce/orders.ts`. Do not collect cards or mark orders paid until keys, webhooks, and legal checkout exist.

## Catalogue edits

All product, size, note-pool, and price-band configuration is in `data/`. Quiz copy is in `data/quiz-config.ts`. Next-drop questions read from the house config so price bands stay honest.
