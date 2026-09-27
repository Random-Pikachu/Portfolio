/**
 * The sixty-second story of each project, by slug: the problem, the call
 * (the key decision and what was rejected), the outcome, and one number.
 * Drafted in docs/project-stories-draft.md and rendered exactly; a project
 * with no honest number has no number line, and nothing here is invented.
 */
export interface Story {
  problem: string;
  call: string;
  outcome: string;
  /** Real only. Absent when the draft had nothing honest to put here. */
  number?: string;
}

export const STORIES: Record<string, Story> = {
  ephemeris: {
    problem:
      'Every planner I tried wanted more of my evening than my day did. Logging habits felt like a second job, so I quit all of them within a week. Twice.',
    call:
      'Cap the whole ritual at thirty seconds. One screen, one prompt, and Gemini writes the summary so I never stare at a blank journal page. I rejected the dashboard-of-charts approach: if it needs a tutorial, it is already dead.',
    outcome:
      'A planner, habit tracker, and journal I actually open every night. The day comes back as a digest, and the streak keeps itself.',
    number: '30 seconds, the whole evening ritual.',
  },
  coderivals: {
    problem: 'Grinding LeetCode alone is boring, and the duel platforms I found felt like homework with extra steps.',
    call:
      'Real-time 1v1 duels on SpacetimeDB so game state just syncs, with no hand-rolled socket protocol to babysit, plus power cards that flip a round halfway through. I rejected turn-based play; a duel should feel like a fight, not correspondence chess.',
    outcome: 'Two players, one room, Monaco on both ends, and a demo video to prove it plays the way it reads.',
  },
  astra: {
    problem: 'Dependency scanners hand you a CVE list and wish you luck. Knowing you are vulnerable is not the same as being fixed.',
    call:
      'Parse the repo with Tree-sitter so the scanner knows which imports are actually reachable, match against OSV.dev, then put a fix button on every finding: one click creates a branch off main, Gemini CLI does the fix work on that branch, and the user opens the PR. I rejected the report-only scanner: a scanner that cannot fix is a todo list with extra steps. I also kept the human in the loop on purpose; the fix lands as a branch for review, not a surprise merge. Scanning stays local; only dependency metadata leaves the machine.',
    outcome:
      'A desktop (Electron) and web app covering npm and pip, with a live fix console streaming each step. Every commit triggers an automatic rescan, so new vulnerabilities get caught as they land. Co-built with mahil-2040.',
    number: 'Scans repos of 500+ files.',
  },
  devtrackr: {
    problem: 'My progress lived in three places: GitHub commits, LeetCode solves, Codeforces rating. None of them told the full story.',
    call:
      'One heatmap for all three. A Go backend polls the three APIs, Postgres keeps the history, and a daily digest makes the streak stare back at me every morning. I rejected another chart dashboard; a heatmap is the whole story in one glance.',
    outcome: 'A single view of developer activity plus a daily digest, live at devtrackr-hci.vercel.app.',
    number: '3 platforms, 1 heatmap.',
  },
  gitstory: {
    problem: 'Opening an unfamiliar repo means reading hundreds of files before anything makes sense. READMEs lie by omission.',
    call:
      'Talk to the repo instead. A conversational interface where TamboAI generates timelines, diffs, and risk maps, so you interrogate the codebase instead of excavating it. I rejected static generated docs; they rot the moment the code changes.',
    outcome: 'Chat with any repository and get visual answers back: timelines, diffs, risk maps.',
  },
  'code-sync': {
    problem: 'Pair programming over screen share is laggy and one-sided. The watcher cannot touch the code.',
    call:
      'One room, shared cursors, both hands on the keyboard, and real execution through Judge0 so you can run what you just wrote together. Built on Socket.io and Monaco. I rejected building a CRDT editor from scratch, because the point was pairing, not text-sync research.',
    outcome: "Google Docs for code: join a room, see each other's cursors, run it.",
  },
};
