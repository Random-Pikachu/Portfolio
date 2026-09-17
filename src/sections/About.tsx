import { useState } from 'react';
import { FadeUp, Words } from '../motion/primitives';
import { STAGGER } from '../motion/tokens';
import { NOW, SECTIONS, SITE, TOOLBOX } from '../data/site';
import { SectionRail } from './SectionRail';

const SECTION = SECTIONS[0];

/** The first frame of the gallery, shown beside the pointer as a hint of what the link opens. */
const PEEK = {
  src: '/photos/img-20260528-215114521-400.webp',
  alt: '',
};

/** The photography link, with a small print that tilts in under the pointer. */
function PhotoLink({ children }: { children: string }) {
  const [on, setOn] = useState(false);
  return (
    <span className="relative inline-block">
      <a
        href="/photography"
        className="link-wavy font-medium"
        onMouseEnter={() => setOn(true)}
        onMouseLeave={() => setOn(false)}
        onFocus={() => setOn(true)}
        onBlur={() => setOn(false)}
      >
        {children}
      </a>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 bottom-full z-10 mb-3 hidden w-36 -translate-x-1/2 overflow-hidden border border-border-main bg-bg-card p-1 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.45)] transition-all duration-500 ease-[var(--ease-out)] md:block ${
          on ? 'translate-y-0 rotate-[-3deg] opacity-100' : 'translate-y-2 rotate-0 opacity-0'
        }`}
      >
        <img src={PEEK.src} alt={PEEK.alt} width={144} height={90} className="block aspect-[16/10] w-full object-cover" loading="lazy" />
      </span>
    </span>
  );
}

export function About() {
  return (
    <div className="py-16 md:py-20">
      <div className="wrap grid-12">
        <SectionRail {...SECTION} id="about" />

        <div className="content">
          <Words
            className="t-pull max-w-[30ch] text-text-base"
            text={`I am ${SITE.name}, a third-year Integrated Dual Degree student, B.Tech IT and MBA, at ABV-IIITM Gwalior. I like building interesting projects and occasionally contributing to open source.`}
          />

          <FadeUp delay={0.1} className="mt-8 max-w-[52ch]">
            <p className="t-body text-text-muted">
              Besides this, I like doing <PhotoLink>photography</PhotoLink> and sometimes solve
              LeetCode and Codeforces problems to keep the brain warm. When I&apos;m not doing any of
              that, I&apos;m probably sleeping.
            </p>
          </FadeUp>

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-x-10">
            <FadeUp delay={0.05}>
              <h3 className="t-meta text-text-faint">currently</h3>
              <dl className="mt-4">
                {NOW.map((n, i) => (
                  <div
                    key={n.label}
                    className={`grid grid-cols-[6rem_1fr] gap-x-4 py-3 ${i > 0 ? 'border-t border-border-main' : ''}`}
                  >
                    <dt className="t-mono text-text-faint">{n.label}</dt>
                    <dd className="t-mono text-text-base">
                      {'href' in n ? (
                        <a href={n.href} className="underline-draw">
                          {n.text}
                        </a>
                      ) : (
                        n.text
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h3 className="t-meta text-text-faint">toolbox</h3>
              <dl className="mt-4">
                {TOOLBOX.map((g, i) => (
                  <div
                    key={g.group}
                    className={`grid grid-cols-[6rem_1fr] gap-x-4 py-3 ${i > 0 ? 'border-t border-border-main' : ''}`}
                  >
                    <dt className="t-mono text-text-faint">{g.group}</dt>
                    <dd className="t-mono text-text-base">
                      <ul className="flex flex-wrap gap-x-3 gap-y-1">
                        {g.items.map((item, j) => (
                          <FadeUp as="li" key={item} delay={0.1 + j * STAGGER}>
                            {item}
                          </FadeUp>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
