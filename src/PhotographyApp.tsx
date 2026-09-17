import Navigation from './components/Navigation';
import Photography from './pages/Photography';
import SmoothScroll from './components/SmoothScroll';
import { GridLayer } from './sheet/GridLayer';

/**
 * Tree for /photography. Shared by src/photography.tsx (browser) and
 * src/entry-server.tsx (prerender) so the static HTML and the hydrated app match.
 */
export default function PhotographyApp() {
  return (
    <SmoothScroll>
      <GridLayer />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-bg-base focus:text-accent focus:border focus:border-accent focus:px-4 focus:py-2 mono text-sm"
      >
        Skip to content
      </a>
      <Navigation variant="sub" />
      <Photography />
    </SmoothScroll>
  );
}
