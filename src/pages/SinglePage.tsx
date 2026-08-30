import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Linkedin, Github, ExternalLink, Youtube } from 'lucide-react';
import { useScramble } from '../hooks/useScramble';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { SITE, SECTIONS, SKILLS, EXPERIENCES, PROJECTS } from '../data/site';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * `reveal` is the hook the <noscript> stylesheet in index.html uses to force
 * everything visible when JavaScript never runs, so the prerendered content is
 * readable rather than stuck at opacity 0.
 */
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
      className={`reveal ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Visible label stays lowercase to match the design; the descriptive half is
 * exposed to screen readers and crawlers so each heading says what it is about.
 */
function SectionHeader({
  num,
  label,
  heading,
  id,
}: {
  num: string;
  label: string;
  heading: string;
  id: string;
}) {
  return (
    <FadeUp className="mb-12">
      <p className="mono text-accent text-sm tracking-[0.2em] mb-2" aria-hidden="true">{`[ ${num} ]`}</p>
      <h2 id={`${id}-heading`} className="text-text-base text-2xl font-semibold tracking-tight">
        <span aria-hidden="true">{label}</span>
        <span className="sr-only">{heading}</span>
      </h2>
    </FadeUp>
  );
}

const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

export default function SinglePage() {
  const { display: heroName } = useScramble('/sangam', 600);
  const year = new Date().getFullYear();

  return (
    <main id="main" className="bg-bg-base text-text-base font-mono min-h-screen">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        id="hero"
        aria-label="Introduction"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* grid bg */}
        <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
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
          className="reveal absolute top-24 right-8 md:right-16 text-text-faint text-sm leading-relaxed select-none pointer-events-none hidden md:block"
          aria-hidden="true"
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
            className="reveal text-text-base font-bold tracking-tight leading-none mb-8"
            style={{
              fontSize: 'clamp(52px, 12vw, 112px)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span className="sr-only">{SITE.name} — {SITE.jobTitle}</span>
            <span aria-hidden="true">{heroName}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease }}
            className="reveal mono text-text-faint text-sm tracking-[0.18em] mb-3"
          >
            developer &nbsp;✦&nbsp; open source &nbsp;✦&nbsp; cultured
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6, ease }}
            className="reveal mono text-accent text-base"
          >
            building a legal tech startup for denmark...
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="reveal flex flex-col items-center gap-2 mt-16"
            aria-hidden="true"
          >
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-border-inner" />
            <span className="mono text-text-light text-xs tracking-[0.25em]">keep scrolling</span>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT ────────────────────────────────────────── */}
      <section id="about" aria-labelledby="about-heading" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <SectionHeader {...SECTION_BY_ID.about} id="about" />

          <FadeUp delay={0.1}>
            <p className="text-text-light text-lg leading-[2] max-w-[560px]">
              I am {SITE.name}, 3rd year{' '}
              <span className="text-text-muted font-medium">Integrated Dual Degree</span> student
              (B.Tech IT + MBA) at ABV-IIITM Gwalior.
              <br />
              <br />
              I like building interesting projects and occasionally contributing to
              open source. Currently reading about{' '}
              <span className="text-text-muted font-medium">databases</span>. Besides this,
              I like doing{' '}
              <a href="/photography" className="link-wavy font-medium">
                photography
              </a>{' '}
              and sometimes solve LC/CF problems to keep the brain warm.
              <br />
              <br />
              When I&apos;m not doing any of that, I&apos;m probably sleeping.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="mt-8">
            <h3 className="sr-only">Skills and interests</h3>
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {SKILLS.map((s) =>
                s === 'Photography' ? (
                  <li key={s}>
                    <a
                      href="/photography"
                      className="mono block text-sm text-accent border border-accent/40 px-[10px] py-[5px] hover:border-accent transition-all duration-200"
                    >
                      {s} ↗
                    </a>
                  </li>
                ) : (
                  <li
                    key={s}
                    className="mono text-sm text-text-faint border border-border-inner px-[10px] py-[5px] hover:text-text-base hover:border-border-badge transition-all duration-200"
                  >
                    {s}
                  </li>
                )
              )}
            </ul>
          </FadeUp>
        </div>
      </section>

      <div className="border-t border-border-main max-w-[680px] mx-auto" aria-hidden="true" />

      {/* ─── EXPERIENCE ───────────────────────────────────── */}
      <section id="experience" aria-labelledby="experience-heading" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <SectionHeader {...SECTION_BY_ID.experience} id="experience" />

          <div className="space-y-0">
            {EXPERIENCES.map((exp, i) => (
              <FadeUp key={exp.company} delay={i * 0.08}>
                <article
                  className={`grid grid-cols-1 gap-4 py-8 sm:gap-6 md:grid-cols-[140px_1fr] md:gap-8 md:py-10 ${
                    i < EXPERIENCES.length - 1 ? 'border-b border-border-main' : ''
                  }`}
                >
                  <div className="pt-0.5">
                    <p className="mono text-xs text-text-link leading-relaxed mb-2 sm:text-sm sm:mb-3 whitespace-pre-line">
                      <time dateTime={exp.startDate}>{exp.period.split('—')[0].trim()}</time>
                      {'\n— '}
                      {exp.endDate ? (
                        <time dateTime={exp.endDate}>{exp.period.split('—')[1].trim()}</time>
                      ) : (
                        'Present'
                      )}
                    </p>
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener"
                        className="mono text-sm text-accent hover:opacity-70 transition-opacity break-words"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span className="mono text-sm text-accent">{exp.company}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-text-muted text-base font-medium mb-4 leading-snug">
                      {exp.role}
                      <span className="sr-only"> at {exp.company}</span>
                    </h3>
                    <ul className="space-y-3 mb-5">
                      {exp.points.map((pt, j) => (
                        <li key={j} className="text-sm text-text-muted leading-relaxed flex gap-2 min-w-0">
                          <span className="text-text-faint mt-0.5 shrink-0" aria-hidden="true">▸</span>
                          <span className="min-w-0 break-words">
                            {pt.href && pt.label ? (
                              <>
                                <a
                                  href={pt.href}
                                  target="_blank"
                                  rel="noopener"
                                  className="text-text-light border-b border-border-inner hover:text-accent hover:border-accent transition-colors break-words"
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
                    <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
                      {exp.stack.map((t) => (
                        <li
                          key={t}
                          className="mono text-xs text-text-light border border-border-badge px-2 py-0.5"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border-main max-w-[680px] mx-auto" aria-hidden="true" />

      {/* ─── PROJECTS ─────────────────────────────────────── */}
      <section id="projects" aria-labelledby="projects-heading" className="py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <SectionHeader {...SECTION_BY_ID.projects} id="projects" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PROJECTS.map((proj, i) => {
              const colClass =
                proj.span === 5 ? 'md:col-span-5' : proj.span === 3 ? 'md:col-span-3' : 'md:col-span-2';
              const slug = proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <FadeUp key={proj.index} delay={i * 0.06} className={colClass}>
                  <motion.article
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    aria-labelledby={`project-${slug}`}
                    className="p-7 border border-border-main rounded-lg h-full"
                  >
                    <p className="mono text-xs text-text-light mb-3" aria-hidden="true">{proj.index} ///</p>
                    <h3
                      id={`project-${slug}`}
                      className="text-text-card-title text-lg font-semibold mb-2 tracking-tight"
                    >
                      {proj.title}
                    </h3>
                    <p className="text-text-faint text-sm leading-relaxed mb-4">{proj.description}</p>
                    <ul className="flex flex-wrap gap-1.5 mb-4 list-none p-0 m-0">
                      {proj.stack.map((t) => (
                        <li
                          key={t}
                          className="mono text-xs text-text-light border border-border-inner px-1.5 py-0.5 rounded"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-4">
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener"
                        aria-label={`${proj.title} source code on GitHub`}
                        className="mono text-xs text-text-link border-b border-border-inner hover:text-accent hover:border-accent transition-colors flex items-center gap-1"
                      >
                        <Github className="w-3 h-3" aria-hidden="true" /> github ↗
                      </a>
                      {proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener"
                          aria-label={`${proj.title} live demo`}
                          className="mono text-xs text-text-link border-b border-border-inner hover:text-accent hover:border-accent transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" aria-hidden="true" /> live ↗
                        </a>
                      )}
                      {proj.youtube && (
                        <a
                          href={proj.youtube}
                          target="_blank"
                          rel="noopener"
                          aria-label={`${proj.title} video walkthrough on YouTube`}
                          className="mono text-xs text-text-link border-b border-border-inner hover:text-accent hover:border-accent transition-colors flex items-center gap-1"
                        >
                          <Youtube className="w-3 h-3" aria-hidden="true" /> demo ↗
                        </a>
                      )}
                    </div>
                  </motion.article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <div className="border-t border-border-main max-w-[680px] mx-auto" aria-hidden="true" />

      {/* ─── CONTACT ──────────────────────────────────────── */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="min-h-screen flex flex-col justify-center overflow-x-hidden py-24 px-6 text-center"
      >
        <div className="mx-auto w-full max-w-[680px]">
          <SectionHeader {...SECTION_BY_ID.contact} id="contact" />

          <FadeUp delay={0.1}>
            <p className="mono text-text-faint text-sm mb-10">
              open to remote work &amp; interesting projects
            </p>
          </FadeUp>

          <FadeUp delay={0.15} className="mb-12 sm:mb-16">
            <address className="not-italic flex flex-wrap justify-center gap-x-6 gap-y-4">
              {[
                {
                  icon: Mail,
                  label: 'mail',
                  href: `mailto:${SITE.email}`,
                  aria: `Email ${SITE.name}`,
                  me: false,
                },
                {
                  icon: Linkedin,
                  label: 'linkedin',
                  href: SITE.profiles.linkedin,
                  aria: `${SITE.name} on LinkedIn`,
                  me: true,
                },
                {
                  icon: Github,
                  label: 'github',
                  href: SITE.profiles.github,
                  aria: `${SITE.name} on GitHub`,
                  me: true,
                },
              ].map(({ icon: Icon, label, href, aria, me }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel={me ? 'me noopener' : 'noopener'}
                  aria-label={aria}
                  className="mono inline-flex items-center gap-1.5 text-sm text-text-link border-b border-border-badge pb-0.5 hover:text-accent hover:border-accent transition-colors"
                >
                  <Icon className="w-3 h-3" aria-hidden="true" />
                  {label} ↗
                </a>
              ))}
            </address>
          </FadeUp>

          <FadeUp delay={0.18} className="mb-16 w-full max-w-full">
            <h3 className="sr-only">Coding activity</h3>
            <ContributionHeatmap />
          </FadeUp>

          <FadeUp delay={0.2}>
            <pre
              className="mono text-text-faint text-sm leading-relaxed select-none mb-8"
              aria-hidden="true"
            >
              {` (\\__/)
(•ω•)ノ
/ > ⚡`}
            </pre>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mono text-text-faint text-[10px] leading-relaxed tracking-[0.12em] sm:text-xs sm:tracking-[0.15em] break-words">
              © {year} {SITE.handle.toLowerCase()} &nbsp;·&nbsp; [ pokedex entry #025 ]
            </p>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
