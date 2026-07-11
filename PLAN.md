# Consolidate the two fahrenba.ch sites, reconcile their UI, and wire in the CV

## Context

`privat-consulting-website` (consulting.fahrenba.ch) and `privat-psychologie-website` (psychologie.fahrenba.ch) are forks of each other. Verified: every component (`BaseLayout`, `Header`, `Footer`, `ContactForm`, `Accordion`, `SchwerpunkteGrid`) exists in both; `global.css` differs in exactly **5 colour values**; `tsconfig.json`, `content.config.ts`, `deploy.yml`, `.gitignore` and the four `.woff2` fonts are **byte-identical**. There is no structural divergence anywhere in the component layer — every delta is expressible as config data.

Consequences of the fork, all confirmed:
- **Consulting carries psychologie's colours in 5 places** it shouldn't, and its `robots.txt` advertises the *psychologie* sitemap.
- **Any UI change must be made twice**, in two repos, by hand.
- The `/methoden/` long-read pages have a **broken DE⇄EN language switch** (both directions 404).
- The websites' academic claims have **drifted from the CV** (`/home/flo/projects/fahrenbach_cv`) — publication years, volumes, pages and author order now disagree with `publications.bib`, because the citations are hand-copied into 4 markdown files across 2 repos with nothing linking them.

Intended outcome: one repo, two independently-deployed domains, one shared UI package, one source of truth for publications — plus a design brief for a proper visual overhaul.

**Decisions taken (user-confirmed):** cross-repo `gh-pages` push for the second domain; fix outright bugs now and defer structural reconciliation into the monorepo extraction; report CV/site content conflicts rather than silently rewriting copy; wire `publications.bib` → JSON as phase 2, off the critical path.

---

## Phase 0 — Bug fixes + hygiene (in `privat-consulting-website`, small commits)

The entire current working-tree diff (1079+/1079-) is **CRLF line-ending noise**, not real changes.

