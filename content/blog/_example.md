---
title: "An example note"
date: 2026-09-17
summary: "The shape of a note: front matter, headings, a code block. Delete or rename this file."
draft: true
---

This file begins with an underscore and is marked draft, so a normal build
ignores it; `CONTENT_DRAFTS=1 npm run build` includes it, which is how the
note template is reviewed. Copy it to `content/blog/<slug>.md`, give it a
real title, date and summary, set `draft: false`, and the note is built at
`/blog/<slug>` on the next build.

## Headings become the outline

Every `##` and `###` heading appears in the "On this sheet" column and gets
an id you can link to.

### Code is highlighted at build

```ts
export function moonPhase(date: Date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  return (1 - Math.cos(elongation(jd))) / 2; // illuminated fraction
}
```

Tables, task lists and footnotes work too, since the Markdown is
GitHub-flavoured.

| Field   | Where it shows        |
| ------- | --------------------- |
| title   | the index and the top |
| summary | under the title       |
