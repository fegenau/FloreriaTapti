// Precios falsos: devuelve los ítems tal cual (como si coincidieran con la BD).
export class PricingError extends Error {}
export async function priceCartItems(items) {
  return { items: items.map((i) => ({ ...i })), updates: [] };
}
