# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional website for **Florian Fahrenbach, Consulting** — organizational consulting at the intersection of data, psychology, and change management. Based in Hedingen, Switzerland.

Live at: **consulting.fahrenba.ch** (GitHub Pages, domain via hosttech)

Sister site: **psychologie.fahrenba.ch** (separate repo: `privat-psychologie-website`)

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
  content/pages/*.md         # 7 page content files with frontmatter
  layouts/BaseLayout.astro   # html shell, head, header + footer
  components/
    Header.astro             # sticky nav, mobile hamburger (CSS-only)
    Footer.astro             # legal links, address, copyright
    SchwerpunkteGrid.astro   # 4 focus-area cards (used on index)
    ContactForm.astro        # Formspree form with honeypot
  pages/
    index.astro              # homepage with hero, content, card grid, CTA
    [slug].astro             # catch-all for all other content pages
  styles/global.css          # fonts, reset, typography, prose, buttons, layout
public/
  fonts/                     # self-hosted DM Serif Display + Source Sans 3 (WOFF2)
  CNAME                      # consulting.fahrenba.ch
  favicon.svg, robots.txt
```

Content pages use the `navGroup` frontmatter field: `main` = top nav, `footer` = footer links, `hidden` = not in nav (startseite).

## Content

- All content is in **German** (Hochdeutsch, Swiss context)
- Privacy policy must comply with Swiss DSG (rev. 2023) and reference DSGVO for EU visitors
- No tracking/cookies (keeps privacy obligations minimal)
- Datenschutz page mentions Formspree as data processor

## Design

- Palette: dark petrol primary (#1a2e3d), teal accent (#2e7d6a), cool gray bg (#f5f6f8)
- Fonts: DM Serif Display (headings), Source Sans 3 (body) — self-hosted, no CDN
- Max prose width 680px, mobile-first responsive
