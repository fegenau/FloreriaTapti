/* empty css                                   */
import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BMt-k9YQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_CBWgi9Oy.mjs';
import { $ as $$BoutiqueCard } from '../chunks/BoutiqueCard_B1XAydSN.mjs';
export { renderers } from '../renderers.mjs';

const $$Sobre = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sobre Tapti" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 py-12"> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "services", "size": "large", "className": "!h-auto min-h-[70vh] p-8" }, { "default": ($$result3) => renderTemplate` <div class="space-y-4"> <h1 class="font-serif text-3xl text-tapti-gold">Sobre Tapti</h1> <p class="text-white/80">
Florería moderna, regalos personalizados auténticos y elegantes. Aquí
          va el texto de marca de 100–150 palabras.
</p> </div> ` })} </div> ` })}`;
}, "D:/Trabajos/FloreriaTapti/src/pages/sobre.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/sobre.astro";
const $$url = "/sobre";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sobre,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
