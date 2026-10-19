import { Link } from 'react-router-dom';
import { Arrow } from '../components/Icon';
import Plate from '../components/Plate';
import { EXPERIENCES } from '../data/site';
import { DRAWN, PROJECTS } from '../data/work';
import { PHOTO_BY_SLUG, ROOM_SLUG, STRIP_SLUGS } from '../data/photos';

/**
 * Nine rooms. Each differs from the one above it on at least two of ground,
 * alignment, density and scale — which is the whole answer to a page that
 * previously ran the same eyebrow-rule-heading-content bar five times.
 */

const PROOF = [
  { v: '150', suffix: 'ms', from: 2000, l: 'Down from 2s+, on the Retsguide SSR path' },
  { v: '5', l: 'Patches merged into KDE Plasma' },
  { v: '8 deep', l: 'Free models tried before a paid token' },
  { v: '15 of 18', l: 'Settings where the hybrid beat a plain Transformer' },
];

const [LEAD, TILE_A, TILE_B, ...REST] = PROJECTS;

export default function Home() {
  const room = PHOTO_BY_SLUG[ROOM_SLUG];
  const strip = STRIP_SLUGS.map((s) => PHOTO_BY_SLUG[s]).filter(Boolean);

  return (
    <>
      {/* ── R1 Hero ─────────────────────────────────────────────────── */}
      <section className="room hero grid" id="who" aria-labelledby="hero-h">
        <p className="mono hero-eyebrow">Founding engineer · Retsguide, Copenhagen</p>
        <h1 className="display" id="hero-h">
          <span className="w"><span className="g">The model</span></span>
          <span className="w"><span className="g">extracts.</span></span>
          <span className="w"><span className="g">The code</span></span>
          <span className="w"><span className="g">decides.</span></span>
        </h1>
        <p className="sub">
          I’m the founding engineer at Retsguide in Copenhagen. I’ve shipped
          three customer-facing flows end to end, and I build the legal
          knowledge graph the reports rest on.{' '}
          <span className="sub-rest">No model writes to it.</span>
        </p>
        <p className="hero-act">
          <Link className="act" to="/work">See the work <Arrow /></Link>
        </p>
      </section>

      {/* ── R2 Proof — full bleed #1 ────────────────────────────────── */}
      <section className="proof bleed" id="proof" aria-label="Measured results">
        <div className="grid proof-grid">
          {PROOF.map((p) => (
            <div className="proof-cell" key={p.l} data-rv="text">
              <span
                className="proof-v"
                {...(p.from ? { 'data-count': p.v, 'data-count-from': String(p.from), 'data-count-suffix': p.suffix } : {})}
              >
                {p.from ? `${p.v}${p.suffix}` : p.v}
              </span>
              <span className="proof-l">{p.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── R3 Experience — the dense room ──────────────────────────── */}
      <section className="grid" id="exp" data-sun="noon"
               style={{ paddingBlock: 'var(--s-6) var(--s-5)' }} aria-labelledby="exp-h">
        <header className="room-head">
          <div className="room-head-row">
            <span className="fine">Experience</span>
            <span className="fine">2025 — now</span>
          </div>
          <h2 className="h2" id="exp-h" data-rv="head">
            <span className="w"><span className="g">Three places, each one</span></span>
            <span className="w"><span className="g">end to end.</span></span>
          </h2>
        </header>

        <ul className="jobs grid" style={{ gridTemplateColumns: 'subgrid' }}>
          {EXPERIENCES.map((job) => (
            <li className="job" key={job.company} data-rv="row">
              <div className="job-rail">
                <p className="job-when">{job.period}</p>
                <a className="h3 job-co lnk" href={job.companyUrl} target="_blank"
                   rel="noopener" style={{ color: 'var(--fg)' }}>
                  {job.company}
                </a>
                <span className="job-role">
                  {job.role}{job.location ? ` · ${job.location}` : ''}
                </span>
              </div>
              <div className="job-main">
                <p className="job-claim">{job.claim}</p>
                <ul className="job-points">
                  {job.points.map((pt) => (
                    <li key={pt.text}>
                      {pt.href
                        ? <><a className="lnk" href={pt.href} target="_blank" rel="noopener">{pt.label}</a> {pt.text}</>
                        : pt.text}
                    </li>
                  ))}
                </ul>
                <p className="fine job-stack">{job.stack.join(' · ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── R4 The lead project — full bleed #2 ─────────────────────── */}
      <Link className="lead-room bleed marks-c" to={`/work/${LEAD.slug}`} aria-label={LEAD.title}>
        <span className="mk1" aria-hidden="true" />
        <span className="mk2" aria-hidden="true" />
        <div className="lead-media" data-rv="plate">
          {DRAWN.has(LEAD.slug) ? <Plate slug={LEAD.slug} /> : null}
        </div>
        <div className="lead-over grid">
          <p className="mono">01 — {LEAD.year}</p>
          <h2 className="h1">{LEAD.title}</h2>
          <p className="lead">{LEAD.blurb}</p>
          <span className="act">Read the case study <Arrow /></span>
        </div>
      </Link>

      {/* ── R5 The other projects ───────────────────────────────────── */}
      <section className="grid" id="work"
               style={{ paddingBlock: 'var(--s-6) var(--s-5)' }} aria-labelledby="work-h">
        <header className="room-head">
          <div className="room-head-row">
            <span className="fine">Projects</span>
            <Link className="fine lnk" to="/work" style={{ color: 'var(--accent)' }}>
              All {PROJECTS.length} <Arrow />
            </Link>
          </div>
          <h2 className="h2" id="work-h" data-rv="head">
            <span className="w"><span className="g">The three with write-ups</span></span>
            <span className="w"><span className="g">are first.</span></span>
          </h2>
        </header>

        <ul className="tiles" style={{ gridTemplateColumns: 'subgrid' }}>
          {[TILE_A, TILE_B].map((p, i) => (
            <li className={i === 0 ? 'tile-a' : 'tile-b'} key={p.slug} data-rv="text">
              <Link className="tile" to={`/work/${p.slug}`}>
                <span className="tile-top">
                  <span className="mono">{String(i + 2).padStart(2, '0')}</span>
                  <span className="fine">{p.year}</span>
                </span>
                <span className="tile-media">
                  {p.shot
                    ? <img src={p.shot} alt="" loading="lazy" width="700" height="440" decoding="async" />
                    : <Plate slug={p.slug} />}
                </span>
                <h3 className="h3">{p.title}</h3>
                <span className="tile-blurb">{p.blurb}</span>
                <span className="fine tile-stack">{p.stack.slice(0, 4).join(' · ')}</span>
                <span className="act act--sm tile-go">Case study <Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="rows" style={{ gridTemplateColumns: 'subgrid' }}>
          {REST.map((p, i) => {
            const to = p.live || p.github || '/work';
            return (
              <li key={p.slug} data-rv="row">
                <a className="row" href={to} target="_blank" rel="noopener">
                  <span className="mono row-n">{String(i + 4).padStart(2, '0')}</span>
                  <span className="row-main">
                    <span className="h3">{p.title}</span>
                    <span className="row-blurb">{p.blurb}</span>
                  </span>
                  <span className="fine row-stack">{p.stack.slice(0, 3).join(' · ')}</span>
                  <span className="fine row-end">{p.year}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── R6 Photographs — full bleed #3, and the strip, #4 ───────── */}
      <section id="photos" aria-labelledby="photos-h" style={{ marginTop: 'var(--s-6)' }}>
        <div className="photo-room bleed">
          {room && (
            <img src={`/photos/${ROOM_SLUG}-1600.webp`} alt={room.alt}
                 width={room.width} height={room.height} loading="lazy" decoding="async" />
          )}
          <div className="photo-over grid">
            <h2 className="h2" id="photos-h">I take photos. Mostly at night, mostly on my phone.</h2>
            <p className="lead">
              All of it on a Nothing Phone (1), a lot of it on the walk back
              across campus.
            </p>
            <p><Link className="act" to="/photography">All 27 <Arrow /></Link></p>
          </div>
        </div>

        <div className="strip-wrap">
          <ul className="strip">
            {strip.map((ph) => (
              <li key={ph.slug}>
                <img src={`/photos/${ph.slug}-800.webp`} alt={ph.alt}
                     width={ph.width} height={ph.height} loading="lazy" decoding="async" draggable={false} />
              </li>
            ))}
          </ul>
          <div className="strip-meter">
            <span className="mono"><span data-strip-n>01</span> / {strip.length}</span>
            <span className="strip-bar"><span /></span>
          </div>
        </div>
      </section>
    </>
  );
}
