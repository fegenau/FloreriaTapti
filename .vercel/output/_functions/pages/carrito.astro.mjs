/* empty css                                   */
import { e as createComponent, f as createAstro, m as maybeRenderHead, k as renderScript, h as addAttribute, r as renderTemplate, l as renderComponent } from '../chunks/astro/server_CZQ_ue84.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9WWbt9a.mjs';
import { $ as $$BoutiqueCard } from '../chunks/BoutiqueCard_CmaMCsFM.mjs';
import 'clsx';
import { c as catalogData } from '../chunks/catalog_Emdk47vd.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$AccessoriesModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AccessoriesModal;
  const { isOpen } = Astro2.props;
  const accessories = catalogData.accessories || [];
  return renderTemplate`${maybeRenderHead()}<div id="accessories-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300" aria-hidden="true"> <div class="bg-midnight-violet-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl transform scale-95 transition-transform duration-300"> <h2 class="text-2xl font-serif text-honey-bronze-100 mb-2 text-center">
¿Deseas agregar algo más?
</h2> <p class="text-gray-300 text-center mb-6">
Complementa tu regalo con estos detalles especiales.
</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"> ${accessories.map((item) => renderTemplate`<div class="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors"> <div class="w-20 h-20 bg-black/20 rounded-full mb-3 flex items-center justify-center overflow-hidden">  <span class="text-3xl">🎁</span> </div> <h3 class="font-medium text-honey-bronze-200 mb-1">${item.name}</h3> <p class="text-sm text-gray-400 mb-3">${item.description}</p> <p class="font-bold text-white mb-3">
$${item.price.toLocaleString("es-CL")} </p> <button class="btn-add-accessory px-4 py-2 bg-white/10 hover:bg-honey-bronze-500 hover:text-midnight-violet-950 rounded-full text-sm transition-all border border-white/20"${addAttribute(item.id, "data-id")}${addAttribute(item.name, "data-name")}${addAttribute(item.price, "data-price")}${addAttribute(item.image, "data-image")}>
Agregar
</button> </div>`)} </div> <div class="flex justify-end gap-3 pt-4 border-t border-white/10"> <button id="btn-skip-accessories" class="px-6 py-2 text-gray-400 hover:text-white transition-colors">
No, gracias
</button> <button id="btn-confirm-accessories" class="px-6 py-2 bg-honey-bronze-500 text-midnight-violet-950 rounded-lg hover:bg-honey-bronze-400 transition-colors font-bold">
Continuar al Pago
</button> </div> </div> </div> ${renderScript($$result, "D:/Trabajos/FloreriaTapti/src/components/AccessoriesModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Trabajos/FloreriaTapti/src/components/AccessoriesModal.astro", void 0);

const $$Carrito = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tu Carrito | Tapti" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen pt-24 pb-12 px-4"> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "services", "size": "large", "className": "!h-auto min-h-[60vh] p-8 max-w-4xl mx-auto" }, { "default": async ($$result3) => renderTemplate` <h1 class="font-serif text-4xl text-honey-bronze-400 mb-8 text-center">
Tu Carrito de Compras
</h1> <div id="cart-empty" class="hidden text-center py-12"> <p class="text-xl text-cherry-blossom-100 mb-6">
Tu carrito está vacío.
</p> <a href="/catalogo" class="inline-block px-6 py-2 bg-honey-bronze-500 text-midnight-violet-950 rounded-full hover:bg-honey-bronze-400 transition-colors font-medium">
Ir al Catálogo
</a> </div> <div id="cart-content" class="hidden"> <div class="space-y-4 mb-8" id="cart-items-container"> <!-- Items will be injected here --> </div> <div class="border-t border-white/10 pt-6 mt-8"> <div class="flex justify-between items-center text-2xl font-serif text-honey-bronze-100 mb-8"> <span>Total</span> <span id="cart-total">$0</span> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> <form id="form-checkout" class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-white/5 p-6 rounded-lg border border-white/10"> <h3 class="col-span-1 md:col-span-2 text-xl font-serif text-honey-bronze-100 mb-2">
Datos de Despacho
</h3> <div class="col-span-1 md:col-span-2 space-y-4"> <input type="text" name="name" placeholder="Nombre completo" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-honey-bronze-400 outline-none"> <p class="text-red-400 text-sm mt-1 hidden error-msg" id="error-name"></p> <input type="text" name="rut" id="input-rut" placeholder="RUT (12.345.678-9)" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-honey-bronze-400 outline-none"> <p class="text-red-400 text-sm mt-1 hidden error-msg" id="error-rut"></p> <input type="email" name="email" placeholder="Email" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-honey-bronze-400 outline-none"> <p class="text-red-400 text-sm mt-1 hidden error-msg" id="error-email"></p> <input type="tel" name="phone" placeholder="Teléfono (+569...)" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-honey-bronze-400 outline-none"> <p class="text-red-400 text-sm mt-1 hidden error-msg" id="error-phone"></p> <input type="text" name="commune" placeholder="Comuna" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-honey-bronze-400 outline-none"> <p class="text-red-400 text-sm mt-1 hidden error-msg" id="error-commune"></p> <input type="text" name="address" placeholder="Dirección calle/número" required class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-honey-bronze-400 outline-none"> <p class="text-red-400 text-sm mt-1 hidden error-msg" id="error-address"></p> <div class="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4"> <button type="button" id="btn-cancel" class="px-6 py-3 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/10 transition-colors">
Cancelar Compra
</button> <a href="/catalogo" class="px-6 py-3 border border-honey-bronze-500/50 text-honey-bronze-300 rounded-lg hover:bg-honey-bronze-500/10 transition-colors text-center">
Seguir comprando
</a> <button type="submit" class="px-6 py-3 bg-honey-bronze-500 text-midnight-violet-950 rounded-lg hover:bg-honey-bronze-400 transition-colors font-bold shadow-lg shadow-honey-bronze-500/20">
Ir a Pagar
</button> </div> </div> </form> </div> </div> </div> ` })} </div> ${renderComponent($$result2, "AccessoriesModal", $$AccessoriesModal, { "isOpen": false })} ${renderScript($$result2, "D:/Trabajos/FloreriaTapti/src/pages/carrito.astro?astro&type=script&index=0&lang.ts")} ` })}`;
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
