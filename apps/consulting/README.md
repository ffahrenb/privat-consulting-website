# privat-consulting-website

Professional website for **Florian Fahrenbach, Consulting** — organizational
consulting at the intersection of data, psychology, and change management.
Based in Hedingen, Switzerland.

Live at **[consulting.fahrenba.ch](https://consulting.fahrenba.ch)** (GitHub Pages).
Sister site: **[psychologie.fahrenba.ch](https://psychologie.fahrenba.ch)**.

## Tech stack

- [Astro](https://astro.build) v6 — static site generator, zero client JS
- Vanilla CSS with custom properties (`src/styles/global.css`)
- German-language content (DE) with English (EN) i18n
- [Formspree](https://formspree.io) contact form backend
- Self-hosted fonts (DM Serif Display, Source Sans 3)
- Deployed to GitHub Pages via GitHub Actions on push to `main`

## Development

```bash
bun install
bun run dev       # dev server with hot reload
bun run build     # build static site to dist/
bun run preview   # preview production build locally
```

See `CLAUDE.md` for architecture and content conventions, `DEPLOYMENT.md` for
deployment details, and `PLAN.md` for the two-site consolidation plan.
