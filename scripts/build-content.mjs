/**
 * Reads content/ and writes src/data/content.generated.ts.
 *
 *   content/work/<slug>.md   front matter → what a plate shows (role, hardest
 *                            problem, outcomes) and whether its detail sheet
 *                            is published; body → the detail sheet's HTML.
 *   content/blog/<slug>.md   front matter → title, date, summary, draft;
 *                            body → the note's HTML.
 *
 * Markdown is compiled here, once, with unified: GitHub-flavoured Markdown,
 * heading ids, and code highlighted by Shiki with the site's own monochrome
 * theme in both modes (colours live in CSS variables, so no colour is baked
 * in). Nothing runs at request time.
 *
 * Unpublished sheets and draft notes are left out unless CONTENT_DRAFTS=1,
 * which is how the page templates are reviewed before real content exists.
 *
 * Runs first in `npm run build` and as `npm run content`. Output committed
 * so typechecking never depends on a build.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WORK_DIR = join(ROOT, 'content', 'work');
const BLOG_DIR = join(ROOT, 'content', 'blog');
const OUT = join(ROOT, 'src', 'data', 'content.generated.ts');
const DRAFTS = process.env.CONTENT_DRAFTS === '1';

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const list = (v) => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);
const dateStr = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : str(v));

/** A monochrome TextMate theme: ink weights, not hues. Colours are placeholders the CSS maps to tokens. */
const inkTheme = (name) => ({
  name,
  type: name === 'night' ? 'dark' : 'light',
  colors: { 'editor.background': '#00000000', 'editor.foreground': '#111111' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#666666', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control'], settings: { foreground: '#111111', fontStyle: 'bold' } },
    { scope: ['string', 'constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: '#444444' } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.type', 'entity.name.class', 'support.type'], settings: { foreground: '#111111' } },
    { scope: ['variable', 'variable.parameter', 'meta.object-literal.key', 'support.variable'], settings: { foreground: '#222222' } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: '#777777' } },
    { scope: ['entity.name.tag', 'entity.other.attribute-name', 'markup.heading'], settings: { foreground: '#111111', fontStyle: 'bold' } },
  ],
});

/** Collects h2/h3 for the outline; the tree already has ids from rehype-slug. */
function collectHeadings() {
  return (tree, file) => {
    const out = [];
    const walk = (node) => {
      if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
        const text = [];
        const grab = (n) => {
          if (n.type === 'text') text.push(n.value);
          (n.children ?? []).forEach(grab);
        };
        grab(node);
        out.push({ depth: node.tagName === 'h2' ? 2 : 3, id: node.properties?.id ?? '', text: text.join('').trim() });
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
    file.data.headings = out;
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeShiki, { themes: { light: inkTheme('paper'), dark: inkTheme('night') }, defaultColor: false })
  .use(collectHeadings)
  .use(rehypeStringify);

async function compile(markdown) {
  const file = await processor.process(markdown);
  const html = String(file);
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return { html, headings: file.data.headings ?? [], words };
}

const read = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.md') && (DRAFTS || !f.startsWith('_')))
        .sort()
        .map((f) => ({ slug: basename(f, '.md'), ...matter(readFileSync(join(dir, f), 'utf8')) }))
    : [];

const work = {};
for (const { slug, data, content } of read(WORK_DIR)) {
  const published = data.published === true || DRAFTS;
  const body = published ? await compile(content) : { html: '', headings: [], words: 0 };
  work[slug] = {
    published,
    role: str(data.role),
    hardest: str(data.hardest),
    outcomes: list(data.outcomes),
    html: body.html,
    headings: body.headings,
  };
}

const notes = [];
for (const { slug, data, content } of read(BLOG_DIR)) {
  if (data.draft === true && !DRAFTS) continue;
  const body = await compile(content);
  notes.push({
    slug,
    title: str(data.title) || slug,
    date: dateStr(data.date),
    summary: str(data.summary),
    draft: data.draft === true,
    minutes: Math.max(1, Math.round(body.words / 200)),
    html: body.html,
    headings: body.headings,
  });
}
notes.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
// Numbering counts up from the first note, so No. 001 is the oldest.
const total = notes.length;
notes.forEach((n, i) => (n.number = String(total - i).padStart(3, '0')));

const out = `// GENERATED by scripts/build-content.mjs from content/. Do not edit.
export interface Heading {
  depth: 2 | 3;
  id: string;
  text: string;
}

export interface WorkMeta {
  /** True once the detail sheet at /work/<slug> is written and built. */
  published: boolean;
  role: string;
  hardest: string;
  outcomes: string[];
  /** The detail sheet's body, compiled from Markdown. Empty until published. */
  html: string;
  headings: Heading[];
}

export interface Note {
  slug: string;
  number: string;
  title: string;
  date: string;
  summary: string;
  draft: boolean;
  minutes: number;
  html: string;
  headings: Heading[];
}

export const WORK: Record<string, WorkMeta> = ${JSON.stringify(work, null, 2)};

/** Newest first. */
export const NOTES: Note[] = ${JSON.stringify(notes, null, 2)};
`;
writeFileSync(OUT, out);
console.log(`✓ content: ${Object.keys(work).length} work entries, ${notes.length} notes${DRAFTS ? ' (drafts included)' : ''} → src/data/content.generated.ts`);
