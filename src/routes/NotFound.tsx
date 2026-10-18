import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="intro">
      <h1>404</h1>
      <p className="role">That page doesn&apos;t exist.</p>
      <div className="prose">
        <p>
          Try <Link to="/">the start</Link> or <Link to="/work">the work</Link>.
        </p>
      </div>
    </section>
  );
}
