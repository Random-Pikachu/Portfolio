import Navigation from './components/Navigation';
import SmoothScroll from './components/SmoothScroll';
import { PLATES } from './data/site';
import { Detail } from './pages/Detail';
import { workSlug } from './pages/paths';
import { GridLayer } from './sheet/GridLayer';
import { Rail } from './sheet/Rail';
import { TitleBlock } from './sheet/TitleBlock';
import { TileIndex } from './sheet/TileIndex';

/** Tree for /work/<slug>. Shared by src/work.tsx and the prerender. */
export default function WorkApp({ path }: { path: string }) {
  const slug = workSlug(path);
  const i = PLATES.findIndex((p) => p.slug === slug);
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
      <Detail slug={slug} />
      <TitleBlock page={{ sheet: i >= 0 ? `Detail ${i + 1}/${PLATES.length}` : 'Detail', block: 'Details' }} />
      <TileIndex variant="sub" />
    </SmoothScroll>
  );
}
