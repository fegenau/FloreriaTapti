import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent, f as renderHead, e as renderSlot } from './astro/server_BMt-k9YQ.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */

const $$Astro$4 = createAstro();
const $$Door = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Door;
  const { side, id } = Astro2.props;
  const isLeft = side === "left";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(id, "id")}${addAttribute(`w-1/2 h-full relative bg-[#F2F4CB] border-${isLeft ? "r" : "l"} border-[#D8DAB0] transform-style-3d transition-transform duration-1000 ease-in-out origin-${isLeft ? "left" : "right"}`, "class")} data-astro-cid-b2ckg2dw> <!-- Marco exterior de la puerta --> <div class="absolute inset-0 border-[12px] border-[#F2F4CB] bg-[#F2F4CB] shadow-2xl" data-astro-cid-b2ckg2dw> <!-- Panel de vidrio principal --> <div class="absolute inset-2 bg-black/60 backdrop-blur-[1px] border border-black/20 overflow-hidden shadow-inner" data-astro-cid-b2ckg2dw> <!-- Reflejo del vidrio (Glossy) --> <div class="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent opacity-40 pointer-events-none" data-astro-cid-b2ckg2dw></div> <!-- Marco interior del vidrio --> <div class="absolute inset-0 border-[16px] border-[#F2F4CB]" data-astro-cid-b2ckg2dw></div> <!-- Divisiones de la ventana (Grid) --> <div class="absolute inset-0 flex flex-col" data-astro-cid-b2ckg2dw> <div class="flex-1 border-b-[8px] border-[#F2F4CB]" data-astro-cid-b2ckg2dw></div> <div class="flex-1 border-b-[8px] border-[#F2F4CB]" data-astro-cid-b2ckg2dw></div> <div class="flex-1" data-astro-cid-b2ckg2dw></div> </div> <!-- Zócalo inferior --> <div class="absolute bottom-0 left-0 right-0 h-32 bg-[#F2F4CB] border-t-[8px] border-[#E2E4BB] flex items-center justify-center" data-astro-cid-b2ckg2dw> <div class="w-2/3 h-16 border border-[#D8DAB0]/30 bg-[#F2F4CB] shadow-inner" data-astro-cid-b2ckg2dw></div> </div> </div> <!-- Manija (Handle) --> <div${addAttribute(`absolute top-1/2 ${isLeft ? "right-6" : "left-6"} -translate-y-1/2 flex flex-col items-center z-20`, "class")} data-astro-cid-b2ckg2dw> <!-- Base de la manija --> <div class="w-2 h-32 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-full shadow-lg border border-amber-900/50" data-astro-cid-b2ckg2dw></div> <!-- Soportes --> <div class="absolute top-2 w-4 h-4 bg-amber-800 rounded-full shadow-md -z-10" data-astro-cid-b2ckg2dw></div> <div class="absolute bottom-2 w-4 h-4 bg-amber-800 rounded-full shadow-md -z-10" data-astro-cid-b2ckg2dw></div> </div> <!-- Placa de empujar/tirar (Decorativa) --> <div${addAttribute(`absolute top-[45%] ${isLeft ? "right-16" : "left-16"} w-12 h-24 border border-[#D8DAB0]/40 opacity-40`, "class")} data-astro-cid-b2ckg2dw></div> </div> </div> `;
}, "D:/Trabajos/FloreriaTapti/src/components/Door.astro", void 0);

const $$Astro$3 = createAstro();
const $$SideWindow = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$SideWindow;
  const { side } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="h-full w-full relative bg-[#F2F4CB] border-r border-l border-[#D8DAB0] overflow-hidden"> <!-- Marco superior --> <div class="absolute top-0 left-0 right-0 h-4 bg-[#E2E4BB] z-10"></div> <!-- Vidrio --> <div class="absolute inset-2 bg-black/60 backdrop-blur-[1px] border border-black/20 shadow-inner"> <!-- Reflejo diagonal --> <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40"></div> <!-- Divisiones del vidrio (Muntins) --> <div class="absolute top-1/3 left-0 right-0 h-[1px] bg-[#D8DAB0]/50 shadow-sm"></div> <div class="absolute top-2/3 left-0 right-0 h-[1px] bg-[#D8DAB0]/50 shadow-sm"></div> <!-- Decoración interior (simulada) --> <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div> </div> <!-- Marco inferior (Zócalo) --> <div class="absolute bottom-0 left-0 right-0 h-16 bg-[#F2F4CB] border-t border-[#D8DAB0] z-10 flex items-center justify-center"> <div class="w-3/4 h-[1px] bg-[#D8DAB0]/50"></div> </div> </div>`;
}, "D:/Trabajos/FloreriaTapti/src/components/SideWindow.astro", void 0);

