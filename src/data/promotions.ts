// Configuración de redes sociales y del concurso mensual.
// Las imágenes y textos del banner se editan desde /admin/banner (ver src/lib/banner.ts).

export const INSTAGRAM_USERNAME = "tapti_flores";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}`;

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
