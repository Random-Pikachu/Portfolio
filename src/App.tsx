import { Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import Home from './routes/Home';
import Work from './routes/Work';
import CaseStudy from './routes/CaseStudy';
import Photography from './routes/Photography';
import Pitch from './routes/Pitch';
import NotFound from './routes/NotFound';

/**
 * The whole app tree. Shared by the browser entry (src/main.tsx) and the
 * prerender entry (src/entry-server.tsx) so static HTML and the hydrated app
 * are guaranteed to match.
 */
export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/for/:company" element={<Pitch />} />
        <Route path="/for/:company/:person" element={<Pitch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