const $$DoorsContainer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative w-full h-full flex justify-center items-center perspective-container" data-astro-cid-sa6t3oet> <!-- Fachada de la tienda --> <div class="relative flex items-end shadow-2xl" style="width: 90vw; max-width: 1200px; height: 85vh;" data-astro-cid-sa6t3oet> <!-- Ventana Izquierda (20%) --> <div class="h-full w-1/5" data-astro-cid-sa6t3oet> ${renderComponent($$result, "SideWindow", $$SideWindow, { "side": "left", "data-astro-cid-sa6t3oet": true })} </div> <!-- Puertas Centrales (60%) --> <div class="w-3/5 h-full relative flex transform-style-3d z-20" data-astro-cid-sa6t3oet> <!-- Puerta izquierda --> ${renderComponent($$result, "Door", $$Door, { "side": "left", "id": "door-left", "data-astro-cid-sa6t3oet": true })} <!-- Puerta derecha --> ${renderComponent($$result, "Door", $$Door, { "side": "right", "id": "door-right", "data-astro-cid-sa6t3oet": true })} </div> <!-- Ventana Derecha (20%) --> <div class="h-full w-1/5" data-astro-cid-sa6t3oet> ${renderComponent($$result, "SideWindow", $$SideWindow, { "side": "right", "data-astro-cid-sa6t3oet": true })} </div> <!-- Sombras de piso --> <div class="absolute -bottom-4 left-0 right-0 h-4 bg-black/40 blur-lg rounded-[50%]" data-astro-cid-sa6t3oet></div> </div> </div> `;
}, "D:/Trabajos/FloreriaTapti/src/components/DoorsContainer.astro", void 0);

const $$Astro$2 = createAstro();
const $$EntranceLogo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$EntranceLogo;
  const { showClickIndicator = true } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="logo-reveal" class="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-1000 z-50"> <div class="text-center bg-black/40 backdrop-blur-md rounded-lg px-12 py-8 border border-tapti-gold/30 shadow-2xl"> <!-- Logo Imagen --> <div class="mb-6"> <img src="/images/logo-tapti.png" alt="Tapti Flores y Regalos" class="w-64 md:w-80 h-auto object-contain drop-shadow-2xl filter brightness-110"> </div> <!-- Indicador de click más elegante --> ${showClickIndicator && renderTemplate`<div class="mt-6"> <p class="text-sm text-tapti-ivory/90 animate-pulse font-light tracking-wide">
Haz click para entrar
</p> <div class="flex justify-center mt-3"> <div class="w-8 h-8 border-2 border-tapti-gold/50 rounded-full flex items-center justify-center animate-pulse"> <span class="text-tapti-gold text-lg">↗</span> </div> </div> </div>`} </div> </div>`;
}, "D:/Trabajos/FloreriaTapti/src/components/EntranceLogo.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$EntranceAnimation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", `<div id="entrance-animation" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 cursor-pointer perspective-container" style="background-image: url('/loading-bg3.png'); background-size: cover; background-position: center;" data-astro-cid-5szvec7l> `, " ", ' </div> <script>\n  if (sessionStorage.getItem("tapti_intro_shown")) {\n    const el = document.getElementById("entrance-animation");\n    if (el) el.style.display = "none";\n  }\n<\/script>  '])), maybeRenderHead(), renderComponent($$result, "DoorsContainer", $$DoorsContainer, { "data-astro-cid-5szvec7l": true }), renderComponent($$result, "EntranceLogo", $$EntranceLogo, { "data-astro-cid-5szvec7l": true }));
}, "D:/Trabajos/FloreriaTapti/src/components/EntranceAnimation.astro", void 0);

