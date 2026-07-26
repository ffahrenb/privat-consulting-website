import './src/styles/theme.css';
import type { SiteConfig } from '@fahrenbach/ui/types';

export { default as Header } from '@fahrenbach/ui/components/Header.astro';
export { default as Footer } from '@fahrenbach/ui/components/Footer.astro';

const site: SiteConfig = {
  siteUrl: 'https://consulting.fahrenba.ch',
  name: 'Florian Fahrenbach',
  tagline: { de: 'Consulting', en: 'Consulting' },

  slugMap: {
    'startseite': 'home',
    'ueber-mich': 'about',
    'leistungen': 'services',
    'ablauf': 'process',
    'kontakt': 'contact',
    'impressum': 'legal',
    'datenschutz': 'privacy',
    'methoden': 'methods',
  },

  navItems: {
    de: [
      { label: 'Startseite', href: '/' },
      { label: 'Über mich', href: '/ueber-mich/' },
      { label: 'Leistungen', href: '/leistungen/' },
      { label: 'Ablauf', href: '/ablauf/' },
      { label: 'Kontakt', href: '/kontakt/' },
    ],
    en: [
      { label: 'Home', href: '/en/' },
      { label: 'About', href: '/en/about/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Process', href: '/en/process/' },
      { label: 'Contact', href: '/en/contact/' },
    ],
  },

  highlights: {
    de: [
      {
        title: 'Führung & Zusammenarbeit',
        text: 'Coaching für Führungskräfte in datennahen Rollen. Teamentwicklung an der Schnittstelle von Business und IT.',
        href: '/leistungen/#führung--zusammenarbeit',
      },
      {
        title: 'Veränderung & Architektur',
        text: 'Change-Begleitung bei Systemeinführungen und digitaler Transformation. Enterprise Architecture als Werkzeug für strategische Entscheidungen.',
        href: '/leistungen/#veränderung--architektur',
      },
      {
        title: 'Datenkultur & Governance',
        text: 'Datenkultur aufbauen, Governance verankern, Brücken zwischen Fachbereich und Datenteam schlagen.',
        href: '/leistungen/#datenkultur--governance',
      },
    ],
    en: [
      {
        title: 'Leadership & Collaboration',
        text: 'Coaching for leaders in data-adjacent roles. Team development at the intersection of business and IT.',
        href: '/en/services/#leadership--collaboration',
      },
      {
        title: 'Change & Architecture',
        text: 'Change support for system implementations and digital transformation. Enterprise architecture as a tool for strategic decisions.',
        href: '/en/services/#change--architecture',
      },
      {
        title: 'Data Culture & Governance',
        text: 'Building data culture, anchoring governance, bridging the gap between business and data teams.',
        href: '/en/services/#data-culture--governance',
      },
    ],
  },

  address: {
    street: 'Affolternstrasse 10',
    multiline: true,
    postalCity: '8908 Hedingen',
    country: { de: 'Schweiz', en: 'Switzerland' },
  },
  email: 'florian.fahrenbach@gmail.com',

  legalLinks: {
    de: [
      { label: 'Impressum', href: '/impressum/' },
      { label: 'Datenschutzerklärung', href: '/datenschutz/' },
    ],
    en: [
      { label: 'Legal Notice', href: '/en/legal/' },
      { label: 'Privacy Policy', href: '/en/privacy/' },
    ],
  },

  crossLink: {
    url: {
      de: 'https://psychologie.fahrenba.ch',
      en: 'https://psychologie.fahrenba.ch/en/',
    },
    label: 'psychologie.fahrenba.ch',
    text: {
      de: 'Für psychologische Beratung und Coaching besuchen Sie',
      en: 'For psychological counselling and coaching visit',
    },
  },

  formspreeId: 'meeppyrr',
  contactForm: { kind: 'company' },
  referralOptions: {
    de: [
      { value: 'Suchmaschine', label: 'Suchmaschine (Google, etc.)' },
      { value: 'Empfehlung', label: 'Empfehlung' },
      { value: 'LinkedIn', label: 'LinkedIn' },
      { value: 'Soziale Medien', label: 'Soziale Medien' },
      { value: 'Anderes', label: 'Anderes' },
    ],
    en: [
      { value: 'Search engine', label: 'Search engine (Google, etc.)' },
      { value: 'Recommendation', label: 'Recommendation' },
      { value: 'LinkedIn', label: 'LinkedIn' },
      { value: 'Social media', label: 'Social media' },
      { value: 'Other', label: 'Other' },
    ],
  },
};

export default site;
