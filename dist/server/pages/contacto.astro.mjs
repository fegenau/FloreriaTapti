/* empty css                                   */
import { e as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_JR3jxAAG.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CGBRDME9.mjs';
import { $ as $$BoutiqueCard } from '../chunks/BoutiqueCard_B3zIEEWi.mjs';
export { renderers } from '../renderers.mjs';

const $$Contacto = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contacto \u2014 Tapti" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 py-12"> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "services", "size": "large", "className": "!h-auto min-h-[70vh] p-8" }, { "default": ($$result3) => renderTemplate` <div class="space-y-4"> <h1 class="font-serif text-3xl text-tapti-gold">Contacto</h1> <p class="text-white/80">
Escríbenos por WhatsApp para pedidos personalizados.
</p> <a class="inline-block px-6 py-3 rounded-full bg-tapti-gold text-tapti-deep font-medium" href="https://wa.me/56900000000" target="_blank">Abrir WhatsApp</a> </div> ` })} </div> ` })}`;
}, "D:/Trabajos/FloreriaTapti/src/pages/contacto.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/contacto.astro";
const $$url = "/contacto";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contacto,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
