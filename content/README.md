# Content

Markdown that the build turns into pages. Nothing here is rendered at runtime;
`scripts/build-content.mjs` reads it at build time and writes
`src/data/content.generated.ts`, which the pages import.

## work/<slug>.md: one per project

Front matter adds to the project's entry on the home page; the body is the
case study at `/work/<slug>`. A file with `published: false` adds nothing
beyond what `src/data/site.ts` already says, and no page is built for it, so
a half-written case study never reaches the site.

```yaml
---
published: false          # true builds /work/<slug> and links it from the home page
role: ""                  # one line, first person: "Sole developer; client, server, email."
hardest: ""               # one line: the hardest technical problem
outcomes: []              # up to three short lines, numbers only where real
---
The case study body, in Markdown. Headings from ## downward; code fences
get highlighted at build; images go in public/work/.
```

## blog/<slug>.md: one per note

```yaml
---
title: ""
date: 2026-09-17
summary: ""              # one line for the index and the page description
draft: true              # true keeps the note out of the build
---
```
