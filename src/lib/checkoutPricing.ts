import { supabase } from "./supabase";
import catalogData from "../data/catalog.json";
import { slugify } from "../utils/slugify.js";

type CartItem = {
  id: string;
  name?: string;
  size?: string;
  price: number;
  quantity: number;
  [key: string]: unknown;
};

type SizeEntry = { total: number | string; stems?: string | number } | null;

type PricingRow = {
  name: string | null;
  isQuote: string | boolean | null;
  isAvailable: boolean | null;
  unit_price: number | string | null;
  sizes: Record<string, SizeEntry> | null;
};

export type PriceUpdate = { id: string; name: string; oldPrice: number; newPrice: number };

export class PricingError extends Error {}

// Los accesorios aún viven en el catálogo estático, no en Supabase.
const accessoryPrices = new Map(
  ((catalogData as { accessories?: { name: string; price: number }[] }).accessories || []).map(
    (acc) => [slugify(acc.name), acc.price],
  ),
);

function isTrue(value: string | boolean | null): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  return ["true", "1", "yes", "si", "sí"].includes(value.trim().toLowerCase());
}

function toPrice(value: number | string | null | undefined): number | null {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : null;
}

function priceFromRow(row: PricingRow, size: string | undefined): number | null {
  const sizes = Object.entries(row.sizes || {}).filter(
    (e): e is [string, NonNullable<SizeEntry>] => e[1] !== null,
  );

  if (size) {
    const match = sizes.find(([key]) => slugify(key) === slugify(size));
    if (match) return toPrice(match[1].total);
  }

  // Productos de un solo tamaño se agregan al carrito como "Único".
  if (sizes.length === 1) return toPrice(sizes[0][1].total);
  if (sizes.length === 0) return toPrice(row.unit_price);
  return null;
}

/**
 * Recalcula el precio de cada ítem del carrito desde la tabla `catalog`.
 * Nunca se confía en el precio que envía el navegador.
 */
export async function priceCartItems(items: CartItem[]): Promise<{ items: CartItem[]; updates: PriceUpdate[] }> {
  const { data, error } = await supabase
    .from("catalog")
    .select("name, isQuote, isAvailable, unit_price, sizes");

  if (error) throw new Error(`DB Error: ${error.message}`);

  const rowsBySlug = new Map(
    ((data || []) as PricingRow[]).map((row) => [slugify(row.name || ""), row]),
  );

  const updates: PriceUpdate[] = [];
  const priced = items.map((item) => {
    const name = item.name || "";
    const slug = slugify(name);
    const row = rowsBySlug.get(slug);

    let price: number | null = null;
    if (row) {
      if (row.isAvailable === false || isTrue(row.isQuote)) {
        throw new PricingError(`"${name}" ya no está disponible para compra. Quítalo del carrito.`);
      }
      price = priceFromRow(row, item.size);
    } else if (accessoryPrices.has(slug)) {
      price = accessoryPrices.get(slug)!;
    }

    if (price == null) {
      throw new PricingError(`No pudimos validar el precio de "${name}". Quítalo del carrito y vuelve a agregarlo.`);
    }

    if (price !== item.price) {
      updates.push({ id: item.id, name, oldPrice: item.price, newPrice: price });
    }
    return { ...item, price };
  });

  return { items: priced, updates };
}
