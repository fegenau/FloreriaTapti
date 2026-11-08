// Configuración de redes sociales, concurso mensual y banner principal.
// Editar este archivo cada mes para cambiar los "ramos del mes" o las
// imágenes del banner (por ejemplo, las generadas con IA).

export const INSTAGRAM_USERNAME = "tapti_flores";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}`;

// Nombres exactos (como aparecen en el catálogo) de los ramos destacados del mes.
// Si alguno no existe o no está disponible, se omite; si ninguno coincide,
// se muestran los primeros ramos disponibles del catálogo.
export const RAMOS_DEL_MES: string[] = [
  "Bouquet Alquimia",
  "Ramo Primavera",
  "Jardín Secreto",
];

// Imágenes de mejor calidad solo para el banner.
// Ruta relativa a la raíz del bucket "catalog-images" (ej: "Banner/Concurso/concurso.avif")
// o URL absoluta. Si un ramo no aparece aquí, se usa su foto del catálogo.
export const BANNER_IMAGES: {
  concurso: string | null;
  ramos: Record<string, string>;
} = {
  concurso: null,
  ramos: {
    "Bouquet Alquimia": "Banner/Bouquet Alquimia/BouquetAlquimia.avif",
    "Ramo Primavera": "Banner/Ramo Primavera/RamoPrimavera.avif",
  },
};

export const CONTEST_MOTIVES = [
  "Cumpleaños",
  "Aniversario",
  "Agradecimiento",
  "Amistad",
  "Día especial",
  "Logro o graduación",
  "Recuperación",
  "Sin motivo, solo porque sí",
  "Otro",
] as const;

const TZ = "America/Santiago";

/** Fecha del sorteo: último día del mes actual (hora de Chile). */
export function getContestDrawInfo(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value); // 1-12
  const lastDay = new Date(Date.UTC(year, month, 0, 12));

  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-CL", { timeZone: "UTC", ...opts }).format(lastDay);

  return {
    monthName: fmt({ month: "long" }),
    drawDateLabel: fmt({ day: "numeric", month: "long" }),
    periodKey: `${year}-${String(month).padStart(2, "0")}`,
  };
}
