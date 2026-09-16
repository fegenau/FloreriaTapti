// Resolución de URLs de imágenes del catálogo, sin dependencias de servidor
// (no importa "./supabase"). Seguro de importar tanto en código de servidor
// como en <script> de cliente (ej. carrito.astro), a diferencia de catalog.ts.

export const CATALOG_IMAGES_BASE_URL = (() => {
  const configuredBase =
    import.meta.env.PUBLIC_CATALOG_IMAGES_BASE_URL ||
    import.meta.env.SUPABASE_URL ||
    import.meta.env.PUBLIC_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    import.meta.env.EXPO_PUBLIC_SUPABASE_URL ||
    "";

  if (!configuredBase) return "";

  const normalizedBase = configuredBase.replace(/\/+$/, "");
  const isAlreadyCatalogFolder = /\/storage\/v1\/object\/public\/catalog-images\/Flores$/i.test(normalizedBase);

  return `${isAlreadyCatalogFolder ? normalizedBase : `${normalizedBase}/storage/v1/object/public/catalog-images/Flores`}/`;
})();

export const DEFAULT_CATALOG_IMAGE = `${CATALOG_IMAGES_BASE_URL || ""}Banner.avif`;

export function isLocalPublicAssetPath(imagePath: string): boolean {
  return /^\/(?:images|assets|fonts|favicon|_astro|_app|uploads)\//i.test(imagePath);
}

export function normalizeStorageImagePath(imagePath: string): string {
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

// Resolutor síncrono usado por componentes al renderizar. Construye la URL
// probable de forma determinística (sin llamadas de red).
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
