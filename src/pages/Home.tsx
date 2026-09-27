import { Hero } from '../sections/Hero';
import { Work } from '../sections/Work';
import { Logbook } from '../sections/Logbook';
import { About } from '../sections/About';
import { AfterHours } from '../sections/AfterHours';
import { Contact } from '../sections/Contact';
import { CallBar } from '../sections/CallBar';

/**
 * The home page, in the order a founder reads it: the one-liner and the
 * proof, the work and its stories, the logbook, the person, a door or two
 * to warm up behind, then the call.
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Work />
      <Logbook />
      <About />
      <AfterHours />
      <Contact />
      <CallBar />
    </main>
  );
}
