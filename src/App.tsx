import Home from './pages/Home';
import { Shell } from './shell/Shell';

/**
 * The whole home tree. Shared by the browser entry (src/main.tsx) and the
 * prerender entry (src/entry-server.tsx) so the static HTML and the hydrated
 * app are guaranteed to match.
 */
export default function App() {
  return (
    <Shell kind="home">
      <Home />
    </Shell>
  );
}
