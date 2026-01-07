/* empty css                                      */
import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_BMt-k9YQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_CBWgi9Oy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const products = (await import('../../chunks/products_Dw2qlidN.mjs')).default;
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error("Producto no encontrado");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${product.name} \u2014 Tapti` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8"> <img${addAttribute(product.image, "src")}${addAttribute(product.name, "alt")} class="rounded-xl border border-white/10 w-full object-cover"> <div> <h1 class="font-serif text-3xl text-tapti-gold">${product.name}</h1> <p class="mt-2 text-white/80">${product.description}</p> <form id="addToCart" class="mt-6 space-y-4"> <div> <label class="block text-sm mb-1">Tamaño</label> <select name="size" class="bg-white/5 border border-white/10 rounded px-3 py-2 w-full"> ${product.sizes.map((s) => renderTemplate`<option${addAttribute(s.k, "value")}>${s.k} — $${s.price.toLocaleString("es-CL")}</option>`)} </select> </div> <div> <label class="block text-sm mb-1">Dedicatoria (opcional)</label> <input name="note" class="bg-white/5 border border-white/10 rounded px-3 py-2 w-full" placeholder="Con cariño..."> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm mb-1">Fecha de entrega</label> <input type="date" name="date" class="bg-white/5 border border-white/10 rounded px-3 py-2 w-full"> </div> <div> <label class="block text-sm mb-1">Comuna</label> <input name="comuna" class="bg-white/5 border border-white/10 rounded px-3 py-2 w-full" placeholder="Providencia"> </div> </div> <button type="submit" class="px-5 py-3 rounded-full bg-tapti-gold text-tapti-deep font-medium">Agregar al carrito</button> </form>  </div> </section> ` })}`;
}, "D:/Trabajos/FloreriaTapti/src/pages/producto/[slug].astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/producto/[slug].astro";
const $$url = "/producto/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
