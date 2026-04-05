export type Lang = 'de' | 'en';

/** Slug mapping: German slug → English slug */
const deToEn: Record<string, string> = {
  'startseite': 'home',
  'ueber-mich': 'about',
  'angebot': 'services',
  'unternehmen': 'companies',
  'wissenschaft': 'science',
  'ablauf': 'process',
  'kontakt': 'contact',
  'impressum': 'legal',
  'datenschutz': 'privacy',
  'abgrenzung': 'disclaimer',
};

const enToDe: Record<string, string> = Object.fromEntries(
  Object.entries(deToEn).map(([de, en]) => [en, de])
);

export function getAlternateUrl(currentPath: string): { lang: Lang; href: string } {
  const isEn = currentPath.startsWith('/en');
  if (isEn) {
    // Currently on English → link to German
    const enSlug = currentPath.replace(/^\/en\/?/, '').replace(/\/$/, '');
    if (!enSlug || enSlug === 'home') return { lang: 'de', href: '/' };
    const deSlug = enToDe[enSlug] || enSlug;
    return { lang: 'de', href: `/${deSlug}/` };
  } else {
    // Currently on German → link to English
    const deSlug = currentPath.replace(/^\//, '').replace(/\/$/, '');
    if (!deSlug || deSlug === 'startseite') return { lang: 'en', href: '/en/' };
    const enSlug = deToEn[deSlug] || deSlug;
    return { lang: 'en', href: `/en/${enSlug}/` };
  }
}

export function localePath(slug: string, lang: Lang): string {
  if (lang === 'de') return slug === 'startseite' ? '/' : `/${slug}/`;
  return slug === 'home' ? '/en/' : `/en/${slug}/`;
}
