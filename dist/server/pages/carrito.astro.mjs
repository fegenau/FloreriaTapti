/* empty css                                   */
import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BMt-k9YQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_CBWgi9Oy.mjs';
import { $ as $$BoutiqueCard } from '../chunks/BoutiqueCard_B1XAydSN.mjs';
export { renderers } from '../renderers.mjs';

const $$Carrito = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tu Carrito | Tapti" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen pt-24 pb-12 px-4"> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "services", "size": "large", "className": "!h-auto min-h-[60vh] p-8 max-w-4xl mx-auto" }, { "default": ($$result3) => renderTemplate` <h1 class="font-serif text-4xl text-honey-bronze-400 mb-8 text-center">
Tu Carrito de Compras
</h1> <div id="cart-empty" class="hidden text-center py-12"> <p class="text-xl text-cherry-blossom-100 mb-6">
Tu carrito está vacío.
</p> <a href="/catalogo" class="inline-block px-6 py-2 bg-honey-bronze-500 text-midnight-violet-950 rounded-full hover:bg-honey-bronze-400 transition-colors font-medium">
Ir al Catálogo
</a> </div> <div id="cart-content" class="hidden"> <div class="space-y-4 mb-8" id="cart-items-container"> <!-- Items will be injected here --> </div> <div class="border-t border-white/10 pt-6 mt-8"> <div class="flex justify-between items-center text-2xl font-serif text-honey-bronze-100 mb-8"> <span>Total</span> <span id="cart-total">$0</span> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> <button id="btn-cancel" class="px-6 py-3 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/10 transition-colors">
Cancelar Compra
</button> <a href="/catalogo" class="px-6 py-3 border border-honey-bronze-500/50 text-honey-bronze-300 rounded-lg hover:bg-honey-bronze-500/10 transition-colors text-center">
Modificar (Seguir comprando)
</a> <button id="btn-pay" class="px-6 py-3 bg-honey-bronze-500 text-midnight-violet-950 rounded-lg hover:bg-honey-bronze-400 transition-colors font-bold shadow-lg shadow-honey-bronze-500/20">
Ir a Pagar
</button> </div> </div> </div> ` })} </div> ` })} `;
}, "D:/Trabajos/FloreriaTapti/src/pages/carrito.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/carrito.astro";
const $$url = "/carrito";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Carrito,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
