import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Experience } from '../sections/Experience';
import { Work } from '../sections/Work';
import { Contact } from '../sections/Contact';
import { Footer } from '../sections/Footer';
import { SheetRule } from '../sheet/SheetRule';

/**
 * The home page, top to bottom. Each section owns its markup and motion; the
 * shared grid, type scale and tokens live in index.css.
 */
export default function SinglePage() {
  return (
    <main id="main" className="min-h-screen text-text-base">
      <Hero />
      <div className="sheet"><SheetRule /></div>
      <About />
      <div className="sheet"><SheetRule /></div>
      <Experience />
      <div className="sheet"><SheetRule /></div>
      <Work />
      <div className="sheet"><SheetRule /></div>
      <Contact />
      <Footer />
    </main>
  );
}
