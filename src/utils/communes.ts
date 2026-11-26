export interface Commune {
  name: string;
  price: number;
}

// Valores de despacho normal (post 13:00)
// Cobertura reducida temporalmente: las comunas no listadas deben consultar disponibilidad por WhatsApp.
export const COMMUNES: Commune[] = [
  // $2.490
  { name: "Las Condes", price: 2490 },

  // $4.990
  { name: "Lo Barnechea", price: 4990 },
  { name: "Vitacura", price: 4990 },
  { name: "Providencia", price: 4990 },
  { name: "La Reina", price: 4990 },
  { name: "Ñuñoa", price: 4990 },
  { name: "Peñalolén", price: 4990 },

  // $5.990
  { name: "Santiago", price: 5990 },
  { name: "Macul", price: 5990 },
].sort((a, b) => a.name.localeCompare(b.name));

export const EXPRESS_DELIVERY_PRICE = 5990;
// Delivery Express oculto: no se ofrece en el carrito y el servidor lo rechaza.
// Cambiar a true (y volver a agregar la opción en carrito.astro) para reactivarlo.
export const EXPRESS_DELIVERY_ENABLED = false;

export const getCommunePrice = (communeName: string): number => {
  const match = COMMUNES.find((c) => c.name.toLowerCase() === communeName.toLowerCase());
  if (!match) throw new Error("Comuna no válida");
  return match.price;
};
