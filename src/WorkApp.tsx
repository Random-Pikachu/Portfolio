import { Detail } from './pages/Detail';
import { workSlug } from './pages/paths';
import { Shell } from './shell/Shell';

/** Tree for /work/<slug>. Shared by src/work.tsx and the prerender. */
export default function WorkApp({ path }: { path: string }) {
  return (
    <Shell kind="page">
      <Detail slug={workSlug(path)} />
    </Shell>
  );
}
