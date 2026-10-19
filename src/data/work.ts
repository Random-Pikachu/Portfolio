/**
 * Projects and their case studies.
 *
 * `featured` entries get a full page at /work/<slug>; everything else is a card
 * on /work. Nothing here describes Retsguide's internals — see §2.1 of
 * docs/REDESIGN.md for where that line sits and why.
 */

export interface Decision {
  /** The claim, stated flatly. One line. */
  claim: string;
  /** Why, in two or three sentences. */
  why: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One line for the card. */
  blurb: string;
  year: string;
  stack: string[];
  github?: string;
  live?: string;
  video?: string;
  featured?: boolean;

  /** Hover preview on the work list. Absent where there is no screenshot. */
  shot?: string;

  /** Case-study body. Present only on featured entries. */
  role?: string;
  problem?: string;
  built?: string;
  decisions?: Decision[];
  stats?: Stat[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'load-forecasting',
    title: 'Hybrid CNN-Transformer for building load forecasting',
    blurb:
      'A forecasting model for a building’s hourly electricity use, two to forty-eight hours ahead, defended by a controlled ablation rather than a leaderboard screenshot.',
    year: 'Jun — Aug 2026',
    stack: ['Python', 'PyTorch', 'Transformers', 'scikit-learn'],
    featured: true,
    role: 'Sole author',
    problem:
      'Forecasting a building’s electricity demand is two problems wearing one coat. There’s a short, local pattern — a lift running, a floor switching its lights on — and a long, periodic one, the daily and weekly rhythm of a working building. A convolutional model reads the first well and loses the second. A plain Transformer attends across the whole window and smears the first. Most published hybrids claim to fix this and then compare themselves against baselines trained under different budgets, which proves nothing.',
    built:
      'A multi-scale convolutional front end with four kernel widths reads local structure. A parallel FFT branch supplies the daily and weekly cycle directly in the frequency domain rather than asking attention to rediscover it. Cross-attention fuses the two before a Transformer encoder makes the prediction. The whole thing is trained on CU-BEMS: 11,486 hourly readings from a seven-storey office building.',
    decisions: [
      {
        claim: 'The ablation holds everything fixed except the thing being tested.',
        why: 'Same data, same loss, same optimiser, same schedule, same seed. Only the convolutional and spectral front end is removed. Without that discipline a hybrid always looks better than its baseline, because it is being compared against a model that was trained worse.',
      },
      {
        claim: 'The FFT branch supplies periodicity instead of attention learning it.',
        why: 'A daily cycle is a known property of the signal, not something worth spending model capacity to discover. Handing it over directly leaves attention free to work on what is actually irregular.',
      },
      {
        claim: 'Reported across eighteen lookback and horizon settings, not the best one.',
        why: 'A single flattering configuration is how most of this literature is written. The result that matters is whether the design holds across the grid, so the grid is what gets published.',
      },
    ],
    stats: [
      { value: '15 of 18', label: 'lookback and horizon settings where the hybrid beat a plain Transformer' },
      { value: '−10.4%', label: 'mean absolute error, and −12.2% at horizons past ten hours' },
      { value: '0.88 — 0.97', label: 'test R² across every tested horizon' },
    ],
  },

  {
    slug: 'review-agent',
    title: 'An AI code reviewer that almost never pays for a token',
    blurb:
      'Runs on a /review comment in GitHub Actions and falls through eight free models before it will reach a paid one.',
    year: '2026',
    stack: ['GitHub Actions', 'OpenRouter', 'Groq', 'Azure OpenAI'],
    github: 'https://github.com/Random-Pikachu/Portfolio/blob/main/.github/workflows/ai-review.yml',
    featured: true,
    role: 'Built it, run it on four repositories',
    problem:
      'Paid PR review tools bill per seat and per repository, and the useful part of what they do is a diff, a prompt and somewhere to put the output. The hard part is not the review. It’s that a free model tier will rate-limit you, go down, or quietly truncate a large diff and hand back a confident review of the half it managed to read.',
    built:
      'A GitHub Actions workflow triggered by a /review comment. It resolves a model from the command, then hands the job an ordered chain of fallbacks: free OpenRouter models first, then Groq, and paid Azure OpenAI only once everything above it has failed. The token budget is raised well past the default so a large diff is never silently pruned, and findings are capped and posted as one persistent comment rather than a new thread per run.',
    decisions: [
      {
        claim: 'Eight fallbacks deep, and the paid one is last.',
        why: 'Any single free tier is unreliable enough to be useless on its own. Eight of them in series is reliable, and the paid provider then exists as a floor nobody normally reaches rather than as the default path.',
      },
      {
        claim: 'Only repository members can trigger it.',
        why: 'The workflow runs on issue_comment, which fires for anyone who can comment. Gating on author association, and excluding bots, is what stops a stranger spending your inference budget from a drive-by comment on a public repo.',
      },
      {
        claim: 'The action is pinned to a commit SHA, not a tag.',
        why: 'A tag can be moved. An action that reads your diff and holds your provider keys is not somewhere to accept a mutable reference.',
      },
      {
        claim: 'The token budget is raised rather than left at the default.',
        why: 'The failure mode that matters isn’t an error. It’s a review that silently covered sixty percent of the diff and said nothing about the rest.',
      },
    ],
    stats: [
      { value: '8 deep', label: 'free models tried before a paid token is spent' },
      { value: '4 repos', label: 'running it in place of paid review tooling' },
      { value: '128k', label: 'token budget, so large diffs are not silently pruned' },
    ],
  },

