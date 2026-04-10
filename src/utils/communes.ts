export interface Commune {
  name: string;
  price: number;
}

// Valores de despacho normal (post 13:00)
export const COMMUNES: Commune[] = [
  { name: "Las Condes", price: 0 },
  // Tarifa Baja
  { name: "Ñuñoa", price: 2000 },
  { name: "Providencia", price: 2000 },
  { name: "Santiago Centro", price: 2000 },
  { name: "Macul", price: 2000 },
  { name: "Conchalí", price: 2000 },
  { name: "Independencia", price: 2000 },
  { name: "Quinta Normal", price: 2000 },
  { name: "Peñalolén", price: 2000 },
  { name: "Quilicura", price: 2000 },
  // Tarifa Media / Alta
  { name: "Puente Alto", price: 4000 },
  { name: "San Bernardo", price: 4000 },
  { name: "La Florida", price: 4000 },
  { name: "Vitacura", price: 4000 },
  { name: "Lo Barnechea", price: 4000 },
  { name: "El Bosque", price: 4000 },
  { name: "Maipú", price: 4000 },
].sort((a, b) => a.name.localeCompare(b.name));

export const EXPRESS_DELIVERY_PRICE = 5990;

export const getCommunePrice = (communeName: string): number => {
  const match = COMMUNES.find((c) => c.name.toLowerCase() === communeName.toLowerCase());
  if (!match) throw new Error("Comuna no válida");
  return match.price;
};
