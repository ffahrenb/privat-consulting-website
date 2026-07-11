export type Lang = 'de' | 'en';

/** Slug mapping: German slug → English slug */
const deToEn: Record<string, string> = {
  'startseite': 'home',
  'ueber-mich': 'about',
  'leistungen': 'services',
  'ablauf': 'process',
  'kontakt': 'contact',
  'impressum': 'legal',
  'datenschutz': 'privacy',
  'methoden': 'methods',
};

const enToDe: Record<string, string> = Object.fromEntries(
  Object.entries(deToEn).map(([de, en]) => [en, de])
);

/**
 * Translate a slug segment by segment, leaving unmapped segments untouched.
 * Nested routes such as `methoden/veritas` need their directory segment
 * translated (`methods/veritas`) while the leaf has no localized form.
 */
function translateSlug(slug: string, dict: Record<string, string>): string {
  return slug
    .split('/')
    .map((segment) => dict[segment] ?? segment)
    .join('/');
}

export function getAlternateUrl(currentPath: string): { lang: Lang; href: string } {
  const isEn = currentPath.startsWith('/en');
  if (isEn) {
    const enSlug = currentPath.replace(/^\/en\/?/, '').replace(/\/$/, '');
    if (!enSlug || enSlug === 'home') return { lang: 'de', href: '/' };
    return { lang: 'de', href: `/${translateSlug(enSlug, enToDe)}/` };
  } else {
    const deSlug = currentPath.replace(/^\//, '').replace(/\/$/, '');
    if (!deSlug || deSlug === 'startseite') return { lang: 'en', href: '/en/' };
    return { lang: 'en', href: `/en/${translateSlug(deSlug, deToEn)}/` };
  }
}
