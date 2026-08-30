import Navigation from './components/Navigation';
import SinglePage from './pages/SinglePage';
import SmoothScroll from './components/SmoothScroll';

/**
 * The whole app tree. Shared by the browser entry (src/main.tsx) and the
 * prerender entry (src/entry-server.tsx) so the static HTML and the hydrated
 * app are guaranteed to match.
 */
export default function App() {
  return (
    <SmoothScroll>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-bg-base focus:text-accent focus:border focus:border-accent focus:px-4 focus:py-2 mono text-sm"
      >
        Skip to content
      </a>
      <Navigation />
      <SinglePage />
    </SmoothScroll>
  );
}
