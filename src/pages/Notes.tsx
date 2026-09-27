import { NOTES } from '../data/content.generated';
import { PageHead } from '../shell/PageHead';

const fmt = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

/**
 * /blog, the index of notes: one ruled row per note, grouped by year, newest
 * first. The route is built only once a real note exists (scripts/prerender.mjs),
 * so there is no empty state to show.
 */
export function Notes() {
  const years = [...new Set(NOTES.map((n) => n.date.slice(0, 4)))];
  return (
    <main id="main" className="min-h-screen">
      <PageHead label="Blog" title="Notes" caption={`${NOTES.length} ${NOTES.length === 1 ? 'note' : 'notes'}`} />
      <div className="frame notes">
        {years.map((year) => (
          <section key={year} className="notes__year" aria-label={year}>
            <h2 className="t-label notes__year-title">{year}</h2>
            <ol className="notes__list">
              {NOTES.filter((n) => n.date.startsWith(year)).map((n) => (
                <li key={n.slug} className="notes__row">
                  <span className="t-label notes__no">No. {n.number}</span>
                  <a href={`/blog/${n.slug}`} className="notes__title t-h3">
                    {n.title}
                  </a>
                  <p className="t-body notes__summary">{n.summary}</p>
                  <span className="t-label notes__meta">
                    {fmt(n.date)} · {n.minutes} min
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
