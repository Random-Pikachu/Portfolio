import Photography from './pages/Photography';
import { Shell } from './shell/Shell';

/**
 * Tree for /photography. Shared by src/photography.tsx (browser) and
 * src/entry-server.tsx (prerender) so the static HTML and the hydrated app match.
 */
export default function PhotographyApp() {
  return (
    <Shell kind="page" current="/photography">
      <Photography />
    </Shell>
  );
}
