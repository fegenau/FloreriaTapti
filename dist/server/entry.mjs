import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DkC1Awfm.mjs';
import { manifest } from './manifest_BJiUQ4T2.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/mp/create-preapproval.astro.mjs');
const _page2 = () => import('./pages/api/mp/create-preference.astro.mjs');
const _page3 = () => import('./pages/api/mp/webhook.astro.mjs');
const _page4 = () => import('./pages/api/orders/checkout.astro.mjs');
const _page5 = () => import('./pages/api/orders/create.astro.mjs');
const _page6 = () => import('./pages/api/validate-address.astro.mjs');
const _page7 = () => import('./pages/api/webpay/return.astro.mjs');
const _page8 = () => import('./pages/carrito.astro.mjs');
const _page9 = () => import('./pages/catalogo.astro.mjs');
const _page10 = () => import('./pages/confirmacion.astro.mjs');
const _page11 = () => import('./pages/contacto.astro.mjs');
const _page12 = () => import('./pages/membresias.astro.mjs');
const _page13 = () => import('./pages/producto/_slug_.astro.mjs');
const _page14 = () => import('./pages/sobre.astro.mjs');
const _page15 = () => import('./pages/webpay/return.astro.mjs');
const _page16 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/api/mp/create-preapproval.ts", _page1],
    ["src/pages/api/mp/create-preference.ts", _page2],
    ["src/pages/api/mp/webhook.ts", _page3],
    ["src/pages/api/orders/checkout.ts", _page4],
    ["src/pages/api/orders/create.ts", _page5],
    ["src/pages/api/validate-address.ts", _page6],
    ["src/pages/api/webpay/return.ts", _page7],
    ["src/pages/carrito.astro", _page8],
    ["src/pages/catalogo.astro", _page9],
    ["src/pages/confirmacion.astro", _page10],
    ["src/pages/contacto.astro", _page11],
    ["src/pages/membresias.astro", _page12],
    ["src/pages/producto/[slug].astro", _page13],
    ["src/pages/sobre.astro", _page14],
    ["src/pages/webpay/return.astro", _page15],
    ["src/pages/index.astro", _page16]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///D:/Trabajos/FloreriaTapti/dist/client/",
    "server": "file:///D:/Trabajos/FloreriaTapti/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
