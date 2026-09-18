import { useEffect, useState } from 'react';
import { EXPERIENCES } from '../data/site';

/** The axis starts with the first role; it ends at now, which is the right edge. */
const T0 = Date.UTC(2025, 6, 1);
/** The server and the first client render agree on this; the effect brings in today. */
const FALLBACK_NOW = Date.UTC(2026, 8, 17);
const MONTH = 30.44 * 86400000;

const parse = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return Date.UTC(y, m - 1, 1);
};
const endOf = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return Date.UTC(y, m, 0);
};
const FEATURED_AT = Date.UTC(2026, 1, 7);

/**
 * Sheet 02, Schedule. Each role is a dimension on a time axis: it starts,
 * it is measured in months, it ends with a tick. The current role has no
 * end tick; its line leaves the sheet through the right margin with an
 * arrowhead. Choosing a row shows that role below. The KDE feature is the
 * one accent mark on the chart and a real link.
 */
export function Experience() {
  const [selected, setSelected] = useState(0);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNow(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);
  const end = now ?? FALLBACK_NOW;
  const x = (t: number) => `${(Math.min(Math.max(t, T0), end) - T0) / (end - T0) * 100}%`;

  const months: { t: number; label: string }[] = [];
  for (let t = new Date(T0); t.getTime() < end; t.setUTCMonth(t.getUTCMonth() + 3)) {
    months.push({ t: t.getTime(), label: t.toLocaleString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' }).replace(' ', ' ’') });
  }
  const current = EXPERIENCES[selected];

  return (
    <div className="sheet schedule">
      <div className="schedule__axis" aria-hidden="true">
        {months.map((m) => (
          <span key={m.t} className="schedule__month t-label" style={{ left: x(m.t) }}>
            {m.label}
          </span>
        ))}
        <span className="schedule__now t-label">now</span>
      </div>

      <ol className="schedule__rows" aria-label="Roles">
        {EXPERIENCES.map((e, i) => {
          const start = parse(e.startDate);
          const finish = e.endDate ? endOf(e.endDate) : null;
          const open = finish === null;
          const monthsLong = Math.round(((finish ?? end) - start) / MONTH);
          const featured = e.points.find((p) => p.featured);
          return (
            <li key={e.company} className={`schedule__row ${i === selected ? 'is-selected' : ''}`}>
              <button type="button" className="schedule__pick" aria-pressed={i === selected} onClick={() => setSelected(i)}>
                <span className="t-data schedule__company">{e.company}</span>
                <span className="t-label schedule__period">{e.period}</span>
              </button>
              <div className="schedule__track">
                <span
                  className={`dim schedule__bar ${open ? 'dim--open' : ''}`}
                  style={{ left: x(start), width: open ? `calc(100% - ${x(start)} + var(--margin-r))` : `calc(${x(finish!)} - ${x(start)})` }}
                  role="img"
                  aria-label={open ? `${e.company}, ${monthsLong} months so far, present` : `${e.company}, ${monthsLong} months`}
                >
                  <span className="dim__line" aria-hidden="true" />
                  <span className="dim__tick dim__tick--a" aria-hidden="true" />
                  {open ? <span className="dim__arrow" aria-hidden="true" /> : <span className="dim__tick dim__tick--b" aria-hidden="true" />}
                  <span className="dim__label t-label" aria-hidden="true">
                    {open ? 'present' : `${monthsLong} mo`}
                  </span>
                </span>
                {featured && featured.href ? (
                  <a
                    href={featured.href}
                    target="_blank"
                    rel="noopener"
                    className="schedule__feat"
                    style={{ left: x(FEATURED_AT) }}
                    aria-label={`${featured.label}: ${featured.text}`}
                  >
                    <span className="schedule__feat-mark" aria-hidden="true" />
                    <span className="t-label schedule__feat-label" aria-hidden="true">
                      {featured.label} ↗
                    </span>
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div key={selected} className="schedule__detail grid-8">
        <div className="schedule__detail-head">
          <p className="t-label schedule__detail-period">
            <b>{current.company}</b> · {current.period}
            {!current.endDate ? ' · still rising' : null}
          </p>
          <h3 className="t-display-2 schedule__detail-role">
            {current.companyUrl ? (
              <a href={current.companyUrl} target="_blank" rel="noopener" className="underline-draw">
                {current.role}
              </a>
            ) : (
              current.role
            )}
            <span className="sr-only"> at {current.company}</span>
          </h3>
          <p className="t-label schedule__detail-stack">{current.stack.join(' · ')}</p>
        </div>
        <ul className="schedule__points">
          {current.points.map((pt, j) => (
            <li key={j} className="t-body">
              {pt.href && pt.label ? (
                <>
                  <a href={pt.href} target="_blank" rel="noopener" className="underline-draw schedule__mr">
                    {pt.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                  {' — '}
                  {pt.text}
                </>
              ) : (
                pt.text
              )}
              {pt.featured ? <span className="t-label schedule__featured-tag">featured</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
