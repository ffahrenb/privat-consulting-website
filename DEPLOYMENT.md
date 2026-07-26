# Deployment

## Architecture

One **monorepo** (`ffahrenb/privat-consulting-website`, bun workspace) that builds
two independent Astro static sites, each on its own domain:

| App path | Domain | Pages served from |
|---|---|---|
| `apps/consulting` | `consulting.fahrenba.ch` | THIS repo's Pages (native `deploy-pages`) |
| `apps/psychologie` | `psychologie.fahrenba.ch` | `ffahrenb/privat-psychologie-website` `gh-pages` branch (cross-repo push) |

A GitHub repo serves exactly one Pages site, which is why psychologie is *built here but
pushed elsewhere*. The old `privat-psychologie-website` repo is kept (not archived) purely
to host the `gh-pages` branch that serves the domain.

Redirect: `psychology.fahrenba.ch` → `psychologie.fahrenba.ch/en/` (301, via Cloudflare)

## Stack

- **Framework:** Astro v6 (static output, zero client JS)
- **Package manager:** Bun
- **Hosting:** GitHub Pages (free, repos must be public)
- **DNS:** Cloudflare (nameservers: `nitin.ns.cloudflare.com`)
- **Domain registrar:** hosttech (fahrenba.ch) — DNS is managed in Cloudflare, not hosttech

## DNS (Cloudflare)

Domain `fahrenba.ch` uses Cloudflare nameservers. All DNS records are managed at [dash.cloudflare.com](https://dash.cloudflare.com).

| Name | Type | Target | Proxy |
|---|---|---|---|
| `psychologie` | CNAME | `ffahrenb.github.io` | DNS only (gray cloud) |
| `consulting` | CNAME | `ffahrenb.github.io` | DNS only (gray cloud) |
| `psychology` | CNAME | `ffahrenb.github.io` | Proxied (orange cloud) |

The `psychology` subdomain uses Cloudflare proxy to enable a redirect rule:
- **Rule:** Custom filter, hostname equals `psychology.fahrenba.ch`
- **Action:** Static redirect 301 → `https://psychologie.fahrenba.ch/en/`

**Important:** The `psychologie` and `consulting` CNAMEs must NOT be proxied (gray cloud), otherwise GitHub Pages cannot issue SSL certificates.

## GitHub Pages

Each repo is configured under **Settings → Pages**:
- **Source:** GitHub Actions
- **Custom domain:** `psychologie.fahrenba.ch` / `consulting.fahrenba.ch`
- **Enforce HTTPS:** enabled

SSL certificates are auto-provisioned by GitHub (Let's Encrypt). The `CNAME` file in `public/` must match the custom domain.

## Deploy

Both sites auto-deploy on push to `main`, via two workflows:

| Workflow | Builds | Deploys to |
|---|---|---|
| `.github/workflows/deploy-consulting.yml` | `apps/consulting` | this repo's Pages (native `actions/deploy-pages`) |
| `.github/workflows/deploy-psychologie.yml` | `apps/psychologie` | `privat-psychologie-website` `gh-pages` (peaceiris cross-repo push) |

```
push to main → GitHub Actions → bun install (workspace root) → bun run build:<app> → deploy
```

To deploy manually: **Actions → (workflow) → Run workflow**.

### ⚠️ Phase-1 activation — GATED manual steps for the psychologie cross-repo deploy

`deploy-psychologie.yml` is committed but **inert** until both of these are done. Until then
psychologie.fahrenba.ch is still served by the OLD repo's own untouched workflow, so the blast
radius is zero:

1. **Create the deploy key.** Generate an SSH keypair. Add the **public** key as a
   *write-enabled* Deploy Key on `ffahrenb/privat-psychologie-website`
   (Settings → Deploy keys → "Allow write access"). Add the **private** key as the secret
   `PSYCH_DEPLOY_KEY` on `ffahrenb/privat-consulting-website` (Settings → Secrets → Actions).
2. **Merge `monorepo` → `main`** and let `deploy-psychologie.yml` run once. It creates the
   `gh-pages` branch on the psych repo. Only *then* flip that repo's
   **Settings → Pages → Source** to branch `gh-pages` (or `gh api -X PUT` the Pages source).
   **Never send `cname`** in that PUT — the `CNAME` file in `dist` already carries the domain;
   sending `cname` risks the existing DNS/cert.

Ordering matters: create the branch first (step 2's workflow run), *then* flip the source.
Rollback: everything is on the `monorepo` branch until the merge; both `main`s were tagged
`pre-monorepo`. The Pages-source flip is the only irreversible-feeling step and reverses in one
click.

## Local Development

Bun workspace — run from the repo root:

```bash
bun install              # install both apps' deps (honours the root esbuild override)
bun run dev:consulting   # dev server for apps/consulting
bun run dev:psychologie  # dev server for apps/psychologie
bun run build            # build BOTH apps
bun run build:consulting # build one app -> apps/consulting/dist
```

Note: Windows enterprise security blocks native esbuild. The `overrides` field in the **root**
`package.json` maps `esbuild` → `esbuild-wasm` (bun only honours `overrides` at the workspace
root). Each app also declares `sharp` directly, because in the workspace layout Astro's image
optimizer can't resolve it as a transitive optional dep.

## Troubleshooting

### Site returns 404 after deploy
Re-run the deploy workflow after setting the custom domain in GitHub Pages settings. The first deploy before the domain was configured won't serve on the custom domain.

### SSL certificate error
- Ensure CNAME records are NOT proxied in Cloudflare (gray cloud, "DNS only")
- Check GitHub Pages settings: "Enforce HTTPS" must be enabled
- Certificate provisioning can take up to 30 minutes

### Site not reachable locally but works externally
Check if Tailscale/AdGuard DNS is intercepting `fahrenba.ch` subdomains. Test with:
```bash
curl -sk --resolve psychologie.fahrenba.ch:443:185.199.108.153 https://psychologie.fahrenba.ch
```
