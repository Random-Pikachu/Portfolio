import { Hero } from '../sections/Hero';
import { Work } from '../sections/Work';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { CallBar } from '../sections/CallBar';

/**
 * The home page, in the order a founder reads it: the one-liner and the
 * proof, the work, the person, the call. The logbook joins between the work
 * and the person in its own phase, at the anchor the nav already points to.
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Work />
      <About />
      <Contact />
      <CallBar />
    </main>
  );
}
