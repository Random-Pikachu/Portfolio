import { Cover } from '../sections/Cover';
import { About } from '../sections/About';
import { Experience } from '../sections/Experience';
import { Details } from '../sections/Details';
import { Contact } from '../sections/Contact';
import { Sheet } from '../sheet/Sheet';
import { COVER, SECTIONS } from '../data/site';

const [ABOUT, EXPERIENCE, PROJECTS, CONTACT] = SECTIONS;

/**
 * The home page: five charts, frontispiece first. Each Sheet owns its id, rule,
 * head row and registration with the scroll layer; the section components
 * own only their content.
 */
export default function SinglePage() {
  return (
    <main id="main" className="min-h-screen">
      <Sheet id={COVER.id} num={COVER.num} block={COVER.block} heading={COVER.heading} caption={COVER.caption} headless>
        <Cover />
      </Sheet>
      <Sheet id={ABOUT.id} num={ABOUT.num} block={ABOUT.block} heading={ABOUT.heading} caption={ABOUT.caption}>
        <About />
      </Sheet>
      <Sheet id={EXPERIENCE.id} num={EXPERIENCE.num} block={EXPERIENCE.block} heading={EXPERIENCE.heading} caption={EXPERIENCE.caption}>
        <Experience />
      </Sheet>
      <Sheet id={PROJECTS.id} num={PROJECTS.num} block={PROJECTS.block} heading={PROJECTS.heading} caption={PROJECTS.caption}>
        <Details />
      </Sheet>
      <Sheet id={CONTACT.id} num={CONTACT.num} block={CONTACT.block} heading={CONTACT.heading} caption={CONTACT.caption}>
        <Contact />
      </Sheet>
    </main>
  );
}
