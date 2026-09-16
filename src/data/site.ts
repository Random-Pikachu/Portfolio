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

/** Ordered list of in-page sections. Drives nav, anchors and the sitemap. */
export const SECTIONS = [
  { id: 'about', label: 'about', heading: 'About Sangam Pratap Singh', num: '00' },
  { id: 'experience', label: 'experience', heading: 'Work experience', num: '01' },
  { id: 'projects', label: 'projects', heading: 'Selected projects', num: '02' },
  { id: 'contact', label: 'contact', heading: 'Contact', num: '03' },
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
    role: 'Software Engineer Intern (Full Stack)',
    points: [
      { href: null, label: null, text: 'Owned three customer-facing application flows end-to-end, from design to deployment' },
      { href: null, label: null, text: 'Designed the Prisma/PostgreSQL schema and ran live-data-preserving migrations on production' },
      { href: null, label: null, text: 'Built modular REST services with state-machine transitions and an AI-assisted document-classification pipeline' },
      { href: null, label: null, text: 'Cut server response time from 2s+ to 150ms by restructuring the SSR data path' },
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
    points: [
      { href: null, label: null, text: 'Built concurrent WebSocket service powering real-time threaded commenting in the text editor' },
      { href: null, label: null, text: 'Reworked drafting workflow, removing a redundant data-filing stage and doubling throughput' },
      { href: null, label: null, text: 'Worked on task creation pipelines, accelerating client onboarding' },
      { href: null, label: null, text: 'Built user activity tracking dashboard for action logs' },
    ],
    stack: ['TypeScript', 'Node.js', 'WebSockets', 'React', 'MongoDB', 'AWS SES'],
  },
];

export interface Project {
  index: string;
  title: string;
  description: string;
  stack: string[];
  github: string;
  live: string;
  youtube: string;
  /** Bento column span on the 5-column desktop grid. */
  span: 2 | 3 | 5;
}

export const PROJECTS: Project[] = [
  {
    index: '01',
    title: 'Ephemeris',
    description:
      'A daily planner, habit tracker and journal that asks for thirty seconds an evening. Name the blocks of a good day, record which ones happened, keep a streak and a Markdown diary, and get one email at dusk in your own time zone. Gemini summarises a day or reviews a week from your own entries.',
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Gemini', 'Resend'],
    github: 'https://github.com/Random-Pikachu/ephemeris-client',
    live: 'https://ephemeris.random-pikachu.dev/',
    youtube: '',
    span: 5,
  },
  {
    index: '02',
    title: 'CodeRivals',
    description:
      'A real-time 1v1 competitive coding platform where players duel in live matches and strategically deploy power cards to influence round outcomes.',
    stack: ['React', 'SpacetimeDB', 'AWS EC2', 'Monaco Editor'],
    github: 'https://github.com/Sypher845/code-rivals',
    live: 'https://code-rivals-six.vercel.app/',
    youtube: 'https://www.youtube.com/watch?v=mmFpLflQln4',
    span: 3,
  },
  {
    index: '03',
    title: 'Astra',
    description:
      'A desktop tool that scans your code for security risks. It checks your project dependencies against vulnerability databases and uses AI to automatically suggest fixes, saving you from manual patching.',
    stack: ['Electron', 'React', 'Gemini CLI', 'Tree-Sitter', 'Socket.io'],
    github: 'https://github.com/Random-Pikachu/Astra',
    live: '',
    youtube: 'https://youtu.be/XFiMSWMZ4KU',
    span: 2,
  },
  {
    index: '04',
    title: 'DevTrackr',
    description:
      'Go service with PostgreSQL and REST APIs that aggregates user activity from platforms like GitHub, LeetCode, and Codeforces, and delivers daily digests.',
    stack: ['Go', 'PostgreSQL', 'React', 'Github/LC/CF APIs'],
    github: 'https://github.com/Random-Pikachu/DevTrackr-Backend',
    live: 'https://devtrackr-hci.vercel.app/',
    youtube: 'https://youtu.be/kUKd9O6k4Zg',
    span: 2,
  },
  {
    index: '05',
    title: 'GitStory',
    description:
      'AI-powered tool designed to visualize and analyze GitHub repositories through a conversational interface. It renders rich, interactive components such as commit timelines, pull request summaries, diff viewers, and risk heatmaps.',
    stack: ['React', 'TamboAI', 'Tailwind'],
    github: 'https://github.com/Random-Pikachu/GitStory',
    live: 'https://git-story-tan.vercel.app/',
    youtube: '',
    span: 3,
  },
  {
    index: '06',
    title: 'SecurePDF',
    description:
      "An offline desktop tool that locks PDFs to a specific computer so they can't be shared. It uses hardware binding and time limits to control access, while completely disabling printing and copying to prevent leaks.",
    stack: ['Python', 'Fernet', 'PyMuPDF', 'CustomTkinter'],
    github: 'https://github.com/Random-Pikachu/SecurePDF',
    live: 'https://secure-pdf-five.vercel.app/',
    youtube: '',
    span: 3,
  },
  {
    index: '07',
    title: 'Code-Sync',
    description:
      'A collaborative code editor that works like Google Docs for developers. It lets you write code with friends in real-time, see their cursor position in the editor, and run code using Judge0.',
    stack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Monaco Editor'],
    github: 'https://github.com/Random-Pikachu/Code-Sync',
    live: 'https://codesync-v8bl.onrender.com/',
    youtube: '',
    span: 2,
  },
  {
    index: '08',
    title: 'Sorting Visualizer',
    description:
      'Interactive visualizer for sorting algorithms. Watch Merge Sort, Quick Sort and more in real-time.',
    stack: ['React'],
    github: 'https://github.com/Random-Pikachu/Sorting-Visualizer-v2',
    live: 'https://random-pikachu.github.io/Sorting-Visualizer-v2/',
    youtube: '',
    span: 5,
  },
];

/** Everything the Person entity claims expertise in, deduped across sections. */
export const KNOWS_ABOUT = [
  'C++', 'Go', 'TypeScript', 'JavaScript', 'Python', 'React', 'Next.js', 'Node.js',
  'PostgreSQL', 'Prisma', 'MongoDB', 'Qt', 'QML', 'KDE Plasma', 'WebSockets',
  'Electron', 'AWS', 'Azure', 'Linux', 'Open Source Software', 'Legal Technology',
  'Distributed Systems', 'Databases', 'Photography',
];
