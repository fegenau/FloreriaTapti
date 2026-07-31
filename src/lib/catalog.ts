import { supabase } from "./supabase";

export type CatalogRow = {
  currency: string | null;
  Description: string | null;
  category: string | null;
  flowerType: string[] | null;
  hasForm: string | boolean | null;
  isQuote: string | boolean | null;
  name: string | null;
  price_range: string | null;
  sizes: Record<string, { total: number; stems?: string | number } | null> | null;
  unit_price: number | string | null;
};

export type CatalogProduct = {
  currency: string;
  Description: string;
  category: string;
  flowerType: string[];
  hasForm: boolean;
  isQuote: boolean;
  name: string;
  price_range: string | null;
  sizes: Record<string, { total: number; stems?: string | number } | null>;
  unit_price: number | null;
  image: string[];
};

export type CatalogData = {
  currency: string;
  flowers: CatalogProduct[];
};

const DEFAULT_CATALOG_IMAGE = "images/Banner.jpg";

function parseBoolean(value: string | boolean | null): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;

  return ["true", "1", "yes", "si", "sí"].includes(value.trim().toLowerCase());
}

function normalizeCatalogRow(row: CatalogRow): CatalogProduct {
  return {
    currency: row.currency || "CLP",
    Description: row.Description || "",
    category: row.category || "Sin categoría",
    flowerType: Array.isArray(row.flowerType) ? row.flowerType : [],
    hasForm: parseBoolean(row.hasForm),
    isQuote: parseBoolean(row.isQuote),
    name: row.name || "Sin nombre",
    price_range: row.price_range,
    sizes: row.sizes || {},
    unit_price:
      typeof row.unit_price === "number"
        ? row.unit_price
        : typeof row.unit_price === "string"
          ? Number(row.unit_price)
          : null,
    image: [DEFAULT_CATALOG_IMAGE],
  };
}

export function getStartingPrice(product: Pick<CatalogProduct, "isQuote" | "sizes">): number | null {
  if (product.isQuote) return null;

  const prices: number[] = Object.values(product.sizes)
    .filter((size): size is { total: number } => size !== null)
    .map((size) => size.total);

  return prices.length > 0 ? Math.min(...prices) : null;
}

export async function getCatalogData(): Promise<CatalogData> {
  const { data, error } = await supabase
    .from("catalog")
    .select("currency, Description, category, flowerType, hasForm, isQuote, name, price_range, sizes, unit_price")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error al cargar el catálogo desde Supabase:", error);
    return {
      currency: "CLP",
      flowers: [],
    };
  }

  const flowers = (data || []).map((row) => normalizeCatalogRow(row as CatalogRow));

  return {
    currency: flowers[0]?.currency || "CLP",
    flowers,
  };
}