1. **Normalize line endings.** Add root `.gitattributes` (`* text=auto eol=lf`), `git add --renormalize .`, commit alone. Do the same in the psych repo — its `BaseLayout.astro` is CRLF.
2. **`public/robots.txt`** — `Sitemap:` points at `https://psychologie.fahrenba.ch/...`. Fix the host.
3. **`public/favicon.svg`** — hardcoded `fill="#1a3a4a"` / `#f7f4f0` (psych's palette). Should be `#1a2e3d` / `#f5f6f8`.
4. **Three stray psych-coloured shadows** in consulting: `ContactForm.astro:139` (focus ring is terracotta `rgba(200,85,61,…)` while the border turns teal), `SchwerpunkteGrid.astro:78` (`rgba(26,58,74,…)`), `Footer.astro:149` + `pages/index.astro:104` + `pages/en/index.astro:104` (`rgba(247,244,240,…)`).
5. **Broken language switch on method pages.** `src/i18n.ts` has no `methoden ↔ methods` mapping, so `/methoden/veritas/` → `/en/methoden/veritas/` (404) and back. Four dead links. Add the segment mapping to `getAlternateUrl`.
6. **Psych repo:** `Footer.astro:73-77` cross-links EN visitors to the *German* consulting root (missing `/en/`); `i18n.ts:38-41` exports an unused `localePath()`.

**Verify:** `bun run build` in each repo; `dist/` byte-identical to a pre-change baseline except the intended lines; click the DE/EN switch on `/methoden/veritas/` and `/en/methods/veritas/`.

> `bun` is not on this machine's PATH (CI installs it via `oven-sh/setup-bun@v2`). Needs `mise use -g bun@latest` first.

---

## Phase 1 — One repo, two domains

`privat-consulting-website` **becomes the monorepo**. Bun workspaces:

```
package.json          { private, workspaces: ["apps/*","packages/*"], overrides }
apps/consulting/      site.config.ts · src/styles/theme.css · content/ · pages/ · public/CNAME
apps/psychologie/     same shape (+ public/images/fsp-logo*.png)
packages/ui/          @fahrenbach/ui — layouts, components, global.css, i18n, content schema, types
```

Two load-bearing details:
- **`@site` vite alias** resolves to each app's own `site.config.ts`, so shared components `import site from '@site'` and get their own site's data. Plus `vite.ssr.noExternal: ['@fahrenbach/ui']` so Astro processes the raw `.astro` files instead of externalizing them.
- **`overrides` must move to the ROOT `package.json`.** Bun only honours it there. The `esbuild → esbuild-wasm` override currently sits in each site's `package.json`; left in place after the move it is **silently ignored** and you get a native-esbuild install — the exact thing the override exists to prevent.

**Deployment (the crux).** A GitHub repo hosts exactly one Pages site — `/repos/{owner}/{repo}/pages` is a singleton with a scalar `cname`. So:
- `apps/consulting` → **native `actions/deploy-pages`, unchanged.** Only the artifact path moves (`dist` → `apps/consulting/dist`). Zero DNS risk on this domain.
- `apps/psychologie` → built in the monorepo, pushed to the **old psych repo's `gh-pages` branch** via `peaceiris/actions-gh-pages@v4` + `external_repository` + an SSH deploy key. Then flip that repo's Pages source `workflow` → branch `gh-pages`. **Never send `cname` in the PUT** — DNS and the existing cert survive untouched.
- Old psych repo is **kept, not archived** (archived repos reject pushes). `main` becomes a stub README; tag `pre-monorepo` at `98671af` first.

**Git history:** graft psych via `git filter-repo --to-subdirectory-filter apps/psychologie` on a throwaway clone, then `git merge --allow-unrelated-histories`. All 12 commits survive; `git log apps/psychologie/` works with no `--follow`. (Fallback without extra tooling: `git merge -s ours` + `git read-tree --prefix=`.)

**Ordering is critical:** merge to `main` and let the workflow **create `gh-pages` first**, *then* flip the Pages source. Until that single `gh api -X PUT`, both live sites are still served by their existing untouched workflows — blast radius before that moment is exactly zero.

---

## Phase 2 — Extract `packages/ui` (this is where the UI actually gets reconciled)

One component per commit, risk ramping up. `Accordion` (byte-identical) goes first as the canary that proves `.astro` resolves from a workspace package.

| Step | Extract | Reconciliation it performs |
|---|---|---|
| 2a | `global.css` + per-app `theme.css` | Palette becomes 5 CSS custom props per app. **New `--color-accent-hover` token** kills the hardcoded `.btn-primary:hover` (`#256b5a`/`#b44a34`). |
| 2b | `Accordion.astro` | none — canary |
| 2c | `i18n.ts`, `content.ts` | one slug-map contract; dead `localePath` resolved |
| 2d | `types.ts` + both `site.config.ts` | the `SiteConfig` contract |
| 2e | `BaseLayout.astro` | localized title suffix (psych's, the superset) |
| 2f | `CardGrid.astro` (ex-`SchwerpunkteGrid`) | markup already identical; only the data arrays differ → they move to `site.highlights` |
| 2g | `Footer.astro` | optional `phone` + optional `badge` (FSP block) branches |
| 2h | `Header.astro` | **take psych's version** — its `NavItem { children? }` dropdown is a strict superset; consulting's flat nav is just `children: undefined` |
| 2i | `ContactForm.astro` | `formspreeId` + `contactForm: {kind:'company'} \| {kind:'topics'}` |

Also kill the **dead `navOrder`/`navGroup` schema** — required on every page by `content.config.ts` and read by nothing; nav and footer links are hardcoded in the components.

**Verify:** capture golden `dist/` baselines *before* Phase 1, then diff after every step. Astro's scoped-style hashes change once components move, so normalize before diffing:
```sh
norm() { sed -E 's/astro-[a-z0-9]{6,}/astro-H/g; s/\.[A-Za-z0-9_-]{8}\.(css|js)/.H.\1/g' "$1"; }
```
Any *content* diff after a pure refactor is a regression — stop and investigate.

**Step 2i deserves paranoia.** The contact form is the only revenue-bearing path on either site. A swapped Formspree ID (`meeppyrr` consulting / `xeeppylr` psych) would route consulting leads into the psychology inbox and is **near-invisible in a dist diff**. Manually submit a test message on all four site×language contact pages before merging.

---

## Phase 3 — CV integration

**First, a trap:** `fahrenbach_cv/cv/*.tex` + `cv.tex` + `coverletter.tex` are **100% unmodified upstream Awesome-CV template** — they are the CV of "Claud D. Park", a Seoul security researcher (POSTECH, DEFCON CTF). A naive `**/*.tex` glob would ingest DEFCON awards into the website. **Only `resume/*.tex` and `publications.bib` are real.**

`publications.bib` is already machine-readable (23 entries + 2 theses, typed, with DOIs) and covers publications *and* talks (the `@unpublished` entries carry venue+date, with `(Poster)`/`(Invited Talk)` markers in `note`).

- `packages/cv-data/` — vendor the `.bib`, add a `citation-js` build step emitting typed `publications.json`.
- `packages/ui/components/Publications.astro` — `<Publications lang="de" filter="selected" />`.
- Consumers: psych's `wissenschaft.md` / `en/science.md` (**the page already exists**, footer-linked) gets the full list; consulting's `ueber-mich.md` gets selected works.
- Source of truth stays in `fahrenbach_cv`; a `repository_dispatch` opens a PR into the monorepo when the `.bib` changes. Less invasive to a working LaTeX build than a submodule.

This alone fixes the citation drift and unlocks the **12 unused publications**.

---

## Deliverable documents (no code)

Both live in `docs/`, which is **gitignored and stays local** — this repo is public, and the CV
audit in particular is internal working material that should not be published under the client's
own name.

**`docs/CV_CROSSCHECK.md`** — audit of both sites' claims against the CV. Reported, not acted on:
it separates objective data errors (citation metadata, author order, a mis-attributed degree — all
safe to fix mechanically) from judgment calls about the client's own credentials, which are his to
make. Also inventories the substantial credentials the sites currently *don't* use.

**`docs/DESIGN_BRIEF.md`** — the instruction doc for a design pass. Leads with the finding that
only `font-weight: 400` is loaded for either font family while six CSS rules ask for 600/700, so
every button, bold word, nav link, form label and table header on both sites is browser-synthesised
faux bold. Also covers the collapsed type scale (`h4` is the same size as body text), the absent
elevation system, the stranded warm border token, missing focus rings, the empty SEO/meta layer,
and — per your request — **folds the CV in as a design problem**: how to surface publications,
talks and credentials without turning the site into a CV dump.

---

## Risks

| Risk | Mitigation |
|---|---|
| **Formspree ID crossed in 2i** | Highest-consequence, lowest-visibility. Manual submit on all 4 contact pages. |
| **`overrides` silently ignored** after move | Must be in root `package.json`. Assert `bun pm ls \| grep esbuild-wasm` in CI. |
| Pages source flip drops the custom domain | Never send `cname`; re-read the Pages API right after; DNS untouched throughout. |
| Cert re-provisioning after flip | Cert is domain-scoped. Wait it out — do **not** panic-toggle "Enforce HTTPS", that's what actually breaks it. |
| `gh-pages` push rejected | Deploy key needs `--allow-write`. Live site unaffected until the flip. |
| CRLF renormalization buries a real change | Its own commit, before any refactor, `dist`-diffed to prove no behaviour change. |

**Global rollback:** everything lives on a `monorepo` branch until Phase 1's final step. Both `main`s tagged `pre-monorepo`. The Pages-source flip is the only irreversible-feeling moment and it reverses in one command.

---

## Suggested stopping points

Phase 0 is independently shippable. **Phase 1 complete (repos merged, nothing shared yet) is a safe, deployable checkpoint** — worth landing before starting Phase 2. Phase 3 and the two documents are independent of everything else.
