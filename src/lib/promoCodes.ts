import { z } from "zod";
import { supabase } from "./supabase";

export type PromoCode = {
  id: string;
  code: string;
  percent: number;
  expires_at: string | null; // YYYY-MM-DD, último día válido (hora de Chile)
  is_active: boolean;
  created_at: string;
};

export class PromoError extends Error {}

export const normalizeCode = (code: string) => code.trim().toUpperCase();

export const promoCodeSchema = z.object({
  code: z
    .string()
    .transform(normalizeCode)
    .pipe(z.string().regex(/^[A-Z0-9_-]{3,30}$/, "El código debe tener 3 a 30 caracteres: letras, números, - o _")),
  percent: z.coerce
    .number()
    .int("El porcentaje debe ser un número entero")
    .min(1, "El porcentaje mínimo es 1%")
    .max(100, "El porcentaje máximo es 100%"),
  expires_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha de vencimiento inválida")
    .nullable()
    .optional()
    .transform((v) => v || null),
  is_active: z.boolean().default(true),
});

/** Hoy en Chile como YYYY-MM-DD. */
export function todayInChile(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());
}

export function isExpired(promo: Pick<PromoCode, "expires_at">): boolean {
  return promo.expires_at !== null && promo.expires_at < todayInChile();
}

/** Busca un código y verifica que se pueda usar hoy; si no, lanza PromoError. */
export async function findValidPromo(rawCode: string): Promise<PromoCode> {
  const code = normalizeCode(rawCode);
  if (!code) throw new PromoError("Ingresa un código.");

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) throw new Error(`DB Error: ${error.message}`);

  const promo = data as PromoCode | null;
  if (!promo || !promo.is_active) throw new PromoError("El código no es válido.");
  if (isExpired(promo)) throw new PromoError("El código ya venció.");
  return promo;
}

/** Descuento en pesos sobre el subtotal de productos (no aplica al envío). */
export function discountFor(subtotal: number, percent: number): number {
  return Math.min(subtotal, Math.round((subtotal * percent) / 100));
}
