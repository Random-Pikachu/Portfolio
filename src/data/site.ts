/**
 * Single source of truth for everything the page renders AND everything the
 * crawlers read. The prerender step imports this module to emit JSON-LD and the
 * sitemap, so structured data can never drift from what is on screen.
 */

export const ORIGIN = 'https://random-pikachu.dev';

export const SITE = {
  origin: ORIGIN,
  name: 'Sangam Pratap Singh',
  handle: 'Random-Pikachu',
  alternateNames: ['Random-Pikachu', 'random pikachu', 'random-pikachu', 'Sangam Singh'],
  jobTitle: 'Software Engineer',
  email: 'sangampratapsingh21012006@gmail.com',
  title: 'Sangam Pratap Singh — Software Engineer & Open Source Contributor',
  tagline: 'developer ✦ open source ✦ cultured',
  description:
    'Portfolio of Sangam Pratap Singh (Random-Pikachu) — software engineer building legal tech at Retsguide, KDE Plasma contributor, and builder of CodeRivals, Astra, DevTrackr and more. C++, Go, TypeScript, React, PostgreSQL.',
  shortDescription:
    'Software engineer building legal tech at Retsguide, KDE Plasma contributor, and builder of CodeRivals, Astra and DevTrackr. C++, Go, TypeScript, React, PostgreSQL.',
  bio:
    'Sangam Pratap Singh is a software engineer and third-year Integrated Dual Degree (B.Tech IT + MBA) student at ABV-IIITM Gwalior. He builds full-stack and systems software in TypeScript, Go and C++, contributes to KDE Plasma, and currently works on legal technology at Retsguide in Denmark.',
  ogImage: `${ORIGIN}/og.png`,
  locale: 'en_US',
  lang: 'en',
  themeColorDark: '#080808',
  themeColorLight: '#ffffff',
  calendar: 'https://www.cal.com/random-pikachu/15min',
  resume: '/resume.pdf',
  location: {
    city: 'Gwalior',
    region: 'Madhya Pradesh',
    country: 'IN',
  },
  profiles: {
    github: 'https://github.com/Random-Pikachu',
    linkedin: 'https://linkedin.com/in/sangam21',
    kde: 'https://invent.kde.org/randompikachu',
  },
} as const;

/**
 * The home page's sections, in order. This is the ONLY place these ids are
 * written: Home.tsx renders them and structuredData.ts emits them as jump
 * links, so the two cannot drift. They did drift — the graph advertised
 * #about, #experience, #projects and #contact while the DOM had none of them.
 */
export const SECTIONS = [
  { id: 'who', label: 'intro', heading: 'Sangam Pratap Singh' },
  { id: 'exp', label: 'experience', heading: 'Experience' },
  { id: 'work', label: 'work', heading: 'Selected projects' },
  { id: 'photos', label: 'photos', heading: 'Photography' },
  { id: 'say-hi', label: 'contact', heading: 'Contact' },
] as const;

export const SKILLS = [
  'Photography', 'C++', 'Go', 'TypeScript', 'Qt/QML', 'Python', 'WebSockets',
  'React', 'Node.js', 'PostgreSQL', 'AWS', 'Linux',
] as const;

export interface ExperiencePoint {
  href: string | null;
  label: string | null;
  text: string;
}

