import { Link } from 'react-router-dom';
import { Note, NoteProvider } from '../components/Note';
import Figure from '../components/Figure';
import AblationPlot from '../components/AblationPlot';
import { PROJECTS } from '../data/work';
import { SITE } from '../data/site';
import { PHOTOS } from '../data/photos';

/**
 * The document. Not a set of sections on a page — one paper, read top to
 * bottom, with its apparatus in the margin.
 */
export default function Home() {
  return (
    <NoteProvider>
      <section className="abstract" aria-label="Abstract">
        <h2 className="sec-label"><i>—</i>Abstract</h2>
        <p data-line-probe>
          I build AI systems that can be checked. A language model is very good at
          reading a document and very bad at being accountable for what it
          concluded, so I use it for the first job and never the second. Founding
          engineer at Retsguide in Copenhagen, where I built the product end to end
          and am now building its legal brain.
        </p>
      </section>

      {/* ─── 1 ────────────────────────────────────────────────────────── */}
      <section id="s1" aria-labelledby="s1-h">
        <h2 className="sec-label" id="s1-h"><i>1</i>Position</h2>
        <p className="lead">The model extracts. The code decides.</p>
        <p>
          Anything a model decides on its own, you cannot defend to a customer, a
          regulator, or yourself at two in the morning. So the model does the part
          it is genuinely good at — reading, extracting, ranking — and the decision
          lives in code that can be read, tested and pointed at.
          <Note source="ai-review.yml:36">
            Eight free models are tried in order before a paid token is spent; the
            chain is the policy, written down, not a prompt asking nicely.
          </Note>
        </p>
        <p>
          It is a boring principle. It is also most of the job, and it is the
          difference between a demo and something a company can put its name on.
        </p>
      </section>

      {/* ─── 2 ────────────────────────────────────────────────────────── */}
      <section id="s2" aria-labelledby="s2-h">
        <h2 className="sec-label" id="s2-h"><i>2</i>Systems</h2>
        <p className="lead">Retsguide · Copenhagen · Jun 2026 — present</p>
        <p>
          Founding engineer. I designed and shipped three customer-facing flows end
          to end, from research and schema design through to production.
        </p>

        <h3 className="sub"><i>2.1</i>The legal brain</h3>
        <p>
          A knowledge graph of Danish rental law sits behind the reports, and no
          model writes into it. That constraint is the product: every claim in a
          report traces back to the provision version it rests on, so a disputed
          sentence can be answered with a citation rather than an apology.
          <Note>
            Architecture and evaluation figures are not published while the product
            is pre-launch. The principle is the publishable part.
          </Note>
        </p>

        <h3 className="sub"><i>2.2</i>Eligibility, decided in code</h3>
        <p>
          Document Intelligence reads an uploaded tax or insurance PDF, a model
          classifies it and pulls out the income, and then code applies the
          tax-authority formula and returns the decision. The model never reaches
          the arithmetic.
        </p>

        <h3 className="sub"><i>2.3</i>A reviewer that refuses to pay</h3>
        <p>
          I replaced paid PR review tooling across four repositories with a GitHub
          Action that runs on a <code>/review</code> comment. It falls through
          eight free models before it will touch a paid one, is gated to repo
          members so a stranger cannot spend the budget from a drive-by comment,
          and is pinned to a commit SHA because an action that reads your diff and
          holds your provider keys is not somewhere to accept a moving tag.
          <Note source="github.com/Random-Pikachu/Portfolio">
            Running in this repository. The workflow is public — read it.
          </Note>
        </p>
        <p className="refs">
          <Link to="/work/review-agent">2.3 — full case study &rarr;</Link>
        </p>
      </section>

      {/* ─── 3 ────────────────────────────────────────────────────────── */}
      <section id="s3" aria-labelledby="s3-h">
        <h2 className="sec-label" id="s3-h"><i>3</i>Research</h2>
        <p className="lead">A hybrid CNN-Transformer for building load forecasting</p>
        <p>
          Forecasting a building&rsquo;s electricity demand is two problems wearing
          one coat: a short local pattern, and the long daily and weekly rhythm of
          a working building. A convolutional model reads the first and loses the
          second; a plain Transformer smears the first. Most published hybrids
          claim to fix this and then compare against baselines trained under
          different budgets, which proves nothing.
        </p>
        <p>
          A multi-scale convolutional front end reads local structure, an FFT
          branch supplies the periodicity directly rather than asking attention to
          rediscover it, and cross-attention fuses the two before the encoder
          predicts. The ablation holds data, loss, optimiser, schedule and seed
          fixed and removes only the front end.
          <Note source="CU-BEMS, 11,486 hourly readings">
            Seven-storey office building. Eighteen lookback and horizon settings,
            reported in full rather than at the flattering one.
          </Note>
        </p>

        <Figure n={1} caption="Test R² by forecast horizon. The hybrid holds above 0.88 everywhere; the plain Transformer falls to 0.83 as the horizon lengthens. Same data, same training budget.">
          <AblationPlot />
        </Figure>

        <p className="refs">
          <Link to="/work/load-forecasting">3 — full case study &rarr;</Link>
        </p>
      </section>

      {/* ─── 4 ────────────────────────────────────────────────────────── */}
      <section id="s4" aria-labelledby="s4-h">
        <h2 className="sec-label" id="s4-h"><i>4</i>Open source</h2>
        <p className="lead">KDE Plasma · Dec 2025 — May 2026</p>
        <p>
          Five merge requests across three projects, each reviewed by a maintainer
          before landing, now shipping to millions of desktops. Content-hash
          caching for the wallpaper gallery, picker state that persists so nobody
          re-browses to the same directory every launch, keyboard accessibility in
          the digital clock, a todo-inheritance fix in Marknote and spacebar pan in
          Drawy.
          <Note source="This Week in Plasma, Feb 2026">
            The wallpaper work was written up in KDE&rsquo;s weekly blog.
          </Note>
        </p>
      </section>

      {/* ─── 5 ────────────────────────────────────────────────────────── */}
      <section id="s5" aria-labelledby="s5-h">
        <h2 className="sec-label" id="s5-h"><i>5</i>Artifacts</h2>
        <ol className="artifacts">
          {PROJECTS.map((p, i) => (
            <li key={p.slug}>
              <span className="art-n">5.{i + 1}</span>
              <span className="art-body">
                <span className="art-title">
                  {p.featured ? <Link to={`/work/${p.slug}`}>{p.title}</Link> : p.title}
                </span>
                <span className="art-desc">{p.blurb}</span>
                <span className="art-stack">{p.stack.join(' · ')}</span>
                <span className="art-links">
                  {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                  {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
                </span>
              </span>
              <span className="art-year">{p.year}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── 6 ────────────────────────────────────────────────────────── */}
      <section id="s6" aria-labelledby="s6-h">
        <h2 className="sec-label" id="s6-h"><i>6</i>Plates</h2>
        <p>
          Photographs, all of them on a Nothing Phone&nbsp;(1), mostly the hour
          before the light goes. <Link to="/photography">The full set &rarr;</Link>
        </p>
        <ul className="plates">
          {PHOTOS.slice(0, 6).map((ph, i) => (
            <li key={ph.slug}>
              <img src={`/photos/${ph.slug}-400.webp`} alt={ph.alt}
                   width={ph.width} height={ph.height} loading="lazy" decoding="async" />
              <span className="plate-n">Pl. {i + 1}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── References ───────────────────────────────────────────────── */}
      <section id="refs" aria-labelledby="refs-h">
        <h2 className="sec-label" id="refs-h"><i>—</i>References</h2>
        <ol className="reflist">
          <li><span>Email</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li><span>GitHub</span><a href={SITE.profiles.github} target="_blank" rel="me noopener">github.com/Random-Pikachu</a></li>
          <li><span>LinkedIn</span><a href={SITE.profiles.linkedin} target="_blank" rel="me noopener">linkedin.com/in/sangam21</a></li>
          <li><span>KDE</span><a href={SITE.profiles.kde} target="_blank" rel="noopener">invent.kde.org/randompikachu</a></li>
          <li><span>Résumé</span><a href={SITE.resume}>resume.pdf</a></li>
          <li><span>Calendar</span><a href={SITE.calendar} target="_blank" rel="noopener">15 minutes, any time</a></li>
        </ol>
        <p className="colophon">
          Set in Source Serif&nbsp;4 and JetBrains Mono. Figure&nbsp;1 is drawn from
          the thesis data, not a screenshot. Line numbers are real — link one.
          {' '}&copy; {new Date().getFullYear()} {SITE.handle.toLowerCase()} · entry #025
        </p>
      </section>
    </NoteProvider>
  );
}