const $$FloatingNav = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-midnight-violet-950/80 backdrop-blur-md border border-honey-bronze-500/20 rounded-full px-6 py-3 shadow-2xl hidden md:block"> <div class="flex items-center space-x-6"> <!-- Logo --> <a href="/" class="font-serif text-xl text-honey-bronze-400 hover:text-honey-bronze-300 transition-colors">
Tapti
</a> <!-- Separador --> <div class="w-px h-6 bg-honey-bronze-500/30"></div> <!-- Links de navegación --> <div class="flex items-center space-x-4"> <a href="/catalogo" class="text-sm text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors px-3 py-1 rounded-full hover:bg-honey-bronze-500/10">
Catálogo
</a> <a href="/membresias" class="text-sm text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors px-3 py-1 rounded-full hover:bg-honey-bronze-500/10">
Membresías
</a> <a href="/sobre" class="text-sm text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors px-3 py-1 rounded-full hover:bg-honey-bronze-500/10">
Sobre
</a> <a href="/contacto" class="text-sm text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors px-3 py-1 rounded-full hover:bg-honey-bronze-500/10">
Contacto
</a> <div class="w-px h-4 bg-honey-bronze-500/30 mx-2"></div> <a href="/carrito" id="cart-btn-desktop" class="text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors p-2 rounded-full hover:bg-honey-bronze-500/10 relative"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="9" cy="21" r="1"></circle> <circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> <span id="cart-count-desktop" class="absolute -top-1 -right-1 bg-honey-bronze-500 text-midnight-violet-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span> </a> </div> </div> </nav>  <!-- Versión móvil --> <div class="md:hidden fixed bottom-6 left-6 right-6 z-40 bg-midnight-violet-950/90 backdrop-blur-md border border-honey-bronze-500/20 rounded-2xl p-4 shadow-2xl"> <div class="grid grid-cols-5 gap-2"> <a href="/catalogo" class="text-center py-2 text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors"> <div class="text-lg mb-1">🌸</div> <span class="text-xs">Catálogo</span> </a> <a href="/membresias" class="text-center py-2 text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors"> <div class="text-lg mb-1">💎</div> <span class="text-xs">Membresías</span> </a> <a href="/sobre" class="text-center py-2 text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors"> <div class="text-lg mb-1">🌿</div> <span class="text-xs">Sobre</span> </a> <a href="/contacto" class="text-center py-2 text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors"> <div class="text-lg mb-1">📞</div> <span class="text-xs">Contacto</span> </a> <a href="/carrito" id="cart-btn-mobile" class="text-center py-2 text-cherry-blossom-100 hover:text-honey-bronze-400 transition-colors relative"> <div class="text-lg mb-1 flex justify-center"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="9" cy="21" r="1"></circle> <circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> </div> <span class="text-xs">Carrito</span> <span id="cart-count-mobile" class="absolute top-1 right-2 bg-honey-bronze-500 text-midnight-violet-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span> </a> </div> </div>`;
}, "D:/Trabajos/FloreriaTapti/src/components/FloatingNav.astro", void 0);

const $$Astro$1 = createAstro();
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "D:/Trabajos/FloreriaTapti/node_modules/astro/components/ViewTransitions.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Tapti Flores y Regalos",
    hideHeader = false,
    hideFooter = false,
    showEntrance = false
  } = Astro2.props;
  return renderTemplate`<html lang="es" class="h-full" data-astro-cid-dmqsi53g> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${renderComponent($$result, "ViewTransitions", $$ViewTransitions, { "data-astro-cid-dmqsi53g": true })}${renderHead()}</head> <body${addAttribute(`min-h-screen bg-white text-gray-900 ${showEntrance ? "overflow-hidden" : "overflow-visible"}`, "class")} data-astro-cid-dmqsi53g> ${showEntrance && renderTemplate`${renderComponent($$result, "EntranceAnimation", $$EntranceAnimation, { "data-astro-cid-dmqsi53g": true })}`} <div id="main-content"${addAttribute(showEntrance ? "opacity-0 transition-opacity duration-1000" : "opacity-100", "class")} data-astro-cid-dmqsi53g>  ${renderComponent($$result, "FloatingNav", $$FloatingNav, { "data-astro-cid-dmqsi53g": true })} <main${addAttribute(hideHeader ? "min-h-screen" : "min-h-[70vh]", "class")} data-astro-cid-dmqsi53g> ${renderSlot($$result, $$slots["default"])} </main> ${!hideFooter && renderTemplate`<footer class="border-t border-white/10" data-astro-cid-dmqsi53g> <div class="max-w-6xl mx-auto px-4 py-8 text-sm flex items-center justify-between" data-astro-cid-dmqsi53g> <p data-astro-cid-dmqsi53g>© ${(/* @__PURE__ */ new Date()).getFullYear()} Tapti Flores y Regalos</p> <a href="https://wa.me/56900000000" class="hover:text-tapti-gold" data-astro-cid-dmqsi53g>
WhatsApp
</a> </div> </footer>`} </div>  </body> </html>`;
}, "D:/Trabajos/FloreriaTapti/src/components/Layout.astro", void 0);

export { $$Layout as $ };
