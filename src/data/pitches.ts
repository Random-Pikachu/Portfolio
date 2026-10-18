/**
 * Personalised hiring pages. One entry per company, optionally one per person
 * inside it, rendered at /for/<company> and /for/<company>/<person>.
 *
 * Every person field falls back to the company value, so adding a named
 * recipient is usually two lines. An unrecognised person slug renders the
 * company page rather than 404ing, so a mistyped or forwarded link still lands
 * somewhere sensible.
 *
 * These pages carry `noindex, nofollow` and are excluded from the sitemap. They
 * are unlisted, not private: anyone holding the link can open it, and the
 * person's name sits in the URL. Use first names only, and write nothing here
 * that would embarrass anyone if forwarded.
 */

export interface Person {
  slug: string;
  /** Used in the greeting. First name only — this ends up in a public URL. */
  name: string;
  title?: string;
  /** Overrides the default "Hi <name>." */
  greeting?: string;
  /** Overrides the company note. */
  note?: string;
  /** Overrides the company project order. */
  highlights?: string[];
}

export interface Pitch {
  slug: string;
  company: string;
  /** The role being pitched for, shown under the greeting. */
  role?: string;
  /** Two or three sentences. Written by hand, per company. Never generated. */
  note: string;
  /** Project slugs, in display order. */
  highlights: string[];
  /** Proof-point ids from the shared set, in display order. Three of them. */
  proofPoints: string[];
  theme?: 'lastlight' | 'dusk';
  people?: Person[];
  /** ISO date. After this the page shows a short "this link has expired" note. */
  expiresOn?: string;
}

export const PITCHES: Pitch[] = [
  {
    slug: 'documenso',
    company: 'Documenso',
    role: 'Founding / Product Engineer',
    note:
      "Documenso's whole point is that a signature can be proven rather than " +
      'asserted. I work from the same instinct on the other side of the ' +
      'problem: I am a founding engineer at a Danish legal-tech startup where ' +
      'I have built the product end to end, and the AI layer I am building now ' +
      'is arranged so the model never gets the final say. Before that I landed ' +
      'five patches in KDE Plasma and shipped real-time collaborative editing ' +
      'at a startup in San Francisco, so open source and documents with many ' +
      'editors are both familiar ground.',
    highlights: ['review-agent', 'astra', 'load-forecasting'],
    proofPoints: ['kde-mrs', 'editor-adoption', 'amazon-ml'],
    theme: 'dusk',
    people: [
      {
        slug: 'timur',
        name: 'Timur',
        title: 'Co-founder & CEO',
      },
    ],
  },
];

export const PITCH_BY_SLUG = Object.fromEntries(PITCHES.map((p) => [p.slug, p]));
