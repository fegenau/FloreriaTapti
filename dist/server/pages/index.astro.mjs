/* empty css                                   */
import { c as createComponent, m as maybeRenderHead, r as renderTemplate, a as createAstro, b as addAttribute, d as renderComponent } from '../chunks/astro/server_BMt-k9YQ.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_CBWgi9Oy.mjs';
import { $ as $$BoutiqueCard } from '../chunks/BoutiqueCard_B1XAydSN.mjs';
import 'clsx';
/* empty css                                 */
import { c as catalogData } from '../chunks/catalog_CMf3dlVN.mjs';
export { renderers } from '../renderers.mjs';

const $$FloatingWhatsApp = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="floating-whatsapp" class="fixed bottom-6 right-6 z-50 transition-all duration-300 opacity-80 hover:opacity-100" data-astro-cid-ce2tfxup> <a href="https://wa.me/56900000000" class="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group" aria-label="Contactar por WhatsApp" data-astro-cid-ce2tfxup> <!-- Ícono de WhatsApp --> <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-ce2tfxup> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" data-astro-cid-ce2tfxup></path> </svg> <!-- Tooltip --> <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-midnight-violet-950 text-cherry-blossom-50 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap" data-astro-cid-ce2tfxup>
¿Necesitas ayuda?
<div class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-midnight-violet-950" data-astro-cid-ce2tfxup></div> </div> </a> <!-- Indicador de pulso sutil --> <div class="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" data-astro-cid-ce2tfxup></div> </div> `;
}, "D:/Trabajos/FloreriaTapti/src/components/FloatingWhatsApp.astro", void 0);

const $$Astro$1 = createAstro();
const $$OccasionCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$OccasionCard;
  const { title, image, url, className = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(url, "href")}${addAttribute(`group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-midnight-violet-900/90 to-midnight-violet-800/90 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-2xl ${className}`, "class")}> <!-- Imagen de fondo --> <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"${addAttribute(`background-image: url(${image.replace(/ /g, "%20")})`, "style")}></div> <!-- Overlay gradiente --> <div class="absolute inset-0 bg-gradient-to-t from-midnight-violet-950/80 via-midnight-violet-900/40 to-transparent"></div> <!-- Contenido --> <div class="relative z-10 p-6 h-full flex flex-col justify-end min-h-[200px]"> <h3 class="font-serif text-xl lg:text-2xl text-cherry-blossom-50 mb-2 transform transition-transform duration-300 group-hover:translate-y-[-4px]"> ${title} </h3> <!-- Indicador de acción --> <div class="flex items-center text-honey-bronze-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> <span class="text-sm font-medium mr-2">Explorar</span> <svg class="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </div> </div> <!-- Brillo sutil al hover --> <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-700 bg-gradient-to-r from-transparent via-cherry-blossom-300/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div> </a>`;
}, "D:/Trabajos/FloreriaTapti/src/components/OccasionCard.astro", void 0);

