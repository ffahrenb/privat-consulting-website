# Deployment

## Architecture

Two independent Astro static sites, same stack:

| Site | Domain | Repo |
|---|---|---|
| Psychologie | `psychologie.fahrenba.ch` | `ffahrenb/privat-psychologie-website` |
| Consulting | `consulting.fahrenba.ch` | `ffahrenb/privat-consulting-website` |

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

Both sites auto-deploy on push to `main` via `.github/workflows/deploy.yml`:

```
push to main → GitHub Actions → bun install → bun run build → deploy to Pages
```

To deploy manually: **Actions → Deploy to GitHub Pages → Run workflow**

To deploy both sites simultaneously:
```bash
cd ~/Projects/privat-psychologie-website && git push
cd ~/Projects/privat-consulting-website && git push
```

## Local Development

```bash
bun run dev       # dev server with hot reload
bun run build     # build static site to dist/
bun run preview   # preview production build
```

Note: Windows enterprise security blocks native esbuild. The `overrides` field in `package.json` maps `esbuild` to `esbuild-wasm`.

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
