/**
 * Generate publications.json from publications.bib.
 *
 * The .bib is vendored from ffahrenb/fahrenbach_cv (source of truth).
 * Run `bun run generate` after updating publications.bib and commit both files.
 */
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-bibtex';

export type PublicationCategory =
  | 'journal'
  | 'proceedings'
  | 'chapter'
  | 'talk'
  | 'poster'
  | 'invited-talk'
  | 'phd-thesis'
  | 'master-thesis';

export interface Publication {
  key: string;
  category: PublicationCategory;
  authors: { family: string; given: string }[];
  year: number;
  title: string;
  /** Journal, proceedings/book title, university (theses) or event (talks/posters). */
  venue: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  doi: string | null;
  url: string | null;
  /** For talks/posters: the raw venue+date note from the .bib, markers stripped. */
  eventNote: string | null;
}

const bibPath = new URL('./publications.bib', import.meta.url);
const bibtex = await Bun.file(bibPath).text();

// citation-js maps: @article → article-journal, @inproceedings → paper-conference,
// @incollection → chapter, @unpublished → article (with note kept),
// @phdthesis/@mastersthesis → thesis (genre distinguishes them).
const cite = new Cite(bibtex, { generateGraph: false });
const csl: any[] = cite.data;

// Recover the original BibTeX entry types — CSL flattens distinctions we need.
const bibTypes = new Map<string, string>();
for (const m of bibtex.matchAll(/@(\w+)\s*\{\s*([^,\s]+)\s*,/g)) {
  bibTypes.set(m[2], m[1].toLowerCase());
}

function categorize(entry: any): PublicationCategory {
  const bibType = bibTypes.get(entry['citation-key'] ?? entry.id);
  const note: string = entry.note ?? '';
  switch (bibType) {
    case 'article':
      return 'journal';
    case 'inproceedings':
      return 'proceedings';
    case 'incollection':
      return 'chapter';
    case 'phdthesis':
      return 'phd-thesis';
    case 'mastersthesis':
      return 'master-thesis';
    case 'unpublished':
      if (note.includes('(Poster)')) return 'poster';
      if (note.includes('(Invited Talk)')) return 'invited-talk';
      return 'talk';
    default:
      throw new Error(`Unhandled BibTeX type "${bibType}" for entry ${entry.id}`);
  }
}

// citation-js splits literal fields containing " and " (e.g. a thesis `school`)
// into arrays as if they were name lists — rejoin them.
function normalizeVenue(v: unknown): string | null {
  if (v == null) return null;
  if (Array.isArray(v)) return v.join(' and ');
  return String(v);
}

const publications: Publication[] = csl.map((e) => {
  const key = e['citation-key'] ?? e.id;
  const category = categorize(e);
  const year = e.issued?.['date-parts']?.[0]?.[0];
  if (!key || !year || !e.title) {
    throw new Error(`Entry ${key ?? '?'} is missing key, year or title`);
  }
  const isEvent = category === 'talk' || category === 'poster' || category === 'invited-talk';
  const isThesis = category === 'phd-thesis' || category === 'master-thesis';
  return {
    key,
    category,
    authors: (e.author ?? []).map((a: any) => ({ family: a.family ?? '', given: a.given ?? '' })),
    year,
    title: e.title,
    venue: normalizeVenue(
      isEvent ? null : (e['container-title'] ?? (isThesis ? (e.publisher ?? null) : null)),
    ),
    volume: e.volume != null ? String(e.volume) : null,
    issue: e.issue != null ? String(e.issue) : null,
    pages: e.page ? String(e.page).replace(/--/g, '–').replace(/-/g, '–') : null,
    doi: e.DOI ?? null,
    url: e.URL ?? null,
    eventNote: isEvent
      ? (e.note ?? '').replace(/\s*\((Poster|Invited Talk)\)\s*$/, '').trim() || null
      : null,
  };
});

publications.sort((a, b) => b.year - a.year || a.key.localeCompare(b.key));

const counts: Record<string, number> = {};
for (const p of publications) counts[p.category] = (counts[p.category] ?? 0) + 1;
console.log(`${publications.length} entries:`, counts);

const outPath = new URL('./publications.json', import.meta.url);
await Bun.write(outPath, JSON.stringify(publications, null, 2) + '\n');
console.log('wrote publications.json');
