import type { APIRoute } from "astro";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import { isContestEnabled } from "../../lib/banner";
import { sendContestConfirmationEmail, sendContestEntryEmail } from "../../lib/email";
import {
  CONTEST_MOTIVES,
  INSTAGRAM_URL,
  INSTAGRAM_USERNAME,
  getContestDrawInfo,
} from "../../data/promotions";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const entrySchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(150),
  phone: z.string().trim().min(8, "Teléfono inválido").max(20),
  instagram: z
    .string()
    .trim()
    .max(31)
    .transform((v) => v.replace(/^@/, ""))
    .refine((v) => v === "" || /^[A-Za-z0-9._]{1,30}$/.test(v), "Usuario de Instagram inválido")
    .optional(),
  importantDate: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Fecha inválida")
    .optional(),
  motive: z.enum(CONTEST_MOTIVES),
  reason: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(1500),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Debes aceptar las bases" }) }),
  // Honeypot anti-spam: debe venir vacío.
  website: z.string().max(0).optional(),
});

export const POST: APIRoute = async ({ request }) => {
  if (!(await isContestEnabled())) {
    return json({ error: "No hay un concurso activo en este momento." }, 403);
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Solicitud inválida" }, 400);
  }

  const parsed = entrySchema.safeParse(data);
  if (!parsed.success) {
    // Si el honeypot viene lleno, responder OK silenciosamente.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return json({ success: true }, 200);
    }
    return json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, 400);
  }

  const { website: _hp, acceptTerms: _t, ...entry } = parsed.data;
  const email = entry.email.toLowerCase();
  const { periodKey, monthName, drawDateLabel } = getContestDrawInfo();

  // 1. Guardar primero: si un correo falla después, la participación ya quedó registrada.
  const { error: dbError } = await supabase.from("contest_entries").insert({
    period: periodKey,
    name: entry.name,
    email,
    phone: entry.phone,
    instagram: entry.instagram || null,
    important_date: entry.importantDate || null,
    motive: entry.motive,
    reason: entry.reason,
    accepted_terms: true,
  });

  if (dbError) {
    if (dbError.code === "23505") {
      return json(
        { error: `Este email ya está participando en el sorteo de ${monthName}. ¡Suerte!` },
        409,
      );
    }
    console.error("Error guardando participación de concurso:", dbError);
    return json({ error: "No pudimos registrar tu participación. Intenta nuevamente." }, 500);
  }

  // 2. Correos: aviso a Tapti y confirmación al participante. Un fallo aquí se
  //    registra en logs pero no invalida la participación.
  const [owner, confirmation] = await Promise.allSettled([
    sendContestEntryEmail({ ...entry, email, period: periodKey }),
    sendContestConfirmationEmail({
      name: entry.name,
      email,
      monthName,
      drawDateLabel,
      instagramUrl: INSTAGRAM_URL,
      instagramUsername: INSTAGRAM_USERNAME,
    }),
  ]);
  const failed = (r: PromiseSettledResult<{ success: boolean }>) =>
    r.status === "rejected" || !r.value.success;
  if (failed(owner)) console.error("Concurso: no se pudo enviar el aviso al dueño", { email, periodKey });
  if (failed(confirmation)) console.error("Concurso: no se pudo enviar la confirmación", { email, periodKey });

  return json({ success: true, confirmationSent: !failed(confirmation) }, 200);
};
