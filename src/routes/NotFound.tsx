import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="contact">
      <h1 className="contact-cta">404</h1>
      <p className="colophon mono">
        Nothing here. <Link to="/">Back to the start</Link> or{' '}
        <Link to="/work">the index</Link>.
      </p>
    </section>
  );
}
