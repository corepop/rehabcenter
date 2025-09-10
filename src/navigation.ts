import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Hem',
      links: [
        {
          text: 'Prissättning',
          href: getPermalink('/pricing'),
        },
        {
          text: 'Om oss',
          href: getPermalink('/about'),
        },
        {
          text: 'Kontakt',
          href: getPermalink('/contact'),
        },
        {
          text: 'Integritetspolicy',
          href: getPermalink('/privacy'),
        },
      ],
    },
    {
      text: 'Behandlingar',
      links: [
        {
          text: 'Stötvågsbehandling - ESWT',
          href: getPermalink('/behandlingar/eswt'),
        },
        {
          text: 'Ryggsmärta',
          href: getPermalink('/behandlingar/ryggsmarta'),
        },
        {
          text: 'Nacksmärta',
          href: getPermalink('/behandlingar/nacksmarta'),
        },
        {
          text: 'Axlar & Skuldror',
          href: getPermalink('/behandlingar/skuldror'),
        },
        {
          text: 'Knäproblem',
          href: getPermalink('/behandlingar/knan'),
        },
        {
          text: 'Fot- & Hälsenbesvär',
          href: getPermalink('/behandlingar/fotter'),
        },
        {
          text: 'Yrsel & Balans',
          href: getPermalink('/behandlingar/yrsel'),
        },
      ],
    },
    {
      text: 'Blogg',
      links: [
        {
          text: 'Blogglista',
          href: getBlogPermalink(),
        },
        {
          text: 'Taggsida',
          href: getPermalink('astro', 'tag'),
        },
      ],
    },
  ],
  actions: [{ text: 'Boka tid', href: 'https://boka.antwork.se/238', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Behandlingar',
      links: [
        { text: 'Ryggsmärta & Ischias', href: getPermalink('/behandlingar/ryggsmarta') },
        { text: 'Nacksmärta & Huvudvärk', href: getPermalink('/behandlingar/nacksmarta') },
        { text: 'Skulder & Armar', href: getPermalink('/behandlingar/skuldror') },
        { text: 'Knän & Höfter', href: getPermalink('/behandlingar/knan') },
        { text: 'Fötter & Hälsenor', href: getPermalink('/behandlingar/fotter') },
        { text: 'Yrsel & Balans', href: getPermalink('/behandlingar/yrsel') },
      ],
    },
    {
      title: 'Om Kliniken',
      links: [
        { text: 'Om Johny Åhman', href: getPermalink('/about') },
        { text: 'Våra Tjänster', href: getPermalink('/services') },
        { text: 'Priser & Bokning', href: getPermalink('/pricing') },
        { text: 'Kontaktuppgifter', href: getPermalink('/contact') },
        { text: 'Tips & Råd', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Information',
      links: [
        { text: 'Integritetspolicy', href: getPermalink('/privacy') },
        { text: 'Användarvillkor', href: getPermalink('/terms') },
        { text: 'Cookies', href: getPermalink('/cookies') },
        { text: 'GDPR & Dataskydd', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Integritetspolicy', href: getPermalink('/privacy') },
    { text: 'Kontakta oss', href: getPermalink('/contact') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    Enköpings Rehabcenter © ${new Date().getFullYear()}
    <br>
    <small>Vi följer svenska dataskyddsregler (GDPR) och värnar om din integritet.</small>
  `,
};
