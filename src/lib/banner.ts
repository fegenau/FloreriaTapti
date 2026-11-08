// Configuración del banner rotativo de la página de inicio.
// Se edita desde /admin/banner y se guarda en la tabla site_settings (key 'home_banner').
// Si la tabla no existe, está vacía o el valor es inválido, se usa DEFAULT_BANNER.
import { z } from "zod";
import { supabase } from "./supabase";
import { CATALOG_IMAGES_BASE_URL } from "./catalogImage";

export const BANNER_SETTINGS_KEY = "home_banner";
export const MAX_RAMOS_DEL_MES = 3;

// Imágenes por defecto, relativas a la raíz del bucket "catalog-images".
export const DEFAULT_HERO_IMAGE = "Flores/Banner.avif";
export const DEFAULT_CONCURSO_IMAGE = "Flores/Experiencia Tapti/Experiencia Tapti 2.avif";

// Ruta dentro del bucket (sin "..", sin "\" ni "/" inicial) o URL https absoluta.
const imagePath = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) =>
      /^https:\/\/[^\s"'()<>]+$/.test(v) ||
      (!v.startsWith("/") &&
        !v.includes("\\") &&
        !/[\u0000-\u001f"<>]/.test(v) &&
        v.split("/").every((s) => s.length > 0 && s !== "." && s !== "..")),
    "Ruta de imagen inválida",
  )
  .nullable();

const text = (max: number) => z.string().trim().max(max);

export const bannerConfigSchema = z.object({
  hero: z.object({
    image: imagePath,
    title: text(120).min(1, "El título del banner principal es obligatorio"),
    text: text(300),
  }),
  concurso: z.object({
    // Interruptor general del concurso: banner, página /concurso, menú y API.
    enabled: z.boolean().default(true),
    image: imagePath,
    eyebrow: text(60),
    title: text(120).min(1, "El título del concurso es obligatorio"),
    text: text(300),
  }),
  ramosEyebrow: text(60),
  ramos: z
    .array(
      z.object({
        product: text(150).min(1),
        image: imagePath,
        title: text(120), // vacío = nombre del producto
        text: text(300), // vacío = descripción del producto
      }),
    )
    .max(MAX_RAMOS_DEL_MES),
});

export type BannerConfig = z.infer<typeof bannerConfigSchema>;

export const DEFAULT_BANNER: BannerConfig = {
  hero: {
    image: null,
    title: "Tengo algo para ti",
    text: "Ramos elegantes y regalos personalizados, diseñados con la esencia única de Tapti",
  },
  concurso: {
    enabled: true,
    image: null,
    eyebrow: "Concurso de {mes}",
    title: "Sortearemos un ramo sorpresa",
    text: "Cuéntanos tu fecha importante y por qué deberías ganártelo. El sorteo se realizará a fin de mes ({fecha_sorteo}).",
  },
  ramosEyebrow: "Ramo del mes · {Mes}",
  ramos: [
    { product: "Bouquet Alquimia", image: "Banner/Bouquet Alquimia/BouquetAlquimia.avif", title: "", text: "" },
    { product: "Ramo Primavera", image: "Banner/Ramo Primavera/RamoPrimavera.avif", title: "", text: "" },
    { product: "Jardín Secreto", image: null, title: "", text: "" },
  ],
};

// Caché corto en memoria: el menú lee la configuración en cada página y así no
// se consulta la base en cada visita. Guardar desde el admin lo invalida.
const CACHE_TTL_MS = 30_000;
let cache: { value: BannerConfig; expires: number } | null = null;

export async function getBannerConfig(): Promise<BannerConfig> {
  if (cache && cache.expires > Date.now()) return cache.value;
  const value = await loadBannerConfig();
  cache = { value, expires: Date.now() + CACHE_TTL_MS };
  return value;
}

export async function isContestEnabled(): Promise<boolean> {
  return (await getBannerConfig()).concurso.enabled;
}

async function loadBannerConfig(): Promise<BannerConfig> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", BANNER_SETTINGS_KEY)
      .maybeSingle();

    if (error) {
      console.error("Banner: no se pudo leer site_settings, se usa la configuración por defecto:", error.message);
      return DEFAULT_BANNER;
    }
    if (!data) return DEFAULT_BANNER;

    const parsed = bannerConfigSchema.safeParse(data.value);
    if (!parsed.success) {
      console.error("Banner: configuración guardada inválida, se usa la por defecto:", parsed.error.issues[0]);
      return DEFAULT_BANNER;
    }
    return parsed.data;
  } catch (error) {
    console.error("Banner: error inesperado leyendo la configuración:", error);
    return DEFAULT_BANNER;
  }
}

export async function saveBannerConfig(config: BannerConfig, updatedBy: string | null) {
  const result = await supabase.from("site_settings").upsert({
    key: BANNER_SETTINGS_KEY,
    value: config,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy,
  });
  cache = null;
  return result;
}

/** URL pública de la raíz del bucket, ej: https://xxx.supabase.co/storage/v1/object/public/catalog-images/ */
export const BUCKET_ROOT_URL = CATALOG_IMAGES_BASE_URL.replace(/Flores\/$/, "");

/** Convierte una ruta del bucket (o URL absoluta) en URL pública. */
export function resolveBannerImage(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return BUCKET_ROOT_URL + path.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
}

/** Reemplaza {mes}, {Mes}, {fecha_sorteo} e {instagram} en los textos del banner. */
export function fillBannerText(
  value: string,
  vars: { monthName: string; drawDateLabel: string; instagramUsername: string },
): string {
  const month = vars.monthName;
  return value
    .replace(/\{Mes\}/g, month.charAt(0).toUpperCase() + month.slice(1))
    .replace(/\{mes\}/g, month)
    .replace(/\{fecha_sorteo\}/g, vars.drawDateLabel)
    .replace(/\{instagram\}/g, `@${vars.instagramUsername}`);
}
