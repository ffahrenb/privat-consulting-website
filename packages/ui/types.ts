import type { SlugMap } from './i18n';

export type Lang = 'de' | 'en';

export interface Localized<T> {
  de: T;
  en: T;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface HighlightCard {
  title: string;
  text: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterBadge {
  href: string;
  imageSrc: string;
  imageAlt: Localized<string>;
  text: Localized<string>;
}

export type ContactFormShape =
  | { kind: 'company' }
  | { kind: 'topics'; options: Localized<string[]> };

/**
 * The full per-site data contract that shared packages/ui components read
 * via the `@site` vite alias. Each app's site.config.ts implements this.
 */
export interface SiteConfig {
  /** e.g. 'https://consulting.fahrenba.ch' (no trailing slash) */
  siteUrl: string;

  /** Person/brand name, identical across sites. */
  name: string;

  /**
   * Short role/brand line — used as the header logo subtitle, the footer
   * role line, and the page-title suffix. Identical across all three uses
   * on both current sites.
   */
  tagline: Localized<string>;

  /** German→English slug map, passed to getAlternateUrl(). */
  slugMap: SlugMap;

  navItems: Localized<NavItem[]>;

  highlights: Localized<HighlightCard[]>;

  address: {
    street: string;
    /** Whether street and city render on separate lines (<br/>) or inline. */
    multiline: boolean;
    postalCity: string;
    country: Localized<string>;
  };

  email: string;
  /** Optional phone number (psych only). */
  phone?: string;

  legalLinks: Localized<FooterLink[]>;

  /** Cross-promotion link to the sister site, shown in the footer. */
  crossLink: {
    url: Localized<string>;
    /** Visible link text (the bare domain), identical for both languages. */
    label: string;
    text: Localized<string>;
  };

  /** Optional membership badge block (psych's FSP logo + text). */
  badge?: FooterBadge;

  formspreeId: string;
  contactForm: ContactFormShape;
}
