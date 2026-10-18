# Figma Make prompt

Paste everything between the rules into Figma Make as a single prompt.

Notes before you do:
- Figma Make cannot do WebGL, so the prompt asks for a layered-gradient
  approximation of the sky. The real shader is a code-side upgrade afterwards.
- Generate the **home page first**. Once the mood is right, run the two
  follow-up prompts at the bottom for the case study and the hiring page.
- If the first result is too generic, the fix is almost always to re-paste with
  the DO NOT list moved to the top.

---

Build a personal portfolio site for a software engineer. One page, desktop-first,
fully responsive down to 375px. React + Tailwind.

## THE MOOD — read this first, it matters more than the layout

Late October, around 4:40 in the afternoon, on a quiet university campus. Autumn
is ending and winter is close, and the weather is perfect. Most people have gone
home for the break; three friends are left, sitting on a bench, not saying much,
watching the sky go orange. Nothing is urgent. Nobody is performing.

The site should feel like that: unhurried, warm, slightly melancholy, deeply
calm. Confidence through stillness rather than through motion.

The one tension that makes it work: **soft atmosphere, hard information.** Large
warm empty areas, generous air, low contrast surfaces — and then a number like
`15 of 18` set in sharp monospace with nothing decorating it. The frame is
calm; the content is precise. Build that contrast everywhere.

## DO NOT — violating any of these ruins it

- No stock photography, no illustrations, no 3D renders, no generated imagery,
  no icons-as-decoration. All atmosphere must come from colour, gradient, grain
  and type. There are no pictures in this design except the owner's own photos
  in one small strip.
- No pure black (`#000`) and no pure white (`#fff`) anywhere. Not in text, not
  in backgrounds, not in borders.
- No Inter, no Poppins, no Montserrat, no system-ui stack for display type.
- No purple-to-pink gradients. No glassmorphism. No neon. No glow effects.
- No emoji. No rocket, no sparkles, no fire.
- No bento grid of equal rounded cards. No "Hi, I'm ___ 👋". No typewriter
  effect on the hero. No marquee of tech logos.
- No section called "My Journey", "Let's Connect", "Get In Touch", or "Tech Stack".
- No heavy border radius. Nothing above 4px except small pill chips.
- No drop shadows in light mode at all.
- Do not centre the entire page. Use an asymmetric layout with a real left margin.

## COLOUR

Two complete themes. **Light is the default.** The formula in both: a cool field
with exactly one warm light source. Never light two accents at once.

Light theme, "Last Light" — 4:40pm:
```
--paper        #F4EFE6   page background, warm paper, never white
--paper-raised #FAF6EE   cards, raised surfaces
--paper-sunk   #EBE4D8   recessed areas, code blocks
--ink          #17150F   primary text, warm near-black
--ink-muted    #5E564A   body text
--ink-faint    #776E60   metadata, captions
--ember        #A63D16   THE accent, burnt orange, the sun
--dusk-blue    #35497A   secondary, cool, dusty cobalt
--line         #DDD4C4   1px rules only
```

Dark theme, "Dusk" — 7:20pm:
```
--night        #0C1222   deep indigo-navy. NOT black. This matters.
--night-raised #131B2F
--night-sunk   #080D1A
--cream        #EBE4D6   primary text
--cream-muted  #A2A9BD   body
--cream-faint  #6E7894   metadata
--lamp         #F0A258   THE accent, warm amber, a lamp in the dark
--sky          #7392CF   secondary, cool blue
--line         #1E2840
```

Over the entire page in both themes, apply a fine film grain at 3.5% opacity in
light and 6% in dark, using an inline SVG `feTurbulence` filter as a fixed
overlay with `pointer-events: none`. This is important — it breaks up the flat
gradients and makes the surfaces feel physical rather than digital.

## TYPE

Three faces, all Google Fonts:
- **Instrument Serif** — display only. Hero name, section titles, pull quotes.
  Regular and italic, no bold (it has none; do not fake it).
- **Newsreader** — all prose and body paragraphs. Line height 1.75, measure
  capped at 68 characters.
- **JetBrains Mono** — navigation, labels, metadata, tech chips, and **every
  number**. Always `font-variant-numeric: tabular-nums`.

Hard rule: **numbers are always mono, never serif.** That single rule is what
makes the statistics land against the soft background.

