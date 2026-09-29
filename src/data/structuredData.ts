import { SITE, ORIGIN, EXPERIENCES, PROJECTS, KNOWS_ABOUT, SECTIONS } from './site';
import { PHOTOS } from './photos';
import type { Note, WorkMeta } from './content.generated';

const PERSON_ID = `${ORIGIN}/#person`;
const WEBSITE_ID = `${ORIGIN}/#website`;
const PAGE_ID = `${ORIGIN}/#webpage`;

/**
 * One schema.org @graph covering the whole site. Emitted into the prerendered
 * HTML by scripts/prerender.mjs, so it is present for crawlers that never run JS.
 */
export function buildStructuredData(lastModified: string) {
  // schema.org Role pattern: worksFor -> OrganizationRole -> worksFor -> Organization.
  // This keeps dates attached to each role while staying valid for rich-result parsers.
  const workHistory = EXPERIENCES.map((exp) => ({
    '@type': 'OrganizationRole',
    roleName: exp.role,
    startDate: exp.startDate,
    ...(exp.endDate ? { endDate: exp.endDate } : {}),
    worksFor: {
      '@type': 'Organization',
      name: exp.company,
      ...(exp.companyUrl ? { url: exp.companyUrl } : {}),
    },
  }));

  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    alternateName: [...SITE.alternateNames],
    givenName: 'Sangam',
    familyName: 'Singh',
    url: `${ORIGIN}/`,
    mainEntityOfPage: { '@id': PAGE_ID },
    image: {
      '@type': 'ImageObject',
      url: SITE.ogImage,
      width: 1200,
      height: 630,
      caption: `${SITE.name} — ${SITE.jobTitle}`,
    },
    description: SITE.bio,
    disambiguatingDescription: SITE.shortDescription,
    jobTitle: SITE.jobTitle,
    email: `mailto:${SITE.email}`,
    knowsLanguage: [
      { '@type': 'Language', name: 'English', alternateName: 'en' },
      { '@type': 'Language', name: 'Hindi', alternateName: 'hi' },
    ],
    nationality: { '@type': 'Country', name: 'India' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    worksFor: workHistory,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Atal Bihari Vajpayee Indian Institute of Information Technology and Management, Gwalior',
      alternateName: 'ABV-IIITM Gwalior',
      url: 'https://www.iiitm.ac.in/',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Engineer',
      occupationalCategory: '15-1252.00',
      skills: KNOWS_ABOUT.join(', '),
    },
    seeks: {
      '@type': 'Demand',
      name: 'Remote software engineering roles and collaborations',
    },
    knowsAbout: KNOWS_ABOUT,
    sameAs: [SITE.profiles.github, SITE.profiles.linkedin, SITE.profiles.kde],
  };

  const projectList = {
    '@type': 'ItemList',
    '@id': `${ORIGIN}/#projects`,
    name: `Projects by ${SITE.name}`,
    description: 'Open-source and personal software projects.',
    numberOfItems: PROJECTS.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: PROJECTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        '@id': `${ORIGIN}/#project-${p.slug}`,
        name: p.title,
        headline: p.title,
        description: p.description,
        codeRepository: p.github,
        programmingLanguage: p.stack,
        runtimePlatform: p.stack.join(', '),
        author: { '@id': PERSON_ID },
        creator: { '@id': PERSON_ID },
        isAccessibleForFree: true,
        url: p.live || p.github,
        ...(p.live ? { sameAs: [p.live] } : {}),
      },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${ORIGIN}/`,
        name: SITE.name,
        alternateName: SITE.handle,
        description: SITE.description,
        inLanguage: SITE.lang,
        publisher: { '@id': PERSON_ID },
        copyrightHolder: { '@id': PERSON_ID },
      },
      {
        '@type': 'ProfilePage',
        '@id': PAGE_ID,
        url: `${ORIGIN}/`,
        name: SITE.title,
        description: SITE.description,
        inLanguage: SITE.lang,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
        dateModified: lastModified,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: SITE.ogImage,
          width: 1200,
          height: 630,
        },
        // Lets Google surface in-page "jump to" links for each section.
        hasPart: SECTIONS.map((s) => ({
          '@type': 'WebPageElement',
          '@id': `${ORIGIN}/#${s.id}`,
          name: s.heading,
          url: `${ORIGIN}/#${s.id}`,
        })),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          ],
        },
      },
      person,
      projectList,
    ],
  };
}

