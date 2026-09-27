import { SITE } from '../data/site';
import { Nightscape } from '../night/Nightscape';

/**
 * The home page. The hero stage carries the art at full height; the hero's
 * words, the work, the logbook, about and contact are built into it phase by
 * phase, each at the anchor the nav already points to.
 */
export default function Home() {
  return (
    <main id="main">
      <section id="top" className="stage" data-hero aria-labelledby="top-title">
        <Nightscape id="hero" className="stage__art" />
        <h1 id="top-title" className="sr-only">
          {SITE.name}, {SITE.jobTitle}
        </h1>
      </section>
    </main>
  );
}
