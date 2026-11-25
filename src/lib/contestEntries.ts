// Lectura de participaciones del concurso mensual (tabla contest_entries) para el admin.
import { supabase } from "./supabase";

export interface ContestEntry {
  id?: string | number;
  period: string;
  name: string;
  email: string;
  phone: string;
  instagram: string | null;
  important_date: string | null;
  motive: string;
  reason: string;
  created_at?: string | null;
}

const PERIOD_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isValidPeriod(value: string | null | undefined): value is string {
  return !!value && PERIOD_RE.test(value);
}

/** "2026-11" -> "Noviembre 2026" */
export function periodLabel(period: string): string {
  const [y, m] = period.split("-").map(Number);
  const month = new Intl.DateTimeFormat("es-CL", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, 15)),
  );
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${y}`;
}

/** Periodos con al menos una participación, del más reciente al más antiguo. */
export async function listContestPeriods(): Promise<string[]> {
  const { data, error } = await supabase.from("contest_entries").select("period");
  if (error) throw new Error(error.message);
  const periods = new Set((data ?? []).map((r: { period: string }) => r.period).filter(isValidPeriod));
  return [...periods].sort().reverse();
}

export async function listContestEntries(period: string): Promise<ContestEntry[]> {
  const { data, error } = await supabase
    .from("contest_entries")
    .select("*")
    .eq("period", period);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as ContestEntry[];
  // Orden por fecha de inscripción si la columna existe; si no, se conserva el orden de la base.
  return rows.sort((a, b) => String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));
}

/** Fecha/hora en horario de Chile, ej: "24-11-2026 14:05". */
export function formatChileDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(d)
    .replace(",", "");
}

/** "2026-02-14" -> "14-02-2026" (fecha sin hora, no se convierte de zona). */
export function formatPlainDate(value: string | null | undefined): string {
  if (!value) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : value;
}
