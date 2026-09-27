import { ArrowUpRight } from 'lucide-react';
import { EXPERIENCES } from '../data/site';
import { SectionHead } from './SectionHead';

/**
 * The logbook: every role as an entry in a field notebook, newest first. A
 * mono date range, the role and where, one mission line, what was owned end
 * to end, and one link out. The merge requests carry their own links, since
 * they are the evidence.
 */
export function Logbook() {
  return (
    <section id="logbook" className="section logbook" aria-labelledby="logbook-title">
      <div className="frame">
        <SectionHead id="logbook" label="Experience" title="Logbook" />
        <ol className="logbook__list">
          {EXPERIENCES.map((x) => (
            <li key={x.company} className="logbook__entry" data-reveal>
              <p className="t-label logbook__when">
                <time dateTime={x.startDate}>{x.period.split(' - ')[0]}</time>
                {' - '}
                {x.endDate ? <time dateTime={x.endDate}>{x.period.split(' - ')[1]}</time> : <span className="logbook__now">now</span>}
              </p>
              <div className="logbook__body">
                <h3 className="t-h3 logbook__role">
                  {x.role}
                  <span className="logbook__at">
                    {' '}
                    at{' '}
                    <a href={x.companyUrl} target="_blank" rel="noopener" className="link">
                      {x.company}
                    </a>
                  </span>
                </h3>
                <p className="t-lead logbook__mission">{x.mission}</p>
                <ul className="logbook__points">
                  {x.points
                    .filter((pt) => !pt.featured)
                    .map((pt) => (
                      <li key={pt.text} className="t-body">
                        {pt.href ? (
                          <>
                            <a href={pt.href} target="_blank" rel="noopener" className="t-label logbook__mr">
                              {pt.label}
                            </a>{' '}
                          </>
                        ) : null}
                        {pt.text}
                      </li>
                    ))}
                </ul>
                <p className="t-micro logbook__stack">{x.stack.join(' · ')}</p>
                <a href={x.link.href} target="_blank" rel="noopener" className="logbook__link">
                  {x.link.label}
                  <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
