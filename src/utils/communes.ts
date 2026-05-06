export interface Commune {
  name: string;
  price: number;
}

// Valores de despacho normal (post 13:00)
export const COMMUNES: Commune[] = [
  // Gratis
  { name: "Las Condes", price: 0 },
  
  // $2.990
  { name: "Vitacura", price: 2990 },
  { name: "Providencia", price: 2990 },
  { name: "La Reina", price: 2990 },

  // $3.990
  { name: "Lo Barnechea", price: 3990 },
  { name: "Recoleta", price: 3990 },
  { name: "Santiago", price: 3990 },
  { name: "Ñuñoa", price: 3990 },
  { name: "Peñalolén", price: 3990 },
  { name: "Macul", price: 3990 },
  { name: "San Joaquín", price: 3990 },
  { name: "San Miguel", price: 3990 },

  // $4.990
  { name: "La Florida", price: 4990 },
  { name: "Puente Alto", price: 4990 },
  { name: "La Granja", price: 4990 },
  { name: "San Ramón", price: 4990 },
  { name: "La Cisterna", price: 4990 },
  { name: "Lo Espejo", price: 4990 },
  { name: "Pedro Aguirre Cerda", price: 4990 },
  { name: "El Bosque", price: 4990 },
  { name: "Cerrillos", price: 4990 },
  { name: "Estación Central", price: 4990 },
  { name: "Lo Prado", price: 4990 },
  { name: "Quinta Normal", price: 4990 },
  { name: "Independencia", price: 4990 },
  { name: "Conchalí", price: 4990 },
  { name: "Huechuraba", price: 4990 },

  // $6.000
  { name: "Quilicura", price: 6000 },
  { name: "Renca", price: 6000 },
  { name: "Cerro Navia", price: 6000 },
  { name: "Pudahuel", price: 6000 },
  { name: "Maipú", price: 6000 },
  { name: "Padre Hurtado", price: 6000 },
  { name: "San Bernardo", price: 6000 },
  { name: "Pirque", price: 6000 },
  { name: "San José de Maipo", price: 6000 },
].sort((a, b) => a.name.localeCompare(b.name));

export const EXPRESS_DELIVERY_PRICE = 5990;

export const getCommunePrice = (communeName: string): number => {
  const match = COMMUNES.find((c) => c.name.toLowerCase() === communeName.toLowerCase());
  if (!match) throw new Error("Comuna no válida");
  return match.price;
};
