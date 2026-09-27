import { NOTES } from '../data/content.generated';
import { PageHead } from '../shell/PageHead';
import { Outline } from './Outline';

const fmt = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

/**
 * /blog/<slug>. Three columns on the ten: every note by year on the left,
 * the article in the middle, the outline on the right. The body is HTML
 * compiled at build from Markdown.
 */
export function Note({ slug }: { slug: string }) {
  const i = NOTES.findIndex((n) => n.slug === slug);
  const note = NOTES[i];
  if (!note) return <Missing />;
  const newer = NOTES[i - 1];
  const older = NOTES[i + 1];
  const years = [...new Set(NOTES.map((n) => n.date.slice(0, 4)))];

  return (
    <main id="main" className="min-h-screen">
      <PageHead label={`Blog · ${fmt(note.date)} · ${note.minutes} min`} />
      <div className="frame note">
        <div className="grid note__grid">
          <nav className="note__side" aria-label="All notes">
            {years.map((year) => (
              <div key={year} className="note__side-year">
                <p className="t-label note__side-title">{year}</p>
                <ol className="note__side-list">
                  {NOTES.filter((n) => n.date.startsWith(year)).map((n) => (
                    <li key={n.slug} className={n.slug === note.slug ? 'is-active' : undefined}>
                      <a href={`/blog/${n.slug}`} className="t-small" aria-current={n.slug === note.slug ? 'page' : undefined}>
                        <span className="note__side-no">{n.number}</span> {n.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </nav>

          <article className="note__article" id="note-article" aria-labelledby="note-title">
            <h1 id="note-title" className="t-title note__title">
              {note.title}
            </h1>
            {note.summary ? <p className="t-body note__summary">{note.summary}</p> : null}
            <div className="prose" dangerouslySetInnerHTML={{ __html: note.html }} />
            <nav className="note__pager t-small" aria-label="Other notes">
              {older ? (
                <a href={`/blog/${older.slug}`} className="note__pager-link">
                  <span className="t-label">← Older · No. {older.number}</span>
                  <span>{older.title}</span>
                </a>
              ) : (
                <span />
              )}
              {newer ? (
                <a href={`/blog/${newer.slug}`} className="note__pager-link note__pager-link--next">
                  <span className="t-label">Newer · No. {newer.number} →</span>
                  <span>{newer.title}</span>
                </a>
              ) : null}
            </nav>
          </article>

          <div className="note__outline">
            <Outline headings={note.headings} articleId="note-article" />
          </div>
        </div>
      </div>
    </main>
  );
}

function Missing() {
  return (
    <main id="main" className="min-h-screen">
      <PageHead label="Blog" title="This note does not exist." />
    </main>
  );
}
