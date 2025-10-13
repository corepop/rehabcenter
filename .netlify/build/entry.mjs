import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BD_wAQpe.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/404.astro.mjs');
const _page1 = () => import('./pages/api/send-email.astro.mjs');
const _page2 = () => import('./pages/behandlingar/eswt.astro.mjs');
const _page3 = () => import('./pages/behandlingar/fotter.astro.mjs');
const _page4 = () => import('./pages/behandlingar/knan.astro.mjs');
const _page5 = () => import('./pages/behandlingar/nacksmarta.astro.mjs');
const _page6 = () => import('./pages/behandlingar/ryggsmarta.astro.mjs');
const _page7 = () => import('./pages/behandlingar/skuldror.astro.mjs');
const _page8 = () => import('./pages/behandlingar/yrsel.astro.mjs');
const _page9 = () => import('./pages/behandlingar/_treatment_.astro.mjs');
const _page10 = () => import('./pages/cookies.astro.mjs');
const _page11 = () => import('./pages/en/404.astro.mjs');
const _page12 = () => import('./pages/en/about.astro.mjs');
const _page13 = () => import('./pages/en/behandlingar/_treatment_.astro.mjs');
const _page14 = () => import('./pages/en/contact.astro.mjs');
const _page15 = () => import('./pages/en/cookies.astro.mjs');
const _page16 = () => import('./pages/en/pricing.astro.mjs');
const _page17 = () => import('./pages/en/privacy.astro.mjs');
const _page18 = () => import('./pages/en/rss.xml.astro.mjs');
const _page19 = () => import('./pages/en/services.astro.mjs');
const _page20 = () => import('./pages/en.astro.mjs');
const _page21 = () => import('./pages/integritet.astro.mjs');
const _page22 = () => import('./pages/kontakt.astro.mjs');
const _page23 = () => import('./pages/om-oss.astro.mjs');
const _page24 = () => import('./pages/prissättning.astro.mjs');
const _page25 = () => import('./pages/rss.xml.astro.mjs');
const _page26 = () => import('./pages/tjänster.astro.mjs');
const _page27 = () => import('./pages/_---blog_/_category_/_---page_.astro.mjs');
const _page28 = () => import('./pages/_---blog_/_tag_/_---page_.astro.mjs');
const _page29 = () => import('./pages/_---blog_/_---page_.astro.mjs');
const _page30 = () => import('./pages/index.astro.mjs');
const _page31 = () => import('./pages/_---blog_.astro.mjs');
const pageMap = new Map([
    ["src/pages/404.astro", _page0],
    ["src/pages/api/send-email.ts", _page1],
    ["src/pages/behandlingar/eswt.astro", _page2],
    ["src/pages/behandlingar/fotter.astro", _page3],
    ["src/pages/behandlingar/knan.astro", _page4],
    ["src/pages/behandlingar/nacksmarta.astro", _page5],
    ["src/pages/behandlingar/ryggsmarta.astro", _page6],
    ["src/pages/behandlingar/skuldror.astro", _page7],
    ["src/pages/behandlingar/yrsel.astro", _page8],
    ["src/pages/behandlingar/[treatment].astro", _page9],
    ["src/pages/cookies.astro", _page10],
    ["src/pages/en/404.astro", _page11],
    ["src/pages/en/about.astro", _page12],
    ["src/pages/en/behandlingar/[treatment].astro", _page13],
    ["src/pages/en/contact.astro", _page14],
    ["src/pages/en/cookies.astro", _page15],
    ["src/pages/en/pricing.astro", _page16],
    ["src/pages/en/privacy.md", _page17],
    ["src/pages/en/rss.xml.ts", _page18],
    ["src/pages/en/services.astro", _page19],
    ["src/pages/en/index.astro", _page20],
    ["src/pages/integritet.md", _page21],
    ["src/pages/kontakt.astro", _page22],
    ["src/pages/om-oss.astro", _page23],
    ["src/pages/prissättning.astro", _page24],
    ["src/pages/rss.xml.ts", _page25],
    ["src/pages/tjänster.astro", _page26],
    ["src/pages/[...blog]/[category]/[...page].astro", _page27],
    ["src/pages/[...blog]/[tag]/[...page].astro", _page28],
    ["src/pages/[...blog]/[...page].astro", _page29],
    ["src/pages/index.astro", _page30],
    ["src/pages/[...blog]/index.astro", _page31]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "39bfbe5b-ecf2-44de-9108-b6847d818585"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
