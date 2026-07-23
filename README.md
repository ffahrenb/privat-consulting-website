# fahrenba.ch — monorepo

Bun-workspace monorepo for the two fahrenba.ch sites. Both are Astro v6 static sites
sharing the same stack; each deploys to its own domain.

```
apps/
  consulting/     consulting.fahrenba.ch   (deployed from THIS repo's Pages)
  psychologie/    psychologie.fahrenba.ch  (built here, pushed to the psych repo's gh-pages)
.github/workflows/
  deploy-consulting.yml     native GitHub Pages deploy
  deploy-psychologie.yml    cross-repo gh-pages push (gated — see DEPLOYMENT.md)
```

## Quick start

```bash
bun install              # from the repo root — installs both apps
bun run dev:consulting   # http://localhost:4321
bun run dev:psychologie
bun run build            # build both apps
```

The `esbuild → esbuild-wasm` override lives in the **root** `package.json` (bun only honours
it there). Each app declares `sharp` directly for Astro's image optimization.

## Layout notes

- Nothing is shared between the apps yet — each carries its own `src/`, `public/`, and config.
  Extracting the common UI into `packages/ui` is a later step (see `PLAN.md`, phase 2).
- `apps/psychologie` was grafted from `ffahrenb/privat-psychologie-website` with full history
  preserved and path-addressable: `git log -- apps/psychologie/`.

See **`DEPLOYMENT.md`** for domains, DNS, and the gated psychologie deploy activation, and
**`PLAN.md`** for the full consolidation roadmap.
