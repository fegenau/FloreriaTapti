import { supabase } from "./supabase";
import catalogImageData from "../data/catalog.json";
import { slugify } from "../utils/slugify.js";

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

const CATALOG_IMAGES_BASE_URL = (() => {
  const configuredBase =
    import.meta.env.PUBLIC_CATALOG_IMAGES_BASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    import.meta.env.SUPABASE_URL ||
    "";

  if (!configuredBase) return "";

  const normalizedBase = configuredBase.replace(/\/+$/, "");
  const isAlreadyCatalogFolder = /\/storage\/v1\/object\/public\/catalog-images\/Flores$/i.test(normalizedBase);

  return `${isAlreadyCatalogFolder ? normalizedBase : `${normalizedBase}/storage/v1/object/public/catalog-images/Flores`}/`;
})();

const DEFAULT_CATALOG_IMAGE = `${CATALOG_IMAGES_BASE_URL || ""}Banner.avif`;


type CatalogImageEntry = {
  name?: string;
  image?: string[];
};

type CatalogImageData = {
  flowers?: CatalogImageEntry[];
};

const catalogImageMap = new Map(
  ((catalogImageData as CatalogImageData).flowers || [])
    .filter((item) => typeof item.name === "string" && Array.isArray(item.image))
    .map((item) => [slugify(item.name || ""), item.image || []]),
);

const resolvedUrlCache = new Map<string, string>();

function isLocalPublicAssetPath(imagePath: string): boolean {
  return /^\/(?:images|assets|fonts|favicon|_astro|_app|uploads)\//i.test(imagePath);
}

function normalizeStorageImagePath(imagePath: string): string {
  if (!imagePath) return "";

  let normalized = imagePath.trim().replace(/\\/g, "/");

  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    // keep the raw value if it is already url-encoded/incompatible
  }

  normalized = normalized.replace(/^\/+/, "");
  normalized = normalized.replace(/(^|\/)PAGINA(?:%20| )WEB(?:%20| )?(?:\(\s*FOTOS\s*\)|\s*FOTOS)\s*\/?/gi, "$1");
  normalized = normalized.replace(/^images\//i, "");
  normalized = normalized.replace(/^\/+/, "");

  return normalized;
}

async function headOk(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function resolveCatalogImageUrl(imagePath: string): Promise<string> {
  if (!imagePath) return `${DEFAULT_CATALOG_IMAGE}`;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (isLocalPublicAssetPath(imagePath)) {
    return imagePath;
  }

  // Try cached
  if (resolvedUrlCache.has(imagePath)) return resolvedUrlCache.get(imagePath)!;

  const candidates: string[] = [];

  const orig = imagePath;
  const stripped = normalizeStorageImagePath(orig);

  // Helper to attempt latin1->utf8 fix for mojibake
  let maybeFixed = stripped;
  try {
    if (/[^\x00-\x7F]/.test(stripped)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Buffer = require("buffer").Buffer;
      const fixed = Buffer.from(stripped, "latin1").toString("utf8");
      if (fixed && fixed !== stripped) maybeFixed = fixed;
    }
  } catch (e) {
    // ignore
  }

  candidates.push(stripped);
  if (maybeFixed !== stripped) candidates.push(maybeFixed);
  // also try original with images/ prefix
  if (!orig.startsWith("images/")) { candidates.push(orig); }

  for (const cand of candidates) {
    const encoded = cand.split("/").map(encodeURIComponent).join("/");
    const url = `${CATALOG_IMAGES_BASE_URL}${encoded}`;
    // quick check
    if (await headOk(url)) {
      resolvedUrlCache.set(imagePath, url);
      return url;
    }
  }

  // fallback to default image
  const fallback = DEFAULT_CATALOG_IMAGE;
  resolvedUrlCache.set(imagePath, fallback);
  return fallback;
}

// Synchronous resolver used by components at render time. It constructs
// the likely URL deterministically (strip leading 'images/' and encode
// segments) but DOES NOT perform network checks. This avoids adding
// blocking network calls in templates.
export function resolveCatalogImageUrlSync(imagePath: string): string {
  if (!imagePath) return DEFAULT_CATALOG_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (isLocalPublicAssetPath(imagePath)) {
    return imagePath;
  }

  const orig = imagePath;
  const stripped = normalizeStorageImagePath(orig);
  const encoded = stripped.split("/").map(encodeURIComponent).join("/");
  return `${CATALOG_IMAGES_BASE_URL}${encoded}`;
}

export async function resolveCatalogImagePaths(imagePaths: string[]): Promise<string[]> {
  return Promise.all(imagePaths.map((imagePath) => resolveCatalogImageUrl(imagePath)));
}

function parseBoolean(value: string | boolean | null): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;

  return ["true", "1", "yes", "si", "sí"].includes(value.trim().toLowerCase());
}

function normalizeCatalogRow(row: CatalogRow): CatalogProduct {
  const imagePaths = catalogImageMap.get(slugify(row.name || "")) || [DEFAULT_CATALOG_IMAGE];

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
    // keep unresolved image paths here; they'll be resolved in getCatalogData
    image: imagePaths,
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

  // Resolve image URLs (may perform HEAD checks and use cache)
  await Promise.all(
    flowers.map(async (f) => {
      try {
        // f.image currently holds raw image path strings
        // @ts-ignore
        f.image = await resolveCatalogImagePaths(f.image as string[]);
      } catch (e) {
        // leave as-is on error
      }
    }),
  );

  return {
    currency: flowers[0]?.currency || "CLP",
    flowers,
  };
}
