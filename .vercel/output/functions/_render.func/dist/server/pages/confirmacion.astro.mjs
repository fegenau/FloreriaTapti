/* empty css                                   */
import { e as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CZQ_ue84.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9WWbt9a.mjs';
export { renderers } from '../renderers.mjs';

const $$Confirmacion = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gracias por tu compra" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-3xl mx-auto px-4 py-20 text-center"> <h1 class="font-serif text-4xl text-tapti-gold">¡Gracias por tu compra!</h1> <p class="mt-4">Te contactaremos por WhatsApp para coordinar la entrega.</p> <a href="/catalogo" class="mt-8 inline-block px-6 py-3 rounded-full border border-white/20">Seguir comprando</a> </section> ` })}`;
}, "D:/Trabajos/FloreriaTapti/src/pages/confirmacion.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/confirmacion.astro";
const $$url = "/confirmacion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Confirmacion,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
