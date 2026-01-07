import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import './chunks/astro-designed-error-pages_SbADnSNn.mjs';
import 'es-module-lexer';
import { g as decodeKey } from './chunks/astro/server_BMt-k9YQ.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DczvyIIt.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Trabajos/FloreriaTapti/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/mp/create-preapproval","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/mp\\/create-preapproval\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"mp","dynamic":false,"spread":false}],[{"content":"create-preapproval","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/mp/create-preapproval.ts","pathname":"/api/mp/create-preapproval","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/mp/create-preference","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/mp\\/create-preference\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"mp","dynamic":false,"spread":false}],[{"content":"create-preference","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/mp/create-preference.ts","pathname":"/api/mp/create-preference","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/mp/webhook","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/mp\\/webhook\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"mp","dynamic":false,"spread":false}],[{"content":"webhook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/mp/webhook.ts","pathname":"/api/mp/webhook","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/orders/create","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/orders\\/create\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/orders/create.ts","pathname":"/api/orders/create","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/validate-address","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/validate-address\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"validate-address","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/validate-address.ts","pathname":"/api/validate-address","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DcdQ7ycd.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/carrito","isIndex":false,"type":"page","pattern":"^\\/carrito\\/?$","segments":[[{"content":"carrito","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/carrito.astro","pathname":"/carrito","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Bxw5rpTE.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/catalogo","isIndex":false,"type":"page","pattern":"^\\/catalogo\\/?$","segments":[[{"content":"catalogo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/catalogo.astro","pathname":"/catalogo","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BYdrvtP8.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/confirmacion","isIndex":false,"type":"page","pattern":"^\\/confirmacion\\/?$","segments":[[{"content":"confirmacion","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/confirmacion.astro","pathname":"/confirmacion","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BYdrvtP8.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/contacto","isIndex":false,"type":"page","pattern":"^\\/contacto\\/?$","segments":[[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacto.astro","pathname":"/contacto","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BdMo13L4.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/membresias","isIndex":false,"type":"page","pattern":"^\\/membresias\\/?$","segments":[[{"content":"membresias","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/membresias.astro","pathname":"/membresias","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.N7PQdfDs.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/producto/[slug]","isIndex":false,"type":"page","pattern":"^\\/producto\\/([^/]+?)\\/?$","segments":[[{"content":"producto","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/producto/[slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BYdrvtP8.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/sobre","isIndex":false,"type":"page","pattern":"^\\/sobre\\/?$","segments":[[{"content":"sobre","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sobre.astro","pathname":"/sobre","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BYdrvtP8.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"}],"routeData":{"route":"/webpay/return","isIndex":false,"type":"page","pattern":"^\\/webpay\\/return\\/?$","segments":[[{"content":"webpay","dynamic":false,"spread":false}],[{"content":"return","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/webpay/return.astro","pathname":"/webpay/return","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BYdrvtP8.js"}],"styles":[{"type":"external","src":"/_astro/carrito.CfiZxJB4.css"},{"type":"inline","content":"#floating-whatsapp[data-astro-cid-ce2tfxup]{transition:transform .2s ease-out,opacity .3s ease}#floating-whatsapp[data-astro-cid-ce2tfxup]:hover{filter:drop-shadow(0 10px 20px rgba(34,197,94,.3))}.line-clamp-2[data-astro-cid-gldrxsg7]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Trabajos/FloreriaTapti/src/pages/carrito.astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/catalogo.astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/confirmacion.astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/contacto.astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/membresias.astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/producto/[slug].astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/sobre.astro",{"propagation":"none","containsHead":true}],["D:/Trabajos/FloreriaTapti/src/pages/webpay/return.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/mp/create-preapproval@_@ts":"pages/api/mp/create-preapproval.astro.mjs","\u0000@astro-page:src/pages/api/mp/create-preference@_@ts":"pages/api/mp/create-preference.astro.mjs","\u0000@astro-page:src/pages/api/mp/webhook@_@ts":"pages/api/mp/webhook.astro.mjs","\u0000@astro-page:src/pages/api/orders/create@_@ts":"pages/api/orders/create.astro.mjs","\u0000@astro-page:src/pages/api/validate-address@_@ts":"pages/api/validate-address.astro.mjs","\u0000@astro-page:src/pages/carrito@_@astro":"pages/carrito.astro.mjs","\u0000@astro-page:src/pages/catalogo@_@astro":"pages/catalogo.astro.mjs","\u0000@astro-page:src/pages/confirmacion@_@astro":"pages/confirmacion.astro.mjs","\u0000@astro-page:src/pages/contacto@_@astro":"pages/contacto.astro.mjs","\u0000@astro-page:src/pages/membresias@_@astro":"pages/membresias.astro.mjs","\u0000@astro-page:src/pages/producto/[slug]@_@astro":"pages/producto/_slug_.astro.mjs","\u0000@astro-page:src/pages/sobre@_@astro":"pages/sobre.astro.mjs","\u0000@astro-page:src/pages/webpay/return@_@astro":"pages/webpay/return.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","D:/Trabajos/FloreriaTapti/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_CCFHABrQ.mjs","D:/Trabajos/FloreriaTapti/src/data/products.json":"chunks/products_Dw2qlidN.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.DcdQ7ycd.js","/astro/hoisted.js?q=1":"_astro/hoisted.Bxw5rpTE.js","/astro/hoisted.js?q=2":"_astro/hoisted.BdMo13L4.js","/astro/hoisted.js?q=3":"_astro/hoisted.N7PQdfDs.js","/astro/hoisted.js?q=4":"_astro/hoisted.BYdrvtP8.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/carrito.CfiZxJB4.css","/loading-bg.jpg","/loading-bg2.jpg","/loading-bg3.png","/images/Banner.jpg","/images/logo-tapti.png","/images/ramo1.jpg","/images/ramo1.webp","/images/ramo2.avif","/images/ramo2.jpg","/_astro/hoisted.BdMo13L4.js","/_astro/hoisted.Bxw5rpTE.js","/_astro/hoisted.BYdrvtP8.js","/_astro/hoisted.DcdQ7ycd.js","/_astro/hoisted.N7PQdfDs.js","/_astro/SubscriptionForm.astro_astro_type_script_index_0_lang.COu2bso5.js","/images/Flores/Armando.png","/images/Flores/Condolencias.jpeg","/images/Flores/Astromelia Lilium/Astromelia Lilium.png","/images/Flores/Astromelias Surtidas/Astromelias Surtidas1.PNG","/images/Flores/Canastos/canasto niñas.png","/images/Flores/Canastos/canasto niño.png","/images/Flores/Coloridos gerberas/Coloridos gerberas.png","/images/Flores/Coloridos gerberas/Ramo Girasoles y Gerberas 2.PNG","/images/Flores/Colorido calido/Colorido calido.png","/images/Flores/Colorido calido/Ramo colorido 2.PNG","/images/Flores/Colorido calido/Ramo colorido.mp4","/images/Flores/Girasol rosado/Girasol rosado.png","/images/Flores/Girasol rosado/Ramo Girasoles y claveles 3.PNG","/images/Flores/Girasoles clasico/Girasoles clasico.png","/images/Flores/Girasoles clasico/Ramo girasoles clásico.PNG","/images/Flores/Graduaciones/Caja Birrete 2.PNG","/images/Flores/Graduaciones/Caja Birrete 3.PNG","/images/Flores/Graduaciones/Caja Birrete.PNG","/images/Flores/Graduaciones/colorido S.PNG","/images/Flores/Graduaciones/colorido.PNG","/images/Flores/Graduaciones/Girasol Clásico S 2.PNG","/images/Flores/Graduaciones/Girasol Clásico S.PNG","/images/Flores/Graduaciones/girasoles y clavel.PNG","/images/Flores/Graduaciones/IMG_0163.PNG","/images/Flores/Graduaciones/IMG_0166.PNG","/images/Flores/Graduaciones/IMG_0167.PNG","/images/Flores/Graduaciones/IMG_0168.PNG","/images/Flores/Graduaciones/pink 2.PNG","/images/Flores/Graduaciones/pink.PNG","/images/Flores/Hortensias lisianthus celestes/Hortensias lisianthus celestes.png","/images/Flores/Hortensias lisianthus celestes/Ramo Hortensias y lisianthus 2.PNG","/images/Flores/Hortensias minirosas/Hortensias minirosas.png","/images/Flores/Hortensias minirosas/Ramo Hortensias y lisianthus rosado.PNG","/images/Flores/Pastel nude/Pastel nude.png","/images/Flores/Gerberas pastel/Gerberas pastel.png","/images/Flores/Ramo novia/Ramo Novia rosa-damasco.jpg","/images/Flores/Ramo novia/Ramo novia rosas-Peonías 2.jpg","/images/Flores/Rosas rojas/Rosas rojas.jpeg","/images/Flores/Rosas rosadas/Rosas rosadas 2.PNG","/images/Flores/Rosas rosadas/Rosas rosadas.PNG","/images/Flores/Tulipanes/Tulipanes 2.PNG","/images/Flores/Tulipanes/Tulipanes.jpeg"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"dmfLxCkI+A7rcJLG3sH9movVxRuuFyUD3lQ2IY8keIs=","experimentalEnvGetSecretEnabled":false});

export { manifest };
