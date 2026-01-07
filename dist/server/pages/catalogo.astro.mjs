/* empty css                                   */
import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BMt-k9YQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_CBWgi9Oy.mjs';
import { $ as $$BoutiqueCard } from '../chunks/BoutiqueCard_B1XAydSN.mjs';
import { $ as $$SubscriptionForm } from '../chunks/SubscriptionForm_B6PcKC_z.mjs';
import { c as catalogData } from '../chunks/catalog_CMf3dlVN.mjs';
export { renderers } from '../renderers.mjs';

const $$Catalogo = createComponent(($$result, $$props, $$slots) => {
  const products = catalogData.flowers;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cat\xE1logo Completo | Tapti" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen pt-24 pb-12 px-4"> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "services", "size": "large", "className": "!h-auto min-h-[70vh] p-8 max-w-7xl mx-auto", "disableAnimation": true }, { "default": ($$result3) => renderTemplate` <div class="mb-16 text-center"> <h2 class="font-serif text-3xl text-honey-bronze-100 mb-6">
Suscripciones Florales
</h2> <p class="text-white/80 mb-8 max-w-2xl mx-auto">
Recibe flores frescas en tu casa cada 15 o 30 días. Olvídate de
          comprar, nosotros nos encargamos de mantener tu hogar siempre florido.
</p> <button id="open-subscription-modal" class="bg-honey-bronze-500 hover:bg-honey-bronze-400 text-midnight-violet-950 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
Suscribirme Ahora
</button> </div> <h1 class="font-serif text-4xl text-honey-bronze-400 mb-8 text-center border-t border-white/10 pt-12">
Catálogo de Flores
</h1> <div class="flex flex-wrap justify-center gap-4 mb-12"> <button class="tab-btn px-6 py-2 rounded-full border border-honey-bronze-500 text-honey-bronze-400 hover:bg-honey-bronze-500 hover:text-midnight-violet-950 transition-all duration-300 bg-honey-bronze-500/10 active-tab" data-category="all">
Todos
</button> <button class="tab-btn px-6 py-2 rounded-full border border-honey-bronze-500 text-honey-bronze-400 hover:bg-honey-bronze-500 hover:text-midnight-violet-950 transition-all duration-300" data-category="Matrimonio">
Matrimonio
</button> <button class="tab-btn px-6 py-2 rounded-full border border-honey-bronze-500 text-honey-bronze-400 hover:bg-honey-bronze-500 hover:text-midnight-violet-950 transition-all duration-300" data-category="Graduaciones">
Graduaciones
</button> <button class="tab-btn px-6 py-2 rounded-full border border-honey-bronze-500 text-honey-bronze-400 hover:bg-honey-bronze-500 hover:text-midnight-violet-950 transition-all duration-300" data-category="Canastos">
Canastos
</button> </div> <div id="catalog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 min-h-[50vh]"> ${products.map((product) => renderTemplate`<div class="catalog-item bg-white/5 p-6 rounded-lg border border-white/10 hover:border-honey-bronze-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-white/10 group relative"${addAttribute(product.category || "Canastos", "data-category")}> <h2 class="font-serif text-2xl text-honey-bronze-100 mb-4"> ${product.name} </h2>  <div class="relative h-64 overflow-hidden rounded-lg cursor-pointer group/carousel"${addAttribute(JSON.stringify(
    product.image.length > 1 ? product.image : [product.image[0], product.image[0]]
  ), "data-images")}${addAttribute(product.name, "data-name")}>  <div class="carousel-track flex h-full transition-transform duration-700 ease-in-out">  <img${addAttribute(product.image[0], "src")}${addAttribute(product.name, "alt")} class="w-full h-full object-cover flex-shrink-0">  <img${addAttribute(product.image[1] || product.image[0], "src")}${addAttribute(`${product.name} alt`, "alt")} class="w-full h-full object-cover flex-shrink-0"> </div>  <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity"> <div class="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div> <div class="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm"></div> </div> </div> <div class="space-y-4 mt-6"> <div class="flex justify-between text-sm text-cherry-blossom-100 border-b border-white/10 pb-2"> <span>Tamaño</span> <span>Varas</span> <span>Precio</span> </div> ${Object.entries(product.sizes).map(([size, details]) => {
    if (!details) return null;
    return renderTemplate`<div class="flex justify-between items-center text-gray-300"> <span class="font-medium text-honey-bronze-400"> ${size} </span> <span>${details.qty}</span> <div class="flex items-center gap-3"> <span class="font-bold">
$${details.total.toLocaleString("es-CL")} </span> <button class="decrease-cart-btn hidden bg-honey-bronze-500 hover:bg-honey-bronze-400 text-midnight-violet-950 rounded-full p-1 transition-colors"${addAttribute(JSON.stringify(product), "data-product")}${addAttribute(size, "data-size")} title="Quitar del carrito"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> </button> <button class="add-to-cart-btn bg-honey-bronze-500 hover:bg-honey-bronze-400 text-midnight-violet-950 rounded-full p-1 transition-colors"${addAttribute(JSON.stringify(product), "data-product")}${addAttribute(size, "data-size")}${addAttribute(details.total, "data-price")} title="Agregar al carrito"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> </button> </div> </div>`;
  })} </div> <div class="mt-6 pt-4 border-t border-white/10"> <p class="text-xs text-gray-400 mb-2">Composición:</p> <div class="min-h-20 h-auto bg-black/20 rounded p-2 text-sm text-white italic">  ${product.Description} </div> </div> </div>`)} </div> ` })}  <div id="subscription-modal" class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4"> <div class="relative w-full max-w-lg"> <button id="close-subscription-modal" class="absolute -top-4 -right-4 z-50 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button> ${renderComponent($$result2, "SubscriptionForm", $$SubscriptionForm, {})} </div> </div>  <div id="lightbox" class="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md opacity-0 invisible transition-all duration-300 flex items-center justify-center p-4">  <button id="lightbox-close" class="absolute top-4 right-4 z-[210] text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button>  <div class="relative w-full max-w-5xl h-[85vh] flex items-center justify-center">  <button id="lightbox-prev" class="absolute left-0 md:-left-12 p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all hidden md:block"> <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg> </button>  <div class="relative h-full w-full flex items-center justify-center overflow-hidden"> <img id="lightbox-img" src="" class="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 cursor-pointer" alt="Lightbox view" title="Click para ver siguiente imagen">  <div class="absolute bottom-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm"> <span id="lightbox-current">1</span> / <span id="lightbox-total">2</span> </div> </div>  <button id="lightbox-next" class="absolute right-0 md:-right-12 p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all hidden md:block"> <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg> </button> </div> </div> </div> ` })} 
\`\`\``;
}, "D:/Trabajos/FloreriaTapti/src/pages/catalogo.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/catalogo.astro";
const $$url = "/catalogo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Catalogo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
