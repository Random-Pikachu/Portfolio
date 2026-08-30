import { SITE, ORIGIN, EXPERIENCES, PROJECTS, KNOWS_ABOUT, SECTIONS } from './site';

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
        '@id': `${ORIGIN}/#project-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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
