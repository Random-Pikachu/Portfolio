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
  themeColorDark: '#0a0a0a',
  themeColorLight: '#f3f0e8',
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
 * Ordered list of in-page sections. Drives nav, anchors and the sitemap. Each
 * section is a chart of the atlas; `block` is what its title block reads and
 * `caption` sits at the right of its head row.
 */
export const SECTIONS = [
  { id: 'about', label: 'about', heading: 'About Sangam Pratap Singh', num: '01', block: 'Observer', caption: 'Station ABV-IIITM · 1 instrument' },
  { id: 'experience', label: 'experience', heading: 'Work experience', num: '02', block: 'Transits', caption: '3 transits · Jul 2025 → now' },
  { id: 'projects', label: 'projects', heading: 'Selected projects', num: '03', block: 'Constellations', caption: '6 plates · 2 not charted' },
  { id: 'contact', label: 'contact', heading: 'Contact', num: '04', block: 'Transmission', caption: 'Signal · light-time 15 min' },
] as const;

/** Chart 00, the frontispiece. Not a nav section; it is the top of the page. */
export const COVER = {
  id: 'cover',
  label: 'cover',
  heading: 'Sangam Pratap Singh',
  num: '00',
  block: 'Frontispiece',
  caption: 'Gwalior · 26°13′ N 78°10′ E · Epoch J2026.7',
} as const;

/** Every chart of the home page, frontispiece first. */
export const SHEETS = [COVER, ...SECTIONS] as const;

/** The pages outside the home set, as the rail and the index list them. */
export const PAGES = [
  { id: 'notes', label: 'notes', heading: 'Notes', href: '/blog', block: 'Notes' },
  { id: 'survey', label: 'survey', heading: 'Photography', href: '/photography', block: 'Survey' },
] as const;

/** Where the drawings are made. Drives the title block and the clock. */
export const PLACE = {
  city: 'Gwalior',
  lat: 26.22,
  lon: 78.18,
  coords: '26°13′ N 78°10′ E',
  timeZone: 'Asia/Kolkata',
  zoneLabel: 'IST',
} as const;

/** The atlas number on every chart. Also a pokédex entry. */
export const DRAWING_NO = '025';

/** The toolbox, grouped so a reader can scan it in three glances. */
export const TOOLBOX = [
  { group: 'languages', items: ['C++', 'Go', 'TypeScript', 'Python'] },
  { group: 'runtime', items: ['React', 'Node.js', 'Qt/QML', 'WebSockets'] },
  { group: 'infra', items: ['PostgreSQL', 'AWS', 'Linux'] },
] as const;

/** What is on the desk right now. */
export const NOW = [
  { label: 'reading', text: 'machine learning' },
  { label: 'solving', text: 'LeetCode and Codeforces, to keep the brain warm' },
  { label: 'shooting', text: 'on a Nothing Phone (1)', href: '/photography' },
] as const;

export interface ExperiencePoint {
  href: string | null;
  label: string | null;
  text: string;
  /** Marked in the timeline: the one line worth a second look. */
  featured?: true;
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
        featured: true,
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
  /** URL-safe name: the plate anchor is #project-<slug>, the detail sheet /work/<slug>. */
  slug: string;
  title: string;
  /** One line for the banner caption; the paragraph is for crawlers and the stacked view. */
  summary: string;
  description: string;
  stack: string[];
  github: string;
  live: string;
  youtube: string;
  /** Basename under public/work, or null for a project with no screenshot yet. */
  image: string | null;
  /** Listed after the strip as "not charted" rather than given a plate. */
  archived?: true;
}