  {
    slug: 'astra',
    shot: '/work/astra-700.webp',
    title: 'Astra',
    blurb:
      'Parses a repository with Tree-sitter, matches its dependencies against OSV.dev, and uses Gemini to write remediation patches that open as pull requests.',
    year: 'Aug — Sep 2025',
    stack: ['Electron', 'Node.js', 'Express', 'MongoDB', 'Tree-sitter', 'Gemini'],
    github: 'https://github.com/Random-Pikachu/Astra',
    video: 'https://youtu.be/XFiMSWMZ4KU',
    featured: true,
    role: 'Sole author',
    problem:
      'Vulnerability scanners are good at telling you that a dependency is vulnerable and bad at the part that costs time. Someone still has to open the file, work out whether the vulnerable path is actually reachable from this codebase, write the change, and raise it for review. The report is the easy half.',
    built:
      'A desktop tool that parses the repository into an AST with Tree-sitter, resolves the dependency graph, and matches it against the OSV.dev vulnerability database. Where a match is reachable, Gemini drafts a remediation patch against the real surrounding code, and the patch opens as a pull request. There is no manual step between detection and code review. It runs over repositories of 500+ files.',
    decisions: [
      {
        claim: 'Tree-sitter parses the code; the model only writes the patch.',
        why: 'Asking a model what a codebase imports produces plausible answers rather than correct ones. A parser produces a fact. The model is handed that fact and asked to do the thing it is genuinely good at, which is writing idiomatic code in context.',
      },
      {
        claim: 'The output is a pull request, not a report.',
        why: 'A report adds a task. A pull request is already the unit of work a team reviews and merges, so the tool ends where the existing process begins instead of beside it.',
      },
    ],
    stats: [
      { value: '500+', label: 'files per repository in the tested range' },
      { value: '0', label: 'manual steps between detection and code review' },
    ],
  },

  // ── Not case-studied; cards on /work ──────────────────────────────────────
  {
    slug: 'ephemeris',
    title: 'Ephemeris',
    blurb:
      'A daily planner, habit tracker and journal that asks for thirty seconds an evening. One email at dusk, in your own time zone.',
    year: '2026',
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Gemini', 'Resend'],
    github: 'https://github.com/Random-Pikachu/ephemeris-client',
    live: 'https://ephemeris.random-pikachu.dev/',
  },
  {
    slug: 'coderivals',
    title: 'CodeRivals',
    blurb:
      'Real-time 1v1 competitive coding. Matchmaking, live match state and an Elo update per match, with submissions executing in a sandboxed Piston instance.',
    year: 'Apr 2026',
    stack: ['React', 'SpacetimeDB', 'AWS EC2', 'Docker', 'Nginx', 'Monaco'],
    github: 'https://github.com/Sypher845/code-rivals',
    live: 'https://code-rivals-six.vercel.app/',
    video: 'https://www.youtube.com/watch?v=mmFpLflQln4',
  },
  {
    slug: 'devtrackr',
    shot: '/work/devtrackr-700.webp',
    title: 'DevTrackr',
    blurb:
      'A Go service that unifies the GitHub, LeetCode and Codeforces APIs into one normalised schema and mails a daily digest. Released to real users.',
    year: 'Apr 2026',
    stack: ['Go', 'PostgreSQL', 'React', 'Docker', 'Resend'],
    github: 'https://github.com/Random-Pikachu/DevTrackr-Backend',
    live: 'https://devtrackr-hci.vercel.app/',
    video: 'https://youtu.be/kUKd9O6k4Zg',
  },
  {
    slug: 'gitstory',
    shot: '/work/gitstory-700.webp',
    title: 'GitStory',
    blurb:
      'A conversational interface over a GitHub repository that answers with commit timelines, diff viewers and risk heatmaps rather than paragraphs.',
    year: '2025',
    stack: ['React', 'TamboAI', 'Tailwind'],
    github: 'https://github.com/Random-Pikachu/GitStory',
    live: 'https://git-story-tan.vercel.app/',
  },
  {
    slug: 'securepdf',
    shot: '/work/securepdf-700.webp',
    title: 'SecurePDF',
    blurb:
      'An offline tool that binds a PDF to one machine with hardware fingerprinting and time limits, with printing and copying disabled.',
    year: '2025',
    stack: ['Python', 'Fernet', 'PyMuPDF', 'CustomTkinter'],
    github: 'https://github.com/Random-Pikachu/SecurePDF',
    live: 'https://secure-pdf-five.vercel.app/',
  },
  {
    slug: 'code-sync',
    shot: '/work/code-sync-700.webp',
    title: 'Code-Sync',
    blurb:
      'A collaborative editor with live cursors and Judge0 execution. Google Docs, for code.',
    year: '2025',
    stack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Monaco'],
    github: 'https://github.com/Random-Pikachu/Code-Sync',
    live: 'https://codesync-v8bl.onrender.com/',
  },
  {
    slug: 'sorting-visualizer',
    shot: '/work/sorting-visualizer-700.webp',
    title: 'Sorting Visualizer',
    blurb: 'Merge, quick and the rest, animated step by step.',
    year: '2024',
    stack: ['React'],
    github: 'https://github.com/Random-Pikachu/Sorting-Visualizer-v2',
    live: 'https://random-pikachu.github.io/Sorting-Visualizer-v2/',
  },
];

/**
 * Projects whose work-list preview is a hand-drawn diagram rather than a
 * screenshot, because neither has a UI worth showing. Drawn in
 * src/components/Plate.tsx; kept here so the routes can ask without importing
 * a constant out of a component module.
 */
export const DRAWN = new Set(['load-forecasting', 'review-agent']);

export const FEATURED = PROJECTS.filter((p) => p.featured);
export const PROJECT_BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));