const GALLERY_ID = `${ORIGIN}/photography#gallery`;

/**
 * Graph for /photography. ImageObject entries are what put individual photos
 * into Google Images, which is the main discovery channel for a gallery page.
 */
export function buildPhotographyStructuredData(lastModified: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageGallery',
        '@id': GALLERY_ID,
        url: `${ORIGIN}/photography`,
        name: `Photography by ${SITE.name}`,
        description:
          'A gallery of street, night and travel frames shot mostly on a phone.',
        inLanguage: SITE.lang,
        isPartOf: { '@id': WEBSITE_ID },
        author: { '@id': PERSON_ID },
        creator: { '@id': PERSON_ID },
        copyrightHolder: { '@id': PERSON_ID },
        dateModified: lastModified,
        numberOfItems: PHOTOS.length,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Photography',
              item: `${ORIGIN}/photography`,
            },
          ],
        },
        associatedMedia: PHOTOS.map((p) => ({
          '@type': 'ImageObject',
          '@id': `${ORIGIN}/photography#${p.slug}`,
          contentUrl: `${ORIGIN}/photos/${p.slug}-800.webp`,
          thumbnailUrl: `${ORIGIN}/photos/${p.slug}-400.webp`,
          width: p.width,
          height: p.height,
          encodingFormat: 'image/webp',
          ...(p.alt ? { name: p.alt, description: p.alt, caption: p.alt } : {}),
          ...(p.date ? { dateCreated: p.date } : {}),
          ...(p.location
            ? { contentLocation: { '@type': 'Place', name: p.location } }
            : {}),
          author: { '@id': PERSON_ID },
          creator: { '@id': PERSON_ID },
          copyrightHolder: { '@id': PERSON_ID },
          creditText: SITE.name,
        })),
      },
    ],
  };
}

/** A note at /blog/<slug>. */
export function buildNoteStructuredData(note: Note, lastModified: string) {
  const url = `${ORIGIN}/blog/${note.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#note`,
        url,
        mainEntityOfPage: url,
        headline: note.title,
        description: note.summary,
        datePublished: note.date,
        dateModified: lastModified,
        inLanguage: SITE.lang,
        isPartOf: { '@id': `${ORIGIN}/blog#notes` },
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        image: SITE.ogImage,
      },
    ],
  };
}

/** The index at /blog. */
export function buildNotesStructuredData(notes: Note[], lastModified: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${ORIGIN}/blog#notes`,
        url: `${ORIGIN}/blog`,
        name: `Notes by ${SITE.name}`,
        inLanguage: SITE.lang,
        dateModified: lastModified,
        isPartOf: { '@id': WEBSITE_ID },
        author: { '@id': PERSON_ID },
        blogPost: notes.map((n) => ({ '@id': `${ORIGIN}/blog/${n.slug}#note` })),
      },
    ],
  };
}

/** A detail sheet at /work/<slug>. */
export function buildWorkStructuredData(slug: string, meta: WorkMeta, lastModified: string) {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return { '@context': 'https://schema.org', '@graph': [] };
  const url = `${ORIGIN}/work/${p.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#detail`,
        url,
        mainEntityOfPage: url,
        headline: `${p.title}: a detail sheet`,
        description: p.summary,
        dateModified: lastModified,
        inLanguage: SITE.lang,
        author: { '@id': PERSON_ID },
        about: { '@id': `${ORIGIN}/#project-${p.slug}` },
        ...(meta.role ? { abstract: meta.role } : {}),
        image: p.image ? `${ORIGIN}/work/${p.image}-1600.webp` : SITE.ogImage,
      },
    ],
  };
}
