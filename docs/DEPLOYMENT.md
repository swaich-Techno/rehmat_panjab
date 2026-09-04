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

## Current live URL (temporary)

This cloud agent is **logged out** of the owner's Vercel account (`vercel whoami` → Logged out; MCP `list_teams` returned no teams). It cannot attach this deploy to `https://rehmat-panjab.vercel.app` from here.

A new anonymous production deployment was created with `npx vercel deploy --temporary --yes --force` after clearing the previous `.vercel/anonymous.json` (gitignored; never commit it):

| | |
| --- | --- |
| **Live URL** | https://temporary-racing-drizzle-oa072ol.vercel.app |
| **Claim URL** | https://vercel.com/claim-deployment?code=2130a5b3-8c87-489e-ad75-6e48cf1e7413 |
| **Expires** | 2026-09-04 18:06:07 UTC (~59 minutes from deploy) |
| **Commit** | `fa624b5` on `cursor/rehmat-panjab-v3-5654` |

Probes at deploy time: `GET /`, `GET /collection`, `GET /product/white-oud` returned HTTP 200. Campaign still at `/images/products/white-oud.webp` returned `image/webp`.

Do **not** treat `temporary-*.vercel.app` as permanent production. Claim it immediately (see below) or import the GitHub repo.

`https://rehmat-panjab.vercel.app` exists as a project hostname but currently returns **404** (`x-vercel-error: NOT_FOUND`) because production is tracking empty `main`. Set the Production Branch to `cursor/rehmat-panjab-v3-5654`, or merge [PR #3](https://github.com/swaich-Techno/rehmat_panjab/pull/3) into `main` and keep Production Branch = `main`.

## Make this permanent

Preferred path is GitHub import. Claiming a temporary deploy is a fallback that still needs Git connected afterward.

### Permanent path (preferred)

1. Log in to [vercel.com](https://vercel.com) with the GitHub account that owns [`swaich-Techno/rehmat_panjab`](https://github.com/swaich-Techno/rehmat_panjab).
2. Add New Project → Import that GitHub repo.
3. Framework: Next.js. Root Directory: repository root (leave blank / `.`).
4. Production Branch: `cursor/rehmat-panjab-v3-5654` **or** merge [PR #3](https://github.com/swaich-Techno/rehmat_panjab/pull/3) into `main` and keep Production Branch = `main`.
   - In an existing project: **Settings → Environments → Production → Branch Tracking**. Change the branch name and Save.
   - Vercel defaults Production Branch to `main`. That is why `rehmat-panjab.vercel.app` 404s while this feature branch has the shop.
5. Environment variables (from `.env.example`; set for Production, and Preview if you want previews to work):
   - `NEXT_PUBLIC_SITE_URL=https://<project>.vercel.app` (use the real hostname after the first deploy, e.g. `https://rehmat-panjab.vercel.app` if that is the project name)
   - `REWARD_SIGNING_SECRET` (required in production; the app fails closed if unset)
   - `ADMIN_PREVIEW_KEY` (8+ characters) before using `/admin`
   - Never put `SUPABASE_SERVICE_ROLE_KEY` on any `NEXT_PUBLIC_*` variable
   - Optional: `WHATSAPP_ORDER_NUMBER` (E.164 digits, no `+`)
   - Leave Razorpay empty until checkout is intentionally launched
6. Deploy. The stable hostname is `https://<project-name>.vercel.app`. The desired name `rehmat-panjab.vercel.app` is already taken by the existing project; it will serve this site only after production tracks this branch or `main` contains this code.

After import, every push to the Production Branch creates a production deployment; other branches get preview URLs.

### Claim path (if using this anonymous deploy)

1. Open the Claim URL above **while it is still valid** (~1 hour from deploy; CLI reports 59 minutes). You must be signed in to Vercel.
2. Claim attaches the deploy to **your** Vercel team (pick Hobby or a team you own).
3. Then, in that new project: assign a domain / rename the project / **connect Git** (`swaich-Techno/rehmat_panjab`) so future pushes auto-deploy.
4. Claiming alone does **not** keep the `temporary-*.vercel.app` hostname forever. After claim you get a real project (`https://<project-name>.vercel.app`). The temporary host expires; the claimed project does not.

Official reference: [Claim Deployments](https://vercel.com/docs/deployments/claim-deployments) and [Git deployments / production branch](https://vercel.com/docs/deployments/git).

## Vercel (dashboard / CLI)

1. Import `github.com/swaich-Techno/rehmat_panjab`.
2. Project name: `rehmat-panjab` if creating new (or reuse the existing `rehmat-panjab` project).
3. Framework: Next.js. Root directory: repository root.
4. Environment variables from `.env.example` as listed in **Make this permanent**.
5. Deploy the production branch (see above). Preview deploys follow other branches.

### CLI (when authenticated as the project owner)

```bash
npx vercel link --yes --project rehmat-panjab
npx vercel env pull .env.local --yes
npx vercel deploy
```

If the CLI or MCP is not authenticated, use `npx vercel deploy --temporary --yes` for a claimable URL, or import via the Vercel dashboard. Do not invent a production hostname.

**Working branch for V3.3:** `cursor/rehmat-panjab-v3-5654`. Production hostname (`rehmat-panjab.vercel.app`, or whatever the claimed project assigns) requires the Vercel project Production Branch to be this working branch, or a merge to `main`. `NEXT_PUBLIC_SITE_URL` should match the production URL once the project is claimed.

## GitHub

Production deploys when the GitHub repository is connected to the Vercel project. This repo already has `origin`. Current feature work is on `cursor/rehmat-panjab-v3-5654` ([PR #3](https://github.com/swaich-Techno/rehmat_panjab/pull/3)).

## After images exist

The first five oils use supplied campaign stills in `public/images/products/` (`placeholder: false`). Keep remaining SVG compositions in `public/images/placeholders/` until a commissioned file is assigned.
