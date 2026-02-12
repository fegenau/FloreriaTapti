/* empty css                                   */
import { e as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead, k as renderScript } from '../chunks/astro/server_CZQ_ue84.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9WWbt9a.mjs';
import { $ as $$BoutiqueCard } from '../chunks/BoutiqueCard_CmaMCsFM.mjs';
import { $ as $$SubscriptionForm } from '../chunks/SubscriptionForm_CT_2lTQR.mjs';
export { renderers } from '../renderers.mjs';

const $$Membresias = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Membres\xEDas \u2014 Tapti" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-6xl mx-auto px-4 py-12"> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "services", "size": "large", "className": "!h-auto min-h-[70vh] p-8" }, { "default": ($$result3) => renderTemplate` <h1 class="font-serif text-3xl mb-2 text-honey-bronze-100">
Membresías Tapti
</h1> <p class="text-white/80 mb-8">
Recibe un ramo Tapti cada 15 o 30 días. Cancela cuando quieras.
</p> <div class="grid md:grid-cols-2 gap-6"> <div class="p-6 rounded-2xl border border-white/10 bg-white/5"> <h2 class="font-serif text-2xl text-honey-bronze-100">Quincenal</h2> <p class="text-sm opacity-90 text-gray-300">Entrega cada 15 días</p> <div class="text-3xl font-serif mt-4 text-white">$20.000 CLP</div> <button class="open-subscription-btn mt-6 px-6 py-3 rounded-full bg-honey-bronze-500 hover:bg-honey-bronze-400 text-midnight-violet-950 font-bold transition-transform hover:scale-105" data-duration="15">Suscribirme</button> </div> <div class="p-6 rounded-2xl border border-white/10 bg-white/5"> <h2 class="font-serif text-2xl text-honey-bronze-100">Mensual</h2> <p class="text-sm opacity-90 text-gray-300">Entrega cada 30 días</p> <div class="text-3xl font-serif mt-4 text-white">$15.000 CLP</div> <button class="open-subscription-btn mt-6 px-6 py-3 rounded-full bg-honey-bronze-500 hover:bg-honey-bronze-400 text-midnight-violet-950 font-bold transition-transform hover:scale-105" data-duration="30">Suscribirme</button> </div> </div> ` })}  <div id="subscription-modal" class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4"> <div class="relative w-full max-w-lg"> <button id="close-subscription-modal" class="absolute -top-4 -right-4 z-50 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button> ${renderComponent($$result2, "SubscriptionForm", $$SubscriptionForm, {})} </div> </div> </div> ${renderScript($$result2, "D:/Trabajos/FloreriaTapti/src/pages/membresias.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "D:/Trabajos/FloreriaTapti/src/pages/membresias.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/membresias.astro";
const $$url = "/membresias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Membresias,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
