import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import sv from './i18n/sv';
import en from './i18n/en';

export function getHeaderData(locale: string = 'sv') {
  const t = locale === 'en' ? en : sv;

  return {
    links: [
      {
        text: t.nav.home,
        href: getPermalink('/'),
        links: [
          {
            text: t.nav.about,
            href: getPermalink('/om-oss'),
          },
          {
            text: t.nav.contact,
            href: getPermalink('/kontakt'),
          },
          {
            text: t.nav.privacy,
            href: getPermalink('/integritet'),
          },
        ],
      },
      {
        text: t.nav.treatments,
        href: getPermalink('/tjanster'),
        links: [
          {
            text: t.treatments.eswt,
            href: getPermalink('/behandlingar/eswt'),
          },
          {
            text: t.treatments.backPain,
            href: getPermalink('/behandlingar/ryggsmarta'),
          },
          {
            text: t.treatments.neckPain,
            href: getPermalink('/behandlingar/nacksmarta'),
          },
          {
            text: t.treatments.shoulders,
            href: getPermalink('/behandlingar/skuldror'),
          },
          {
            text: t.treatments.knees,
            href: getPermalink('/behandlingar/knan'),
          },
          {
            text: t.treatments.feet,
            href: getPermalink('/behandlingar/fotter'),
          },
          {
            text: t.treatments.vertigo,
            href: getPermalink('/behandlingar/yrsel'),
          },
        ],
      },
      {
        text: t.nav.blog,
        href: getBlogPermalink(),
      },
    ],
    actions: [{ text: t.nav.bookAppointment, href: getPermalink('/boka-tid') }],
  };
}

export function getFooterData(locale: string = 'sv') {
  const t = locale === 'en' ? en : sv;

  return {
    links: [
      {
        title: t.footer.treatments,
        links: [
          { text: t.treatments.eswt, href: getPermalink('/behandlingar/eswt') },
          { text: t.treatments.backPain, href: getPermalink('/behandlingar/ryggsmarta') },
          { text: t.treatments.neckPain, href: getPermalink('/behandlingar/nacksmarta') },
          { text: t.treatments.shoulders, href: getPermalink('/behandlingar/skuldror') },
          { text: t.treatments.knees, href: getPermalink('/behandlingar/knan') },
          { text: t.treatments.feet, href: getPermalink('/behandlingar/fotter') },
          { text: t.treatments.vertigo, href: getPermalink('/behandlingar/yrsel') },
        ],
      },
      {
        title: t.footer.aboutClinic,
        links: [
          { text: t.nav.about, href: getPermalink('/om-oss') },
          { text: t.nav.contact, href: getPermalink('/kontakt') },
          { text: 'Tips & Råd', href: getBlogPermalink() },
        ],
      },
    ],
    secondaryLinks: [
      { text: t.nav.privacy, href: getPermalink('/integritet') },
      { text: t.footer.contactUs, href: getPermalink('/kontakt') },
      { text: t.footer.cookies, href: getPermalink('/cookies') },
    ],
    address: 'Linbanegatan 12, 745 34 Enköping',
    footNote: `
      ${t.footer.copyright} ${new Date().getFullYear()}
      <br>
      <small>Vi följer svenska dataskyddsregler (GDPR) och värnar om din integritet.</small>
    `,
  };
}