const $$Astro = createAstro();
const $$InstagramFeed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$InstagramFeed;
  const { username = "tapti_regalo" } = Astro2.props;
  return renderTemplate`<!-- Sección de Instagram -->${maybeRenderHead()}<div class="px-4 md:px-6" data-astro-cid-gldrxsg7> <div class="max-w-7xl mx-auto" data-astro-cid-gldrxsg7> <div class="text-center mb-12" data-astro-cid-gldrxsg7> <h2 class="font-serif text-3xl md:text-4xl text-honey-bronze-400 mb-4" data-astro-cid-gldrxsg7>
Síguenos en Instagram
</h2> <p class="text-cherry-blossom-100 text-lg md:text-xl max-w-2xl mx-auto" data-astro-cid-gldrxsg7>
Descubre nuestras últimas creaciones y momentos especiales
</p> </div> <!-- Grid de publicaciones eliminado a petición del usuario --> <div class="mb-8" data-astro-cid-gldrxsg7></div> <!-- Botón para seguir en Instagram --> <div class="text-center" data-astro-cid-gldrxsg7> <a${addAttribute(`https://instagram.com/${username}`, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-base" data-astro-cid-gldrxsg7> <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gldrxsg7> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" data-astro-cid-gldrxsg7></path> </svg>
Seguir en Instagram
</a> </div> </div> </div> `;
}, "D:/Trabajos/FloreriaTapti/src/components/InstagramFeed.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const mainServices = [
    {
      title: "Ramos Personalizados",
      description: "Dise\xF1os \xFAnicos adaptados a tus gustos y ocasi\xF3n especial",
      image: "../images/Flores/Armando.png",
      url: "/contacto"
    },
    {
      title: "Eventos Especiales",
      description: "Bodas, cumplea\xF1os y celebraciones con arreglos florales \xFAnicos",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=500&fit=crop&crop=center",
      url: "/contacto"
    },
    {
      title: "Delivery Express",
      description: "Entrega el mismo d\xEDa en toda la ciudad. Sorprende en el momento perfecto",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop&crop=center",
      url: "/contacto"
    },
    {
      title: "Suscripciones",
      description: "Recibe flores frescas semanalmente. Perfecto para oficinas y hogares",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=500&fit=crop&crop=center",
      url: "/membresias"
    }
  ];
  const selectedIndices = [0, 8, 11, 10, 4, 6];
  const bestSellers = selectedIndices.map((index) => catalogData.flowers[index]).filter(Boolean);
  const specialOccasions = [
    {
      title: "Bodas y Aniversarios",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&crop=center",
      url: "/catalogo?ocasion=bodas"
    },
    {
      title: "Cumplea\xF1os",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop&crop=center",
      url: "/catalogo?ocasion=cumpleanos"
    },
    {
      title: "Condolencias",
      image: "../public/images/Flores/Condolencias.jpeg",
      url: "/catalogo?ocasion=condolencias"
    },
    {
      title: "San Valent\xEDn",
      image: "/images/Flores/Rosas rojas/Rosas rojas.jpeg",
      url: "/catalogo?ocasion=san-valentin"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tapti \u2014 Florer\xEDa Moderna, elegante y aut\xE9ntica", "hideHeader": true, "hideFooter": true, "showEntrance": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="min-h-screen pt-20 pb-24 space-y-6"> <!-- Hero Card Principal --> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "hero", "size": "hero", "background": "../../public/images/Banner.jpg", "className": "mx-4 md:mx-6" }, { "default": ($$result3) => renderTemplate` <div class="max-w-4xl pl-8 md:pl-16"> <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl text-honey-bronze-400 mb-6 leading-tight">
Tengo algo para ti
</h1> <p class="text-lg md:text-xl lg:text-2xl text-cherry-blossom-100 mb-8 leading-relaxed max-w-2xl">
Ramos elegantes y regalos personalizados, diseñados con la esencia
          única de Tapti