export interface Experience {
  period: string;
  /** ISO dates for schema.org and <time> elements. */
  startDate: string;
  endDate: string | null;
  company: string;
  companyUrl: string;
  role: string;
  /** City, where it is worth naming. */
  location?: string;
  /** The one line from this job that is worth setting at scale. */
  claim: string;
  points: ExperiencePoint[];
  stack: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    period: 'Jun 2026 — Present',
    startDate: '2026-06',
    endDate: null,
    company: 'Retsguide',
    companyUrl: 'https://retsguide.dk/',
    role: 'Software Engineer Intern (Founding Engineer)',
    location: 'Copenhagen',
    claim: 'I build the legal knowledge graph the reports rest on, and no model is allowed to write to it.',
    points: [
      { href: null, label: null, text: 'Shipped three customer-facing flows end to end — research and schema design through production' },
      { href: null, label: null, text: 'Building the legal knowledge graph the product’s reports rest on, with no model permitted to write to it, so every claim traces back to the provision version it stands on' },
      { href: null, label: null, text: 'Built the document pipeline behind eligibility checks: OCR reads the PDF, a model classifies and extracts, and code — not the model — applies the statutory formula' },
      { href: null, label: null, text: 'Designed the Prisma/PostgreSQL schema and ran live-data-preserving migrations against production' },
      { href: null, label: null, text: 'Cut server response time from over 2s to 150ms by restructuring the SSR data path' },
    ],
    stack: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Azure'],
  },
  {
    period: 'Dec 2025 — May 2026',
    startDate: '2025-12',
    endDate: '2026-05',
    company: 'KDE Plasma',
    companyUrl: 'https://kde.org/',
    role: 'Open Source Contributor',
    claim: 'Five patches merged into Plasma, and the work was picked up in This Week in Plasma.',
    points: [
      {
        href: 'https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6280',
        label: 'MR 6280',
        text: 'SHA-256 content-hash caching for Plasma Wallpaper Gallery',
      },
      {
        href: 'https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6208',
        label: 'MR 6208',
        text: 'KConfig-based wallpaper directory persistence across sessions',
      },
      {
        href: 'https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6103',
        label: 'MR 6103',
        text: '"Enter" key accessibility for calendar headers in Plasma Digital Clock',
      },
      {
        href: 'https://invent.kde.org/office/marknote/-/merge_requests/172',
        label: 'MR 172',
        text: 'Fix todo checkbox inheritance bug in KDE Marknote',
      },
      {
        href: 'https://invent.kde.org/graphics/drawy/-/merge_requests/430',
        label: 'MR 430',
        text: 'Added press and hold spacebar to switch to pan tool in KDE Drawy',
      },
      {
        href: 'https://blogs.kde.org/2026/02/07/this-week-in-plasma-beefed-up-window-list-widget/',
        label: 'This Week in Plasma',
        text: "work featured in KDE's weekly blog (Feb 2026)",
      },
    ],
    stack: ['C++', 'Qt/QML', 'KConfig'],
  },
  {
    period: 'Jul 2025 — Sep 2025',
    startDate: '2025-07',
    endDate: '2025-09',
    company: 'OpenSphere',
    companyUrl: 'https://opensphere.ai/',
    role: 'Software Development Intern',
    location: 'San Francisco',
    claim: 'Built the concurrent WebSocket service behind real-time threaded commenting in the editor.',
    points: [
      { href: null, label: null, text: 'Built concurrent WebSocket service powering real-time threaded commenting in the text editor' },
      { href: null, label: null, text: 'Reworked drafting workflow, removing a redundant data-filing stage and doubling throughput' },
      { href: null, label: null, text: 'Worked on task creation pipelines, accelerating client onboarding' },
      { href: null, label: null, text: 'Built user activity tracking dashboard for action logs' },
    ],
    stack: ['TypeScript', 'Node.js', 'WebSockets', 'React', 'MongoDB', 'AWS SES'],
  },
];


/** Everything the Person entity claims expertise in, deduped across sections. */
export const KNOWS_ABOUT = [
  'C++', 'Go', 'TypeScript', 'JavaScript', 'Python', 'React', 'Next.js', 'Node.js',
  'PostgreSQL', 'Prisma', 'MongoDB', 'Qt', 'QML', 'KDE Plasma', 'WebSockets',
  'Electron', 'AWS', 'Azure', 'Linux', 'Open Source Software', 'Legal Technology',
  'Distributed Systems', 'Databases', 'Photography',
];
