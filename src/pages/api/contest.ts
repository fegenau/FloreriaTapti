import type { APIRoute } from "astro";
import { z } from "zod";
import { sendContestEntryEmail } from "../../lib/email";
import { CONTEST_MOTIVES, getContestDrawInfo } from "../../data/promotions";

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
  const { periodKey } = getContestDrawInfo();

  const result = await sendContestEntryEmail({ ...entry, period: periodKey });
  if (!result.success) {
    return json({ error: "No pudimos registrar tu participación. Intenta nuevamente." }, 500);
  }

  return json({ success: true }, 200);
};
