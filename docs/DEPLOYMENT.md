# Deployment

## Local

```bash
npm install
cp .env.example .env.local
# fill only what you have; the shop runs without payment or auth backends
npm run dev
```

Quality:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Vercel

1. Import `github.com/swaich-Techno/rehmat_panjab`.
2. Project name: `rehmat_panjab`.
3. Framework: Next.js. Root directory: repository root.
4. Environment variables from `.env.example`.
   - Do **not** set `SUPABASE_SERVICE_ROLE_KEY` as `NEXT_PUBLIC_*`.
   - Set `NEXT_PUBLIC_SITE_URL` to the production URL.
   - Set `ADMIN_PREVIEW_KEY` (8+ characters) before using `/admin`.
   - Set `REWARD_SIGNING_SECRET` in production. The app **fails closed** if it is unset there. A local-only secret is used only in development.
   - `WHATSAPP_ORDER_NUMBER` is optional (E.164 digits, no `+`).
   - Leave Razorpay empty until checkout is intentionally launched.
5. Deploy the `main` branch for production. Preview deploys follow other branches.

### CLI (when authenticated)

```bash
npx vercel link --yes --project rehmat_panjab
npx vercel env pull .env.local --yes
npx vercel deploy
```

If the CLI or MCP is not authenticated, use `npx vercel deploy --temporary --yes` for a claimable URL, or import via the Vercel dashboard. Do not invent a production hostname.

**Production hostname (`rehmat-panjab.vercel.app`):** set the Vercel project Production Branch to this working branch, or merge to `main`. `NEXT_PUBLIC_SITE_URL` should match the production URL once the project is claimed.

## GitHub

Production deploys when the GitHub repository is connected to the Vercel project. This repo already has `origin`.

## After images exist

Replace files in `public/images/placeholders/` with production photography. Keep `placeholder: true` in the catalogue until a real asset is assigned, then set it to `false` and update `alt`.
