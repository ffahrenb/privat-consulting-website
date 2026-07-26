import './src/styles/theme.css';
import type { SiteConfig } from '@fahrenbach/ui/types';

export { default as Header } from '@fahrenbach/ui/components/Header.astro';
export { default as Footer } from '@fahrenbach/ui/components/Footer.astro';

const site: SiteConfig = {
  siteUrl: 'https://psychologie.fahrenba.ch',
  name: 'Florian Fahrenbach',
  tagline: { de: 'Psychologe FSP', en: 'Psychologist FSP' },

  slugMap: {
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
  },

  navItems: {
    de: [
      {
        label: 'Angebot',
        href: '/angebot/',
        children: [
          { label: 'Für Einzelpersonen', href: '/angebot/' },
          { label: 'Für Unternehmen (EAP)', href: '/unternehmen/' },
        ],
      },
      { label: 'Ablauf & Konditionen', href: '/ablauf/' },
      { label: 'Kontakt', href: '/kontakt/' },
      { label: 'Über mich', href: '/ueber-mich/' },
    ],
    en: [
      {
        label: 'Services',
        href: '/en/services/',
        children: [
          { label: 'For Individuals', href: '/en/services/' },
          { label: 'For Companies (EAP)', href: '/en/companies/' },
        ],
      },
      { label: 'Process & Fees', href: '/en/process/' },
      { label: 'Contact', href: '/en/contact/' },
      { label: 'About', href: '/en/about/' },
    ],
  },

  highlights: {
    de: [
      {
        title: 'Stress & Recovery',
        text: 'Wenn die Belastung dauerhaft die eigenen Ressourcen übersteigt und Erholung ausbleibt. Ich unterstütze Sie dabei, Stressmechanismen zu verstehen und wirksame Strategien für Erholung und Prävention zu entwickeln.',
        href: '/angebot/#stress--recovery',
      },
      {
        title: 'Berufungscoaching',
        text: 'Sie stehen vor einer Neuorientierung und suchen Klarheit? In einem strukturierten Prozess von ca. 8 Sitzungen arbeiten wir an den Fragen: Was brauche ich? Was will ich wirklich? Was kann ich?',
        href: '/angebot/#berufungscoaching',
      },
      {
        title: 'Psychologie in den Bergen',
        text: 'Sturzangst, mentale Blockaden, Risikoeinschätzung – psychologische Beratung für Bergsportlerinnen und Bergsportler. Als SAC-Tourenleiter, Skilehrer und Kletterlehrer kenne ich die Situationen aus eigener Erfahrung.',
        href: '/angebot/#psychologie-in-den-bergen',
      },
      {
        title: 'Coaching für Führungskräfte',
        text: 'Individuelle Begleitung für Führungskräfte und Fachpersonen in anspruchsvollen beruflichen Situationen – von Rollenklärung über Entscheidungsfindung bis zum Umgang mit Druck.',
        href: '/angebot/#coaching-für-führungskräfte--fachpersonen',
      },
      {
        title: 'Für Unternehmen: Employee Assistance',
        text: 'Ihr Unternehmen möchte seinen Mitarbeitenden psychologische Unterstützung anbieten? Ich biete ein vertrauliches Beratungsangebot für Firmen – insbesondere im Technologie- und IT-Umfeld.',
        href: '/unternehmen/',
      },
    ],
    en: [
      {
        title: 'Stress & Recovery',
        text: 'When demands consistently exceed your resources and recovery fails to happen. I help you understand stress mechanisms and develop effective strategies for recovery and prevention.',
        href: '/en/services/#stress--recovery',
      },
      {
        title: 'Vocation Coaching',
        text: 'Facing a professional reorientation and seeking clarity? In a structured process of approx. 8 sessions, we work on the questions: What do I need? What do I really want? What can I do?',
        href: '/en/services/#vocation-coaching',
      },
      {
        title: 'Mountain Psychology',
        text: 'Fear of falling, mental blocks, risk assessment – psychological counselling for mountain athletes. As an SAC mountain guide, ski instructor and climbing instructor, I know these situations first-hand.',
        href: '/en/services/#mountain-psychology',
      },
      {
        title: 'Coaching for Leaders',
        text: 'Individual support for leaders and professionals in demanding work situations – from role clarification and decision-making to dealing with pressure and complexity.',
        href: '/en/services/#coaching-for-leaders--professionals',
      },
      {
        title: 'For Companies: Employee Assistance',
        text: 'Want to offer your employees professional psychological support? I provide a confidential counselling programme for companies – particularly in technology and IT environments.',
        href: '/en/companies/',
      },
    ],
  },

  address: {
    street: 'Affolternstrasse 10',
    multiline: false,
    postalCity: '8908 Hedingen',
    country: { de: 'Schweiz', en: 'Switzerland' },
  },
  email: 'florian.fahrenbach@gmail.com',
  phone: '+41 78 222 08 86',

  legalLinks: {
    de: [
      { label: 'Wissenschaft & Publikationen', href: '/wissenschaft/' },
      { label: 'Impressum', href: '/impressum/' },
      { label: 'Datenschutzerklärung', href: '/datenschutz/' },
      { label: 'Keine Psychotherapie', href: '/abgrenzung/' },
    ],
    en: [
      { label: 'Science & Publications', href: '/en/science/' },
      { label: 'Legal Notice', href: '/en/legal/' },
      { label: 'Privacy Policy', href: '/en/privacy/' },
      { label: 'Not Psychotherapy', href: '/en/disclaimer/' },
    ],
  },

  crossLink: {
    url: {
      de: 'https://consulting.fahrenba.ch',
      en: 'https://consulting.fahrenba.ch/en/',
    },
    label: 'consulting.fahrenba.ch',
    text: {
      de: 'Für datengetriebene Organisationsberatung besuchen Sie',
      en: 'For data-driven organisational consulting visit',
    },
  },

  badge: {
    href: 'https://www.psychologie.ch',
    imageSrc: '/images/fsp-logo-white.png',
    imageAlt: {
      de: 'FSP – Föderation der Schweizer Psychologinnen und Psychologen',
      en: 'FSP – Föderation der Schweizer Psychologinnen und Psychologen',
    },
    text: {
      de: 'Mitglied der Föderation der Schweizer Psycholog:innen (FSP)',
      en: 'Member of the Federation of Swiss Psychologists (FSP)',
    },
  },

  themeColor: '#1a3a4a',

  formspreeId: 'xeeppylr',
  contactForm: {
    kind: 'topics',
    label: { de: 'Ihr Anliegen', en: 'Your concern' },
    options: {
      de: [
        'Stress & Recovery',
        'Berufungscoaching',
        'Psychologie in den Bergen',
        'Coaching für Führungskräfte',
        'Employee Assistance / Firmenanfrage',
        'Anderes',
      ],
      en: [
        'Stress & Recovery',
        'Vocation Coaching',
        'Mountain Psychology',
        'Coaching for Leaders',
        'Employee Assistance / Company Enquiry',
        'Other',
      ],
    },
  },
  referralOptions: {
    de: [
      { value: 'Suchmaschine', label: 'Suchmaschine (Google, etc.)' },
      { value: 'Empfehlung', label: 'Empfehlung' },
      { value: 'FSP Psyfinder', label: 'FSP Psyfinder' },
      { value: 'Soziale Medien', label: 'Soziale Medien' },
      { value: 'Anderes', label: 'Anderes' },
    ],
    en: [
      { value: 'Search engine', label: 'Search engine (Google, etc.)' },
      { value: 'Recommendation', label: 'Recommendation' },
      { value: 'FSP Psyfinder', label: 'FSP Psyfinder' },
      { value: 'Social media', label: 'Social media' },
      { value: 'Other', label: 'Other' },
    ],
  },
};

export default site;
