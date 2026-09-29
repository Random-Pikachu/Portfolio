import Navigation from './components/Navigation';
import SmoothScroll from './components/SmoothScroll';
import { NOTES } from './data/content.generated';
import { Notes } from './pages/Notes';
import { Note } from './pages/Note';
import { noteSlug } from './pages/paths';
import { GridLayer } from './sheet/GridLayer';
import { Rail } from './sheet/Rail';
import { TitleBlock } from './sheet/TitleBlock';
import { TileIndex } from './sheet/TileIndex';

/**
 * Tree for /blog and /blog/<slug>. Shared by src/blog.tsx (browser) and
 * src/entry-server.tsx (prerender), keyed by the path so both agree.
 */
export default function BlogApp({ path }: { path: string }) {
  const slug = noteSlug(path);
  const note = slug ? NOTES.find((n) => n.slug === slug) : undefined;
  const page = note
    ? { sheet: `Note ${note.number}`, block: 'Notes', scale: `1 : ${note.minutes} min` }
    : { sheet: 'Notes', block: `${NOTES.length} issued` };
  return (
    <SmoothScroll>
      <GridLayer />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:text-accent focus:border focus:border-accent focus:px-4 focus:py-2 mono text-sm"
      >
        Skip to content
      </a>
      <Navigation variant="sub" />
      <Rail variant="sub" />
      {slug ? <Note slug={slug} /> : <Notes />}
      <TitleBlock page={page} />
      <TileIndex variant="sub" />
    </SmoothScroll>
  );
}
