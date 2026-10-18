import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-head">
      <h1 className="h1">Nothing printed here.</h1>
      <p className="lede">
        That page does not exist. <Link to="/">Back to the start</Link>, or have a
        look at <Link to="/work">the work</Link>.
      </p>
    </section>
  );
}
