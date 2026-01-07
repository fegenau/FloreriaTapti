/* empty css                                      */
import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BMt-k9YQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_CBWgi9Oy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Return = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Return;
  const token = Astro2.url.searchParams.get("token_ws");
  let status = "error";
  let message = "Error en la transacci\xF3n.";
  if (token) {
    status = "pending";
    message = "Transacci\xF3n simulada (Transbank desactivado).";
  } else {
    if (Astro2.url.searchParams.get("TBK_TOKEN")) {
      status = "aborted";
      message = "Anulaste la compra.";
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Estado del Pago | Tapti" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center p-4"> <div class="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl max-w-md w-full text-center"> ${status === "success" ? renderTemplate`<div class="text-green-400 mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h1 class="text-3xl font-bold">¡Pago Exitoso!</h1> </div>` : renderTemplate`<div class="text-red-400 mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h1 class="text-3xl font-bold">Algo salió mal</h1> </div>`} <p class="text-white/80 text-lg mb-8">${message}</p> <a href="/catalogo" class="bg-honey-bronze-500 hover:bg-honey-bronze-400 text-midnight-violet-950 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
Volver al Catálogo
</a> </div> </div> ` })}`;
}, "D:/Trabajos/FloreriaTapti/src/pages/webpay/return.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/webpay/return.astro";
const $$url = "/webpay/return";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Return,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