Fluid sizes via `clamp()`: 96 / 64 / 40 / 28 / 20 / 17 / 15 / 13.
Display line-height 1.1 with `letter-spacing: -0.02em`.

## THE SKY

A fixed full-viewport background behind all content, built from three or four
stacked CSS radial and linear gradients:
- A soft warm radial light source at roughly 70% across, 25% down.
- A broad cool gradient falling from the top.
- A very subtle second warm wash near the bottom edge.
- Everything blurred and low-opacity so no individual gradient is legible as a
  shape. It should read as light in air, not as a graphic.

In dark theme the warm source sits lower and dimmer, the field goes indigo, and
small faint stars appear in the upper third (tiny dots of varying opacity, laid
out irregularly — not a grid).

Below the hero, fade the whole sky layer to about 25% opacity so the reading
sections stay calm.

## THE THEME TOGGLE — spend the most effort here

This is the centrepiece of the entire site. It is not an icon button and it is
not a flip.

It renders as a thin horizontal rule in the top-right of the navigation, about
44px wide, with a small filled dot on it. In light theme the dot sits at the
left end and slightly above the line. In dark theme it sits at the right end and
slightly below. The dot travels along a shallow arc, like the sun's path.

On click, run a 1600ms sequence (not a crossfade):

1. `0ms` — the dot pulls backwards 4px before it starts moving forwards.
2. `0–600ms` — the sky gradients animate through intermediate colours that
   belong to **neither** theme: cream, then peach, then rose, then violet, then
   indigo. This passage through colours that are in no palette is what makes it
   read as an actual sunset.
3. `200–900ms` — text colours change, but staggered top to bottom across the
   viewport over 300ms, like light leaving a room.
4. `500ms` — grain opacity steps up from 3.5% to 6%.
5. `700–1400ms` — stars fade in with varied delays.
6. `800ms` — the accent travels from `#A63D16` to `#F0A258`, overshooting past
   the target before settling back.

Reverse (dark → light) runs the same sequence backwards in **1100ms**, not 1600.
Dawn is faster than dusk.

Under `prefers-reduced-motion`, swap instantly with no animation.

## MOTION — anime timing, no anime imagery

Use these easings consistently:
```
--ease-anticipate  cubic-bezier(0.34, -0.25, 0.20, 1.00)
--ease-settle      cubic-bezier(0.22,  1.40, 0.36, 1.00)
--ease-glide       cubic-bezier(0.16,  1.00, 0.30, 1.00)
```
- Every forward movement begins with a small counter-movement (anticipation).
- Every arrival overshoots its target by about 6% and settles back.
- Number counters and the contribution heatmap animate at roughly 8–12fps using
  `steps()` while everything around them stays smooth. This stepped timing is
  deliberate and is the most important motion detail after the toggle.
- After a section finishes animating in, nothing else animates for 400ms. Hold
  the pause. The emptiness is the point.
- When a card lifts on hover, its shadow lags 40ms behind its content.
- Sections reveal line by line with a `clip-path: inset(0 0 100% 0)` wipe rather
  than an opacity fade, so text appears as if being written.

## STRUCTURE AND CONTENT — use this copy exactly

**Navigation** — fixed, thin, mono 13px, lowercase: `work  ·  photography  ·
resume`, with the theme toggle at the right. A hairline bottom border that only
appears once scrolled.

**1. Hero** — full viewport, content on an asymmetric left-weighted column, not
centred.
- Instrument Serif, ~96px: `Sangam Pratap Singh`
- JetBrains Mono, 13px, letter-spacing 0.18em, in the accent colour:
  `founding engineer · ai systems`
- Newsreader, 20px, max 68 characters wide:
  *"Founding engineer at Retsguide in Copenhagen, where I built the product end
  to end and am now building its legal brain. I build AI systems that can be
  checked: the model reads and ranks, the code decides."*
- Two links, mono 13px: `view work` and `resume`. Not buttons. Underlined with a
  1px rule that extends on hover.

**2. The position** — a single pull quote, Instrument Serif at 64px, with
enormous space around it:
> The model extracts. The code decides.

Below it, three short sentences in Newsreader explaining that LLM output is
treated as input to deterministic systems, never as the system itself.

**3. Proof** — four statistics in a row (two by two on mobile). Each is a large
mono number in the accent colour with a small mono caption under it in muted
ink. No cards, no borders, no icons. Just the numbers on the paper.
```
Top 50           of 32,000+ teams, Amazon ML Challenge 2026
15 of 18         settings won against a plain Transformer, controlled ablation
2×               editor adoption after the WebSocket service shipped
millions         Plasma users running merged KDE code
```