</p> <div class="flex flex-wrap gap-4"> <a href="/catalogo" class="px-10 py-5 bg-honey-bronze-500 text-midnight-violet-950 font-semibold rounded-full hover:bg-honey-bronze-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg relative z-10">
Explorar Catálogo
</a> <a href="/sobre" class="px-10 py-5 border-2 border-honey-bronze-500 text-honey-bronze-400 rounded-full hover:bg-honey-bronze-500 hover:text-midnight-violet-950 transition-all duration-300 text-lg relative z-10">
Nuestra Historia
</a> </div> </div> ` })} <!-- Ocasiones Especiales --> <div class="px-4 md:px-6"> <div class="max-w-7xl mx-auto"> <h2 class="font-serif text-3xl md:text-4xl text-honey-bronze-400 mb-8 text-center">
Te acompañamos en momentos especiales
</h2> <div class="grid grid-cols-2 lg:grid-cols-4 gap-4"> ${specialOccasions.map((occasion) => renderTemplate`${renderComponent($$result2, "OccasionCard", $$OccasionCard, { "title": occasion.title, "image": occasion.image, "url": occasion.url, "className": "aspect-[4/3]" })}`)} </div> </div> </div> <!-- Productos Destacados - Ancho completo --> <div class="px-4 md:px-6"> <div class="max-w-7xl mx-auto"> <h2 class="font-serif text-3xl md:text-4xl text-honey-bronze-400 mb-8 text-center">
Nuestros Favoritos
</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${bestSellers.map((product) => renderTemplate`${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "gallery", "size": "large", "background": product.image[0].replace(/ /g, "%20"), "className": "min-h-[400px] group cursor-pointer", "onclick": "window.location.href='/catalogo'" }, { "default": ($$result3) => renderTemplate` <div class="space-y-4 relative z-10"> <h3 class="font-serif text-2xl md:text-3xl text-honey-bronze-400 mb-3 group-hover:text-honey-bronze-300 transition-colors"> ${product.name} </h3> <p class="text-cherry-blossom-100 mb-4 text-sm md:text-base line-clamp-3 group-hover:text-cherry-blossom-50 transition-colors"> ${product.Description} </p> <a href="/catalogo" class="inline-flex items-center text-honey-bronze-400 hover:text-honey-bronze-300 font-medium transition-colors group/link text-lg relative z-10">
Ver Detalles
<svg class="ml-2 w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> </div> ` })}`)} </div> </div> </div> <!-- Servicios Principales - Cards Verticales usando datos --> <div class="px-4 md:px-6"> <div class="max-w-7xl mx-auto"> <h2 class="font-serif text-3xl md:text-4xl text-honey-bronze-400 mb-8 text-center">
Nuestros Servicios
</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> ${mainServices.map((service) => renderTemplate`${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "gallery", "size": "medium", "background": service.image }, { "default": ($$result3) => renderTemplate` <div class="p-6 text-center relative z-10"> <h3 class="font-serif text-xl text-honey-bronze-400 mb-3"> ${service.title} </h3> <p class="text-cherry-blossom-100 text-sm mb-4"> ${service.description} </p> <a${addAttribute(service.url, "href")} class="inline-block px-6 py-2 bg-honey-bronze-500 text-midnight-violet-950 rounded-full text-sm font-medium hover:bg-honey-bronze-400 transition-colors relative z-10"> ${service.url.includes("catalogo") ? "Ver Cat\xE1logo" : service.url.includes("contacto") ? "Contactar" : "Ver Planes"} </a> </div> ` })}`)} </div> </div> </div> <!-- Feed de Instagram con scraping --> ${renderComponent($$result2, "InstagramFeed", $$InstagramFeed, { "username": "tapti_regalo" })} <!-- Card de Membresías - Ancho ajustado y centrado --> <div class="flex justify-center px-4 md:px-6"> <div class="w-full max-w-5xl"> ${renderComponent($$result2, "BoutiqueCard", $$BoutiqueCard, { "variant": "services", "size": "medium", "className": "text-center py-16" }, { "default": ($$result3) => renderTemplate` <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl text-honey-bronze-400 mb-6">
Únete a Tapti Club
</h2> <p class="text-cherry-blossom-100 mb-8 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
Descubre beneficios exclusivos, descuentos especiales y acceso
            prioritario a nuestras nuevas colecciones
</p> <a href="/membresias" class="inline-flex items-center px-10 py-5 bg-gradient-to-r from-honey-bronze-500 to-honey-bronze-400 text-midnight-violet-950 font-semibold rounded-full hover:from-honey-bronze-400 hover:to-honey-bronze-300 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg relative z-10">
Conocer Membresías
<svg class="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> ` })} </div> </div> </div>  ${renderComponent($$result2, "FloatingWhatsApp", $$FloatingWhatsApp, {})}  ` })} <!-- Navegación flotante -->`;
}, "D:/Trabajos/FloreriaTapti/src/pages/index.astro", void 0);

const $$file = "D:/Trabajos/FloreriaTapti/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
