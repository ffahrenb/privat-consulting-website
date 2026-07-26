export type Lang = 'de' | 'en';

/** German slug → English slug (and vice versa via inversion). */
export type SlugMap = Record<string, string>;

/**
 * Translate a slug segment by segment, leaving unmapped segments untouched.
 * Nested routes such as `methoden/veritas` need their directory segment
 * translated (`methods/veritas`) while the leaf has no localized form.
 */
function translateSlug(slug: string, dict: SlugMap): string {
  return slug
    .split('/')
    .map((segment) => dict[segment] ?? segment)
    .join('/');
}

/**
 * Given the current path and a site's German→English slug map, resolve the
 * URL of the same page in the other language.
 */
export function getAlternateUrl(
  currentPath: string,
  slugMap: SlugMap,
): { lang: Lang; href: string } {
  const enToDe: SlugMap = Object.fromEntries(
    Object.entries(slugMap).map(([de, en]) => [en, de]),
  );

  const isEn = currentPath.startsWith('/en');
  if (isEn) {
    const enSlug = currentPath.replace(/^\/en\/?/, '').replace(/\/$/, '');
    if (!enSlug || enSlug === 'home') return { lang: 'de', href: '/' };
    return { lang: 'de', href: `/${translateSlug(enSlug, enToDe)}/` };
  } else {
    const deSlug = currentPath.replace(/^\//, '').replace(/\/$/, '');
    if (!deSlug || deSlug === 'startseite') return { lang: 'en', href: '/en/' };
    return { lang: 'en', href: `/en/${translateSlug(deSlug, slugMap)}/` };
  }
}
