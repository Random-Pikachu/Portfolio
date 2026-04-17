import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import { useScramble } from '../hooks/useScramble';
import ContributionHeatmap from '../components/ContributionHeatmap';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <FadeUp className="mb-12">
      <p className="mono text-accent text-sm tracking-[0.2em] mb-2">{`[ ${num} ]`}</p>
      <h2 className="text-text-base text-2xl font-semibold tracking-tight">{title}</h2>
    </FadeUp>
  );
}

export default function SinglePage() {
  const { display: heroName } = useScramble('/sangam', 800);


  const experiences = [
    {
      period: 'Dec 2025 — Present',
      company: 'KDE Linux',
      companyUrl: 'https://kde.org/',
      role: 'Open Source Contributor',
      points: [
        {
          href: 'https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6103',
          label: 'MR 6103',
          text: '"Enter" key accessibility for calendar headers in Plasma Digital Clock',
        },
        {
          href: 'https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6208',
          label: 'MR 6208',
          text: 'KConfig-based wallpaper directory persistence across sessions',
        },
        {
          href: 'https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6280',
          label: 'MR 6280',
          text: 'SHA-256 content-hash caching for Plasma Wallpaper Gallery',
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
      ],
      stack: ['C++', 'Qt/QML', 'KConfig'],
    },
    {
      period: 'Jul 2025 — Sep 2025',
      company: 'OpenSphere',
      companyUrl: 'https://opensphere.ai/',
      role: 'Software Development Intern',
      points: [
        { href: null, label: null, text: 'Built real-time commenting system integrated with in-house text editor' },
        { href: null, label: null, text: 'Reworked drafting workflow, reduced manual intervention across the platform' },
        { href: null, label: null, text: 'Worked on task creation pipelines, accelerating client onboarding' },
        { href: null, label: null, text: 'Built user activity tracking dashboard for action logs' },
      ],
      stack: ['TypeScript', 'Node.js', 'WebSockets', 'React', 'MongoDB', 'AWS SES'],
    },
    // {
    //   period: 'Nov 2024 — Feb 2025',
    //   company: 'Divyajeevan NGO',
    //   companyUrl: '',
    //   role: 'Graphic Designer',
    //   points: [
    //     { href: null, label: null, text: 'Designed 2024 Annual Magazine for the organization' },
    //     { href: null, label: null, text: 'Delivered 3 pitch decks for fundraising campaigns' },
    //   ],
    //   stack: ['Adobe Photoshop', 'PowerPoint'],
    // },
  ];

  const projects = [
    {
      index: '01',
      title: 'CodeRivals',
      description:
        'A  real-time 1v1 competitive coding platform where players duel in live matches and strategically deploy power cards to influence round outcomes.',
      stack: ['React', 'SpacetimeDB', 'AWS EC2', 'Monaco Editor'],
      github: 'https://github.com/Sypher845/code-rivals',
      live: 'https://code-rivals-six.vercel.app/',
      youtube: 'https://www.youtube.com/watch?v=mmFpLflQln4',
    },
    {
      index: '02',
      title: 'Astra',
      description:
        'A desktop tool that scans your code for security risks. It checks your project dependencies against vulnerability databases and uses AI to automatically suggest fixes, saving you from manual patching.',
      stack: ['Electron', 'React', 'Gemini CLI', 'Tree-Sitter', 'Socket.io'],
      github: 'https://github.com/Random-Pikachu/Astra',
      live: '',
      youtube: 'https://youtu.be/XFiMSWMZ4KU',
    },
    {
      index: '03',
      title: 'DevTrackr',
      description:
        ' Go service with PostgreSQL and REST APIs that aggregates user activity from platforms like GitHub, LeetCode, and Codeforces, & delivers daily digests',
      stack: ['Go', 'PostgreSQL', 'React', 'Github/LC/CF APIs'],
      github: 'https://github.com/Random-Pikachu/DevTrackr-Backend',
      live: 'https://devtrackr-hci.vercel.app/',
      youtube: '',
    },
    {
      index: '04',
      title: 'GitStory',
      description:
        'AI-powered tool designed to visualize and analyze GitHub repositories through a conversational interface. That can render rich, interactive components such as commit timelines, pull request summaries, diff viewers, and risk heatmaps.',
      stack: ['React', 'TamboAI', 'Tailwind'],
      github: 'https://github.com/Random-Pikachu/GitStory',
      live: 'https://git-story-tan.vercel.app/',
      youtube: '',
    },
    {
      index: '05',
      title: 'SecurePDF',
      description:
        'An offline desktop tool that locks PDFs to a specific computer so they can\'t be shared. It uses hardware binding and time limits to control access, while completely disabling printing and copying to prevent leaks.',
      stack: ['Python', 'Fernet', 'PyMuPDF', 'CustomTkinter'],
      github: 'https://github.com/Random-Pikachu/SecurePDF',
      live: 'https://secure-pdf-five.vercel.app/',
      youtube: '',
    },
    {
      index: '06',
      title: 'Code-Sync',
      description:
        'A collaborative code editor that works like Google Docs for developers. It lets you write code with friends in real-time, see their cursor position in editor, and run code using Judge0.',
      stack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Monaco Editor'],
      github: 'https://github.com/Random-Pikachu/Code-Sync',
      live: 'https://codesync-v8bl.onrender.com/',
      youtube: '',
    },
    {
      index: '07',
      title: 'Sorting Visualizer',
      description:
        'Interactive visualizer for sorting algorithms. Watch Merge Sort, Quick Sort and more in real-time.',
      stack: ['React'],
      github: 'https://github.com/Random-Pikachu/Sorting-Visualizer-v2',
      live: 'https://random-pikachu.github.io/Sorting-Visualizer-v2/',
      youtube: '',
    },
  ];

  return (
    <div className="bg-bg-base text-text-base font-mono min-h-screen">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* grid bg */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--border-inner)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* pikachu ascii — decorative */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="absolute top-24 right-8 md:right-16 text-text-faint text-sm leading-relaxed select-none pointer-events-none hidden md:block"
          aria-hidden
        >
          {` (\\__/)
(•ω•)
/ > ⚡`}
        </motion.pre>

        <div className="relative z-10 text-center px-6 max-w-[720px] mx-auto pt-20 pb-12">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.1 }}
            className="text-text-base font-bold tracking-tight leading-none mb-8"
            style={{
              fontSize: 'clamp(52px, 12vw, 112px)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {heroName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease }}
            className="mono text-text-faint text-sm tracking-[0.18em] mb-3"
          >
            developer &nbsp;✦&nbsp; open source &nbsp;✦&nbsp; cultured
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6, ease }}
            className="mono text-accent text-base"
          >
            currently looking for work ♥
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="flex flex-col items-center gap-2 mt-16"
          >
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-border-inner" />
            <span className="mono text-text-light text-xs tracking-[0.25em]">keep scrolling</span>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT ────────────────────────────────────────── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <SectionHeader num="00" title="about" />

          <FadeUp delay={0.1}>
            <p className="text-text-light text-lg leading-[2] max-w-[560px]">
              I am Sangam, 3rd year{' '}
              <span className="text-text-muted font-medium">Integrated Dual Degree</span> student
              (B.Tech IT + MBA) at ABV-IIITM Gwalior.
              <br />
              <br />
              I like building interesting projects and occasionally contributing to
              open source. Currently reading about{' '}
              <span className="text-text-muted font-medium">reverse engineering in Go</span> and{' '}
              <span className="text-text-muted font-medium">databases</span>. Besides this,
              I sometimes solve LC/CF problems to keep the brain warm.
              <br />
              <br />
              When I&apos;m not doing any of that, I&apos;m probably sleeping.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="flex flex-wrap gap-2 mt-8">
            {[
              'C++', 'Go', 'TypeScript', 'Qt/QML', 'Python', 'WebSockets',
              'React', 'Node.js', 'PostgreSQL', 'Linux',
            ].map((s) => (
              <span
                key={s}
                className="mono text-sm text-text-faint border border-border-inner px-[10px] py-[5px] hover:text-text-base hover:border-border-badge transition-all duration-200"
              >
                {s}
              </span>
            ))}
          </FadeUp>
        </div>
      </section>

      <div className="border-t border-border-main max-w-[680px] mx-auto" />

      {/* ─── EXPERIENCE ───────────────────────────────────── */}
      <section id="experience" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <SectionHeader num="01" title="experience" />

          <div className="space-y-0">
            {experiences.map((exp, i) => (
              <FadeUp key={exp.company} delay={i * 0.08}>
                <div
                  className={`grid grid-cols-[140px_1fr] gap-8 py-10 ${i < experiences.length - 1 ? 'border-b border-border-main' : ''
                    }`}
                >
                  <div className="pt-0.5">
                    <p className="mono text-sm text-text-link leading-relaxed mb-3">
                      {exp.period.replace('—', '\n—')}
                    </p>
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-sm text-accent hover:opacity-70 transition-opacity"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span className="mono text-sm text-accent">{exp.company}</span>
                    )}
                  </div>

                  <div>
                    <p className="text-text-muted text-base font-medium mb-4">{exp.role}</p>
                    <ul className="space-y-2 mb-5">
                      {exp.points.map((pt, j) => (
                        <li key={j} className="text-sm text-text-muted leading-relaxed flex gap-2">
                          <span className="text-text-faint mt-0.5 shrink-0">▸</span>
                          <span>
                            {pt.href && pt.label ? (
                              <>
                                <a
                                  href={pt.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-text-light border-b border-border-inner hover:text-accent hover:border-accent transition-colors"
                                >
                                  {pt.label}
                                </a>{' '}
                                — {pt.text}
                              </>
                            ) : (
                              pt.text
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.stack.map((t) => (
                        <span
                          key={t}
                          className="mono text-xs text-text-light border border-border-badge px-2 py-0.5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border-main max-w-[680px] mx-auto" />

      {/* ─── PROJECTS ─────────────────────────────────────── */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <SectionHeader num="02" title="projects" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {projects.map((proj, i) => {
              // Bento span map: 5-col grid, wide=3cols(60%), narrow=2cols(40%), full=5cols
              const spanMap = [3, 2, 2, 3, 3, 2, 5];
              const span = spanMap[i] ?? 2;
              const colClass = span === 5 ? 'md:col-span-5' : span === 3 ? 'md:col-span-3' : 'md:col-span-2';
              return (
                <FadeUp key={proj.index} delay={i * 0.06} className={colClass}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="p-7 border border-border-main rounded-lg h-full"
                  >
                    <p className="mono text-xs text-text-light mb-3">{proj.index} ///</p>
                    <h3 className="text-text-card-title text-lg font-semibold mb-2 tracking-tight">
                      {proj.title}
                    </h3>
                    <p className="text-text-faint text-sm leading-relaxed mb-4">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.stack.map((t) => (
                        <span
                          key={t}
                          className="mono text-xs text-text-light border border-border-inner px-1.5 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-xs text-text-link border-b border-border-inner hover:text-accent hover:border-accent transition-colors flex items-center gap-1"
                      >
                        <Github className="w-3 h-3" /> github ↗
                      </a>
                      {proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono text-xs text-text-link border-b border-border-inner hover:text-accent hover:border-accent transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> live ↗
                        </a>
                      )}
                      {proj.youtube && (
                        <a
                          href={proj.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono text-xs text-text-link border-b border-border-inner hover:text-accent hover:border-accent transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> demo ↗
                        </a>
                      )}
                    </div>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <div className="border-t border-border-main max-w-[680px] mx-auto" />

      {/* ─── CONTACT ──────────────────────────────────────── */}
      <section id="contact" className="min-h-screen flex flex-col justify-center py-24 px-6 text-center">
        <div className="max-w-[680px] mx-auto">
          <SectionHeader num="03" title="contact" />

          <FadeUp delay={0.1}>
            <p className="mono text-text-faint text-sm mb-10">
              open to remote work &amp; interesting projects
            </p>
          </FadeUp>

          <FadeUp delay={0.15} className="flex justify-center gap-8 mb-16">
            {[
              { icon: Mail, label: 'mail', href: 'mailto:sangampratapsingh21012006@gmail.com' },
              { icon: Linkedin, label: 'linkedin', href: 'https://linkedin.com/in/sangam21' },
              { icon: Github, label: 'github', href: 'https://github.com/Random-Pikachu' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-sm text-text-link border-b border-border-badge pb-0.5 hover:text-accent hover:border-accent transition-colors flex items-center gap-1.5"
              >
                <Icon className="w-3 h-3" />
                {label} ↗
              </a>
            ))}
          </FadeUp>

          <FadeUp delay={0.18} className="mb-16">
            <ContributionHeatmap />
          </FadeUp>

          <FadeUp delay={0.2}>
            <pre
              className="mono text-text-faint text-sm leading-relaxed select-none mb-8"
              aria-hidden
            >
              {` (\\__/)
(•ω•)ノ
/ > ⚡`}
            </pre>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mono text-text-faint text-xs tracking-[0.15em]">
              © 2025 random-pikachu &nbsp;·&nbsp; [ pokedex entry #025 ]
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
