import { getAlternateUrl as sharedGetAlternateUrl, type Lang, type SlugMap } from '@fahrenbach/ui/i18n';

export type { Lang };

/** German slug → English slug */
const slugMap: SlugMap = {
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

export function getAlternateUrl(currentPath: string): { lang: Lang; href: string } {
  return sharedGetAlternateUrl(currentPath, slugMap);
}
