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

**Working branch for V3:** `cursor/rehmat-panjab-v3-5654`. Production hostname (`rehmat-panjab.vercel.app`, or whatever the claimed project assigns) requires the Vercel project Production Branch to be this working branch, or a merge to `main`. `NEXT_PUBLIC_SITE_URL` should match the production URL once the project is claimed.

Vercel CLI was **logged out** in this V3.1 run (`vercel whoami` → Logged out). MCP `list_teams` returned no teams. A temporary anonymous deployment was created instead (same host as the prior V3 claim):

- Live: https://temporary-spry-marble-ykc20go.vercel.app
- Claim: https://vercel.com/claim-deployment?code=b80507ee-84f1-437d-bd30-5aa58f655071

Anonymous deployments expire (this one was reported as ~44 minutes from the V3.1 redeploy). Claim the URL or connect the GitHub repo (`swaich-Techno/rehmat_panjab`) and set the production branch. Do not treat the temporary host as permanent production.

## GitHub

Production deploys when the GitHub repository is connected to the Vercel project. This repo already has `origin`.

## After images exist

Replace files in `public/images/placeholders/` with production photography. Keep `placeholder: true` in the catalogue until a real asset is assigned, then set it to `false` and update `alt`.
