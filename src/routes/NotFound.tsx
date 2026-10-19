import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="sec" aria-labelledby="nf">
      <div className="wrap">
        <p className="tag">404</p>
        <h1 className="display" id="nf" style={{ marginTop: 20, maxWidth: '12ch' }}>
          Nothing at this address.
        </h1>
        <p className="lead" style={{ marginTop: 24 }}>
          The link is either old or mistyped. Everything that does exist is one
          of these two.
        </p>
        <div className="hero-cta">
          <Link className="btn" to="/">Home <span className="arr" aria-hidden="true">→</span></Link>
          <Link className="btn btn--ghost" to="/work">The index</Link>
        </div>
      </div>
    </section>
  );
}
