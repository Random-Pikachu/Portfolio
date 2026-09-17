import { NOTES } from '../data/content.generated';
import { Sheet } from '../sheet/Sheet';

const fmt = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

/**
 * /blog, the index of notes. One ruled row per note, grouped by year, newest
 * first. When nothing is issued yet, it says so.
 */
export function Notes() {
  const years = [...new Set(NOTES.map((n) => n.date.slice(0, 4)))];
  return (
    <main id="main" className="min-h-screen">
      <Sheet id="notes" num="N" block="Notes" heading="Notes by Sangam Pratap Singh" caption={`${NOTES.length} ${NOTES.length === 1 ? 'note' : 'notes'}`}>
        <div className="sheet notes">
          {NOTES.length === 0 ? (
            <p className="t-body notes__empty">No notes issued yet.</p>
          ) : (
            years.map((year) => (
              <section key={year} className="notes__year" aria-label={year}>
                <h3 className="t-label notes__year-title">{year}</h3>
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
            ))
          )}
        </div>
      </Sheet>
    </main>
  );
}
