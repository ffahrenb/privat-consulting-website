/**
 * @fahrenbach/cv-data — typed publications data for the fahrenba.ch sites.
 *
 * Source of truth: publications.bib, vendored from ffahrenb/fahrenbach_cv.
 * Regenerate publications.json with `bun run generate` after updating the .bib.
 */
import publicationsJson from './publications.json';
import type { Publication, PublicationCategory } from './generate.ts';

export type { Publication, PublicationCategory };

export const publications = publicationsJson as Publication[];

/**
 * Curated "selected works" for the consulting site (data / organisation / change
 * relevance). Order here is the display order.
 */
export const SELECTED_KEYS: string[] = [
  'fahrenbach_luomi_messerer_2021_vnfil',
  'fahrenbach_kragulj_2019_triple_loop_learning',
  'kaiser_fahrenbach_martinez_2021_shared_visions',
  'fahrenbach_revoredo_santoro_2019_text_mining',
  'kaiser_et_al_2018_prioritization_of_needs',
  'human_et_al_2017_ontology_human_needs',
];

/**
 * Facts about entries that are true but not encoded in the .bib (kept here so
 * the .bib stays a faithful vendored copy of the CV's).
 */
export const ANNOTATIONS: Record<string, { award?: string }> = {
  human_et_al_2017_ontology_human_needs: { award: 'Best Paper Award' },
};

export function selectedPublications(): Publication[] {
  const byKey = new Map(publications.map((p) => [p.key, p]));
  return SELECTED_KEYS.map((k) => {
    const p = byKey.get(k);
    if (!p) throw new Error(`SELECTED_KEYS references unknown publication key "${k}"`);
    return p;
  });
}
