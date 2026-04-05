# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional website for **Florian Fahrenbach, Psychologe FSP** — a psychology counseling practice based in Hedingen, Switzerland. The site markets psychological counseling, coaching, and organizational development services (explicitly **not** psychotherapy).

Live at: **psychologie.fahrenba.ch** (GitHub Pages, domain via hosttech)

## Commands

```bash
bun run dev       # dev server with hot reload
bun run build     # build static site to dist/
bun run preview   # preview production build locally
```

Note: Windows enterprise security blocks native esbuild. The `overrides` field in package.json maps `esbuild` to `esbuild-wasm`. This is transparent — no code changes needed.

## Tech Stack

- **Astro v6** — static site generator, zero client JS
- **Vanilla CSS** — no framework, custom properties in `src/styles/global.css`
- **Formspree** — contact form backend (form ID in `src/components/ContactForm.astro`)
- **GitHub Pages** — deployed via Actions on push to `main`
- **bun** — package manager

## Architecture

```
src/
  content.config.ts          # content collection schema (title, description, navOrder, navGroup)
  content/pages/*.md         # 9 page content files with frontmatter
  layouts/BaseLayout.astro   # html shell, head, header + footer
  components/
    Header.astro             # sticky nav, mobile hamburger (CSS-only)
    Footer.astro             # legal links, address, copyright
    SchwerpunkteGrid.astro   # 5 focus-area cards (used on index + schwerpunkte)
    ContactForm.astro        # Formspree form with honeypot
  pages/
    index.astro              # homepage with hero, content, card grid, CTA
    [slug].astro             # catch-all for all other content pages
  styles/global.css          # fonts, reset, typography, prose, buttons, layout
public/
  fonts/                     # self-hosted DM Serif Display + Source Sans 3 (WOFF2)
  CNAME                      # psychologie.fahrenba.ch
  favicon.svg, robots.txt
```

Content pages use the `navGroup` frontmatter field: `main` = top nav, `footer` = footer links, `hidden` = not in nav (startseite).

## Content & Legal Constraints

- All content is in **German** (Hochdeutsch, Swiss context)
- Must include clear **disclaimer: no psychotherapy** (legally required under PsyG)
- Correct professional title: **Psychologe FSP** (protected under Swiss law)
- Privacy policy must comply with Swiss DSG (rev. 2023) and reference DSGVO for EU visitors
- No tracking/cookies (keeps privacy obligations minimal)
- Datenschutz page mentions Formspree as data processor

## Key Documents

- `docs/spec1.md` — original project spec
- `docs/Marktresearch_und_offene_Fragen.md` — pricing, legal, positioning research

## Design

- Palette: petrol primary (#1a3a4a), terracotta accent (#c8553d), warm off-white bg (#f7f4f0)
- Fonts: DM Serif Display (headings), Source Sans 3 (body) — self-hosted, no CDN
- Max prose width 680px, mobile-first responsive
