export interface Commune {
  name: string;
  price: number;
}

// Valores de despacho normal (post 13:00)
export const COMMUNES: Commune[] = [
  // Gratis
  { name: "Las Condes", price: 0 },
  
  // Tarifa Baja ($2.000)
  { name: "Conchalí", price: 2000 },
  { name: "Independencia", price: 2000 },
  { name: "Macul", price: 2000 },
  { name: "Ñuñoa", price: 2000 },
  { name: "Peñalolén", price: 2000 },
  { name: "Providencia", price: 2000 },
  { name: "Quilicura", price: 2000 },
  { name: "Quinta Normal", price: 2000 },
  { name: "Santiago", price: 2000 },

  // Gran Santiago ($4.000)
  { name: "Cerrillos", price: 4000 },
  { name: "Cerro Navia", price: 4000 },
  { name: "El Bosque", price: 4000 },
  { name: "Estación Central", price: 4000 },
  { name: "Huechuraba", price: 4000 },
  { name: "La Cisterna", price: 4000 },
  { name: "La Florida", price: 4000 },
  { name: "La Granja", price: 4000 },
  { name: "La Pintana", price: 4000 },
  { name: "La Reina", price: 4000 },
  { name: "Lo Barnechea", price: 4000 },
  { name: "Lo Espejo", price: 4000 },
  { name: "Lo Prado", price: 4000 },
  { name: "Maipú", price: 4000 },
  { name: "Pedro Aguirre Cerda", price: 4000 },
  { name: "Pudahuel", price: 4000 },
  { name: "Recoleta", price: 4000 },
  { name: "Renca", price: 4000 },
  { name: "San Joaquín", price: 4000 },
  { name: "San Miguel", price: 4000 },
  { name: "San Ramón", price: 4000 },
  { name: "Vitacura", price: 4000 },

  // Otras Comunas / Satélites ($6.000)
  { name: "Colina", price: 6000 },
  { name: "Lampa", price: 6000 },
  { name: "Pirque", price: 6000 },
  { name: "Puente Alto", price: 6000 },
  { name: "San Bernardo", price: 6000 },
].sort((a, b) => a.name.localeCompare(b.name));

export const EXPRESS_DELIVERY_PRICE = 5990;

export const getCommunePrice = (communeName: string): number => {
  const match = COMMUNES.find((c) => c.name.toLowerCase() === communeName.toLowerCase());
  if (!match) throw new Error("Comuna no válida");
  return match.price;
};
