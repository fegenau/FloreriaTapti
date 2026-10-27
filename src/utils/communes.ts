export interface Commune {
  name: string;
  price: number;
}

// Valores de despacho normal (post 13:00)
// Cobertura reducida temporalmente: las comunas no listadas deben consultar disponibilidad por WhatsApp.
export const COMMUNES: Commune[] = [
  // $1.990
  { name: "Las Condes", price: 1990 },

  // $3.990
  { name: "Lo Barnechea", price: 3990 },
  { name: "Vitacura", price: 3990 },
  { name: "Providencia", price: 3990 },
  { name: "La Reina", price: 3990 },
  { name: "Ñuñoa", price: 3990 },
  { name: "Peñalolén", price: 3990 },

  // $4.990
  { name: "Santiago", price: 4990 },
  { name: "Macul", price: 4990 },
].sort((a, b) => a.name.localeCompare(b.name));

export const EXPRESS_DELIVERY_PRICE = 5990;

export const getCommunePrice = (communeName: string): number => {
  const match = COMMUNES.find((c) => c.name.toLowerCase() === communeName.toLowerCase());
  if (!match) throw new Error("Comuna no válida");
  return match.price;
};
