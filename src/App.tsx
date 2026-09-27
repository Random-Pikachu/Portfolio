import Navigation from './components/Navigation';
import SinglePage from './pages/SinglePage';
import SmoothScroll from './components/SmoothScroll';
import { GridLayer } from './sheet/GridLayer';
import { SkyLayer } from './sky/SkyLayer';
import { Rail } from './sheet/Rail';
import { TitleBlock } from './sheet/TitleBlock';
import { TileIndex } from './sheet/TileIndex';

/**
 * The whole app tree. Shared by the browser entry (src/main.tsx) and the
 * prerender entry (src/entry-server.tsx) so the static HTML and the hydrated
 * app are guaranteed to match.
 */
export default function App() {
  return (
    <SmoothScroll>
      <SkyLayer />
      <GridLayer />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:text-accent focus:border focus:border-accent focus:px-4 focus:py-2 mono text-sm"
      >
        Skip to content
      </a>
      <Navigation />
      <Rail />
      <SinglePage />
      <TitleBlock />
      <TileIndex />
    </SmoothScroll>
  );
}
