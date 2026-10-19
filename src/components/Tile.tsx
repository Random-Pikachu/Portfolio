import { Link } from 'react-router-dom';
import Plate from './Plate';
import { DRAWN, type Project } from '../data/work';

/**
 * One project, as a framed plate with corner marks, an index and year on the
 * rule above it, and the title underneath.
 *
 * A project with no screenshot and no diagram gets its name set large in the
 * frame instead. Two of these have no interface to photograph and two are web
 * apps whose screens are not mine to re-shoot from here; a placeholder image
 * would say less than the name does.
 */
export default function Tile({ p, n }: { p: Project; n: number }) {
  const to = p.featured ? `/work/${p.slug}` : (p.live || p.github || '/work');
  const label = p.featured ? 'Case study' : p.live ? 'Visit' : 'Source';

  const inner = (
    <>
      <div className="tile-top">
        <span>{String(n).padStart(2, '0')}</span>
        <span>{p.year}</span>
      </div>

      <div className="tile-media brk">
        {p.shot
          ? <img src={p.shot} alt="" loading="lazy" width="700" height="440" decoding="async" />
          : DRAWN.has(p.slug)
            ? <Plate slug={p.slug} />
            : <span className="tile-plate">{p.title}</span>}
      </div>

      <div className="tile-body">
        <span className="tile-ttl">
          <h3 className="h3">{p.title}</h3>
          <span className="tile-blurb">{p.blurb}</span>
          <span className="tile-stack">{p.stack.slice(0, 4).join(' · ')}</span>
        </span>
        <span className="tile-go">
          {label} <span className="arr" aria-hidden="true">→</span>
        </span>
      </div>
    </>
  );

  return p.featured
    ? <Link className="tile" to={to}>{inner}</Link>
    : <a className="tile" href={to} target="_blank" rel="noopener">{inner}</a>;
}
