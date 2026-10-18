import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h2 className="sec-label"><i>—</i>404</h2>
      <h1 className="page-title" data-line-probe>No such section</h1>
      <p>
        That page isn&apos;t in this document. Try <Link to="/">the start</Link> or{' '}
        <Link to="/work">the artifacts</Link>.
      </p>
    </section>
  );
}