export const PROJECTS: Project[] = [
  {
    index: '01',
    slug: 'ephemeris',
    title: 'Ephemeris',
    summary: 'A daily planner, habit tracker and journal that asks for thirty seconds an evening.',
    description:
      'A daily planner, habit tracker and journal that asks for thirty seconds an evening. Name the blocks of a good day, record which ones happened, keep a streak and a Markdown diary, and get one email at dusk in your own time zone. Gemini summarises a day or reviews a week from your own entries.',
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Gemini', 'Resend'],
    github: 'https://github.com/Random-Pikachu/ephemeris-client',
    live: 'https://ephemeris.random-pikachu.dev/',
    youtube: '',
    image: 'ephemeris',
  },
  {
    index: '02',
    slug: 'coderivals',
    title: 'CodeRivals',
    summary: 'Real-time 1v1 coding duels with power cards that change the round.',
    description:
      'A real-time 1v1 competitive coding platform where players duel in live matches and strategically deploy power cards to influence round outcomes.',
    stack: ['React', 'SpacetimeDB', 'AWS EC2', 'Monaco Editor'],
    github: 'https://github.com/Sypher845/code-rivals',
    live: 'https://code-rivals-six.vercel.app/',
    youtube: 'https://www.youtube.com/watch?v=mmFpLflQln4',
    image: 'code-rivals',
  },
  {
    index: '03',
    slug: 'astra',
    title: 'Astra',
    summary: 'A desktop scanner that finds vulnerable dependencies and drafts the fix.',
    description:
      'A desktop tool that scans your code for security risks. It checks your project dependencies against vulnerability databases and uses AI to automatically suggest fixes, saving you from manual patching.',
    stack: ['Electron', 'React', 'Gemini CLI', 'Tree-Sitter', 'Socket.io'],
    github: 'https://github.com/Random-Pikachu/Astra',
    live: '',
    youtube: 'https://youtu.be/XFiMSWMZ4KU',
    image: 'astra',
  },
  {
    index: '04',
    slug: 'devtrackr',
    title: 'DevTrackr',
    summary: 'One heatmap for GitHub, LeetCode and Codeforces, with a daily digest.',
    description:
      'Go service with PostgreSQL and REST APIs that aggregates user activity from platforms like GitHub, LeetCode, and Codeforces, and delivers daily digests.',
    stack: ['Go', 'PostgreSQL', 'React', 'GitHub/LC/CF APIs'],
    github: 'https://github.com/Random-Pikachu/DevTrackr-Backend',
    live: 'https://devtrackr-hci.vercel.app/',
    youtube: 'https://youtu.be/kUKd9O6k4Zg',
    image: 'devtrackr',
  },
  {
    index: '05',
    slug: 'gitstory',
    title: 'GitStory',
    summary: 'Talk to a repository and get timelines, diffs and risk maps back.',
    description:
      'AI-powered tool designed to visualize and analyze GitHub repositories through a conversational interface. It renders rich, interactive components such as commit timelines, pull request summaries, diff viewers, and risk heatmaps.',
    stack: ['React', 'TamboAI', 'Tailwind'],
    github: 'https://github.com/Random-Pikachu/GitStory',
    live: 'https://git-story-tan.vercel.app/',
    youtube: '',
    image: 'gitstory',
  },
  {
    index: '06',
    slug: 'code-sync',
    title: 'Code-Sync',
    summary: 'Google Docs for code: shared cursors, one room, run it with Judge0.',
    description:
      'A collaborative code editor that works like Google Docs for developers. It lets you write code with friends in real-time, see their cursor position in the editor, and run code using Judge0.',
    stack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Monaco Editor'],
    github: 'https://github.com/Random-Pikachu/Code-Sync',
    live: 'https://codesync-v8bl.onrender.com/',
    youtube: '',
    image: 'code-sync',
  },
  {
    index: '07',
    slug: 'securepdf',
    title: 'SecurePDF',
    summary: 'PDFs locked to one machine, with a clock, and no way to print or copy.',
    description:
      "An offline desktop tool that locks PDFs to a specific computer so they can't be shared. It uses hardware binding and time limits to control access, while completely disabling printing and copying to prevent leaks.",
    stack: ['Python', 'Fernet', 'PyMuPDF', 'CustomTkinter'],
    github: 'https://github.com/Random-Pikachu/SecurePDF',
    live: 'https://secure-pdf-five.vercel.app/',
    youtube: '',
    image: 'securepdf',
    archived: true,
  },
  {
    index: '08',
    slug: 'sorting-visualizer',
    title: 'Sorting Visualizer',
    summary: 'Watch merge sort and quick sort race, bar by bar.',
    description:
      'Interactive visualizer for sorting algorithms. Watch Merge Sort, Quick Sort and more in real-time.',
    stack: ['React'],
    github: 'https://github.com/Random-Pikachu/Sorting-Visualizer-v2',
    live: 'https://random-pikachu.github.io/Sorting-Visualizer-v2/',
    youtube: '',
    image: 'sorting-visualizer',
    archived: true,
  },
];

/** The six plates of the Constellations chart, in order. */
export const PLATES = PROJECTS.filter((p) => !p.archived);
/** Projects listed after the strip as not charted. */
export const ARCHIVE = PROJECTS.filter((p) => p.archived);

/** Everything the Person entity claims expertise in, deduped across sections. */
export const KNOWS_ABOUT = [
  'C++', 'Go', 'TypeScript', 'JavaScript', 'Python', 'React', 'Next.js', 'Node.js',
  'PostgreSQL', 'Prisma', 'MongoDB', 'Qt', 'QML', 'KDE Plasma', 'WebSockets',
  'Electron', 'AWS', 'Azure', 'Linux', 'Open Source Software', 'Legal Technology',
  'Distributed Systems', 'Databases', 'Photography',
];