**4. Selected work** — three large horizontal case-study cards, each full-width,
stacked. Each card: a mono index (`01`), the title in Instrument Serif at 40px,
two lines of Newsreader description, a row of mono tech chips, and one mono
link reading `read the case study →`.
```
01  Hybrid CNN-Transformer for building load forecasting
    A multi-scale convolutional front end, an FFT branch for the daily and
    weekly cycle, and cross-attention fusion ahead of a Transformer encoder.
    Beat a plain Transformer in 15 of 18 settings, MAE down 10.4%, R² 0.88–0.97.
    Python · PyTorch · Transformers · scikit-learn

02  An AI code reviewer that almost never pays for a token
    Runs on a /review comment in GitHub Actions and falls through eight free
    models before it will reach a paid one. Member-gated, SHA-pinned, with the
    token budget raised so large diffs are never silently truncated.
    GitHub Actions · OpenRouter · Groq · Azure OpenAI

03  Astra
    Parses a repository with Tree-sitter, matches dependencies against OSV.dev,
    and uses Gemini to generate remediation patches that auto-open as pull
    requests. Runs on 500+ file repositories.
    Electron · Node.js · Tree-sitter · Gemini
```

**5. Experience** — a two-column layout, dates in mono on the left, content on
the right, separated by hairlines. Pull the key number out of each role and set
it large in mono.
```
Jun 2026 — Present   Retsguide, Copenhagen
                     Software Engineer Intern (Founding Engineer)
                     Shipped three customer-facing flows end to end. Building
                     the legal knowledge graph behind their reports, with no
                     LLM writing to it, so every claim traces back to the
                     provision it rests on.
                     → 2s to 150ms server response

Jul 2025 — Sep 2025  OpenSphere, San Francisco
                     Software Development Intern
                     Built the WebSocket service behind real-time threaded
                     commenting, keeping threads consistent across concurrent
                     editors.
                     → 2× editor adoption

Dec 2025 — May 2026  KDE Plasma
                     Open Source Contributor
                     Five merged MRs across Plasma Workspace, Marknote and
                     Drawy. Featured in This Week in Plasma.
                     → shipping to millions
```

**6. Photography** — a horizontal strip of five images at mixed aspect ratios,
greyscale, going to full colour on hover over 500ms **passing through a warm
sepia at the midpoint** rather than lerping directly. A mono caption on the left
reads `photography` and a link reads `see all →`. Use neutral grey placeholder
rectangles; the real photographs are supplied in code.

**7. Contact** — the quietest part of the page, with the most space. A single
Instrument Serif line, `say hello`, three mono links (`email`, `github`,
`linkedin`), and a footer line in 11px mono faint: `© 2026 random-pikachu`.

## RESPONSIVE

Below 768px: single column, hero display type drops to ~56px, proof statistics
go two by two, experience collapses to one column with the date above the role,
the photography strip scrolls horizontally with momentum. Keep a 20px side
gutter and never allow horizontal page scroll.

---

## Follow-up prompt 1 — the case study page

> Using the exact same design system, build the case study page for
> `Hybrid CNN-Transformer for building load forecasting`. Structure: a title in Instrument
> Serif at 64px over the sky; a mono metadata row (role, timeframe, stack); a
> `The problem` section in Newsreader prose; a `What I built` section; a
> `Decisions` section formatted as three or four decision blocks, each with a
> bold one-line claim and a short justification beneath; a `Results` section
> reusing the large mono statistic treatment; and a previous/next footer. Prose
> measure stays at 68 characters. No images anywhere.

## Follow-up prompt 2 — the hiring page

> Using the exact same design system, build a personalised hiring page at
> `/for/<company>/<person>`. Above the fold, nothing but one Instrument Serif
> line over the dusk sky, in dark theme — `Hi Priya.` when a person is named,
> falling back to `For the team at Stripe.` when only a company is. Then: a
> three-sentence personal note in Newsreader; three large mono statistics
> selected for this reader; two case-study cards in the same style as the home
> page; and a closing block with resume, calendar and email links. It must feel
> like a letter rather than a landing page — more white space, narrower measure,
> no navigation except a small link back home. Build both states so I can see
> the named and unnamed versions side by side.
