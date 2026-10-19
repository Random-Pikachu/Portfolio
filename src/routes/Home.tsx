import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import Peek from '../components/Peek';
import { PROJECTS } from '../data/work';
import { SITE } from '../data/site';
import { PHOTOS } from '../data/photos';

const BAND = [
  'Founding engineer', '✳', 'AI systems', '✳', 'Graph retrieval', '✳',
  'C++ / Qt', '✳', 'TypeScript', '✳', 'Go', '✳', 'PyTorch', '✳',
  'KDE Plasma', '✳', 'Photography', '✳',
];

export default function Home() {
  const [peek, setPeek] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Peek src={peek?.src ?? null} alt={peek?.alt ?? ''} />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <header className="hero">
        <div className="hero-top">
          <p className="mono">Copenhagen / Gwalior &mdash; {new Date().getFullYear()}</p>
          <p>
            I build AI systems that can be checked. The model reads and ranks;
            the code decides.
          </p>
        </div>

        <h1 className="mega">
          {['Sangam', 'Pratap', 'Singh'].map((w, i) => (
            <span className="line" key={w}>
              <span style={{
                animation: `riseIn 900ms cubic-bezier(.22,1,.36,1) ${600 + i * 90}ms both`,
              }}>{w}</span>
            </span>
          ))}
        </h1>

        <div className="hero-foot">
          <span className="mono">Founding engineer &amp; AI systems</span>
          <span className="mono">Retsguide &mdash; Copenhagen</span>
          <span className="mono" style={{ marginLeft: 'auto' }}>Scroll &darr;</span>
        </div>
      </header>

      <Marquee items={BAND} />

      {/* ─── Work ─────────────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="work-h">
        <Reveal as="header" className="sec-head">
          <h2 id="work-h">Selected work</h2>
          <Link className="mono" to="/work">Index &rarr;</Link>
        </Reveal>

        <ul className="work" onPointerLeave={() => setPeek(null)}>
          {PROJECTS.map((p, i) => {
            const href = p.featured ? `/work/${p.slug}` : (p.live || p.github || '#');
            const external = !p.featured;
            const Row = (
              <>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="ttl">{p.title}</span>
                <span className="yr">{p.year}</span>
              </>
            );
            const on = () => p.shot && setPeek({ src: p.shot, alt: p.title });
            return (
              <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 40}>
                {external ? (
                  <a className="work-row" href={href} target="_blank" rel="noopener"
                     onPointerEnter={on}>{Row}</a>
                ) : (
                  <Link className="work-row" to={href} onPointerEnter={on}>{Row}</Link>
                )}
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ─── Statement ────────────────────────────────────────────────── */}
      <Reveal as="section" className="statement">
        <p>The model extracts. <em>The code decides.</em></p>
        <p className="sub">
          A language model is very good at reading a document and very bad at
          being accountable for what it concluded, so I use it for the first job
          and never the second. At Retsguide that means the legal knowledge graph
          behind our reports has no model writing into it, and every claim traces
          back to the provision it rests on. Before that: real-time systems at a
          San Francisco startup, and five patches merged into KDE Plasma, now
          shipping to millions of desktops.
        </p>
      </Reveal>

      {/* ─── Plates ───────────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="ph-h" style={{ paddingInline: 0 }}>
        <Reveal as="header" className="sec-head" >
          <h2 id="ph-h">Plates</h2>
          <Link className="mono" to="/photography">All {PHOTOS.length} &rarr;</Link>
        </Reveal>
      </section>
      <Reveal>
        <ul className="plates">
          {PHOTOS.slice(0, 12).map((ph) => (
            <li key={ph.slug}>
              <img src={`/photos/${ph.slug}-800.webp`} alt={ph.alt}
                   width={ph.width} height={ph.height} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      </Reveal>

      {/* ─── Contact ──────────────────────────────────────────────────── */}
      <section className="contact" aria-labelledby="c-h">
        <h2 id="c-h" className="sr-only">Contact</h2>
        <Reveal>
          <a className="contact-cta" href={`mailto:${SITE.email}`}>
            Let&rsquo;s<br />talk &rarr;
          </a>
        </Reveal>
        <Reveal delay={80}>
          <nav className="contact-links mono" aria-label="Elsewhere">
            <a href={`mailto:${SITE.email}`}>Email</a>
            <a href={SITE.profiles.github} target="_blank" rel="me noopener">GitHub</a>
            <a href={SITE.profiles.linkedin} target="_blank" rel="me noopener">LinkedIn</a>
            <a href={SITE.profiles.kde} target="_blank" rel="noopener">KDE</a>
            <a href={SITE.resume}>Résumé</a>
            <a href={SITE.calendar} target="_blank" rel="noopener">Book a call</a>
          </nav>
        </Reveal>
        <Reveal delay={140}>
          <p className="colophon mono">
            Set in Bricolage Grotesque. Built with React and far too much
            iteration. &copy; {new Date().getFullYear()} {SITE.handle} &mdash; #025
          </p>
        </Reveal>
      </section>
    </>
  );
}
