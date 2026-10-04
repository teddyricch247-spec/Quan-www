/**
 * Facts about Quancis that appear on more than one page (About, Contact,
 * footer, structured data). Change a contact detail here and every page
 * updates together.
 *
 * Everything here comes from the shareable business brief. Two things are
 * deliberately NOT here: a legal registration number (none has been
 * provided, so none is invented) and social-media profiles (add them to
 * SOCIAL_PROFILES in lib/seo.ts once they exist).
 */
export const ORG = {
  name: 'Quancis',
  owner: 'Response Mosese',
  ownerRole: 'Owner, Quancis',
  email: {
    support: 'support@quancis.space',
    business: 'response@quancis.space',
  },
  address: {
    street: 'Sekhukhune 1124',
    region: 'Limpopo',
    country: 'South Africa',
    countryCode: 'ZA',
  },
} as const;

/** One-line postal address, e.g. for the footer. */
export const ADDRESS_LINE = `${ORG.address.street}, ${ORG.address.region}, ${ORG.address.country}`;
