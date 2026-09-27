# The plates

One file per slot in `src/data/art.ts`. Drop a source here as
`<id>.png` (or `.webp`, `.jpg`) at the size the brief asks for and run
`npm run art`; the outputs in `public/art` are committed. With no source
present the script synthesizes a placeholder from the site's own photographs
through the same pipeline as the cover wash (`scripts/lib/wash.mjs`).

Every brief shares this header:

> Ink illustration in the register of a 19th-century celestial atlas plate:
> fine cross-hatching and stipple, deep indigo-black night, cream paper
> highlights, matte paper texture visible in the darks, thin construction
> lines and dotted orbital arcs in cream (no gold), no text, no lettering, no
> lens flare, no photorealism, no purple or teal nebulae, no ringed planets,
> no rockets, no astronauts, no glow bloom. Palette limited to indigo-black,
> slate blue, cream and one grey.

| Slot | File | Size | Where |
| --- | --- | --- | --- |
| frontispiece | `00-frontispiece.png` | 3200×2400 | Chart 00, the right five columns |
| firmament | `03-firmament.png` | 6000×1500 | Chart 03, behind the plate strip |
| lighthouse | `04-lighthouse.png` | 1600×2000 | Chart 04, the right columns |

Anchors (normalized points the site registers other things to) are in
`src/data/art.ts`; keep the lamp, the moon and the quiet quadrant where the
briefs put them, or update the anchors with the art.
