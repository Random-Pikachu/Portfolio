import { Notes } from './pages/Notes';
import { Note } from './pages/Note';
import { noteSlug } from './pages/paths';
import { Shell } from './shell/Shell';

/**
 * Tree for /blog and /blog/<slug>. Shared by src/blog.tsx (browser) and
 * src/entry-server.tsx (prerender), keyed by the path so both agree.
 */
export default function BlogApp({ path }: { path: string }) {
  const slug = noteSlug(path);
  return (
    <Shell kind="page" current={slug ? `/blog/${slug}` : '/blog'}>
      {slug ? <Note slug={slug} /> : <Notes />}
    </Shell>
  );
}
