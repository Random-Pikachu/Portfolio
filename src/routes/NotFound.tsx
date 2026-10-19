import { Link } from 'react-router-dom';
import { Arrow } from '../components/Icon';

export default function NotFound() {
  return (
    <section className="room grid" aria-labelledby="nf-h">
      <div style={{ gridColumn: '1 / -1' }}>
        <p className="mono">404</p>
        <h1 className="h1" id="nf-h" style={{ marginTop: 'var(--s-3)', maxWidth: '12em' }}>
          Nothing at this address.
        </h1>
        <p className="lead" style={{ marginTop: 'var(--s-3)' }}>
          The link is either old or mistyped.
        </p>
        <p style={{ marginTop: 'var(--s-4)', display: 'flex', gap: 'var(--s-4)', flexWrap: 'wrap' }}>
          <Link className="act" to="/">Home <Arrow /></Link>
          <Link className="act" to="/work">The work <Arrow /></Link>
        </p>
      </div>
    </section>
  );
}
