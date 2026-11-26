import type { APIRoute } from "astro";
import { z } from "zod";
import { verifyAdmin } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";
import { promoCodeSchema } from "../../../lib/promoCodes";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const missingTable = (error: { code?: string; message: string }) =>
  error.code === "42P01" || /promo_codes/.test(error.message);

const dbError = (error: { code?: string; message: string }) => {
  console.error("Error en promo_codes:", error);
  if (error.code === "23505") return json({ message: "Ya existe un código con ese nombre." }, 409);
  return json(
    {
      message: missingTable(error)
        ? "Falta crear la tabla promo_codes en Supabase (ver db_promo_codes.sql)."
        : "No se pudo guardar el código",
    },
    500,
  );
};

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// GET - Lista los códigos (admin)
export const GET: APIRoute = async ({ cookies }) => {
  if (!(await verifyAdmin(cookies))) return json({ message: "No autenticado" }, 401);
  const { data, error } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
  if (error) return dbError(error);
  return json(data, 200);
};

// POST - Crea un código (admin)
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await verifyAdmin(cookies))) return json({ message: "No autenticado" }, 401);
  const parsed = promoCodeSchema.safeParse(await readJson(request));
  if (!parsed.success) return json({ message: parsed.error.issues[0]?.message ?? "Datos inválidos" }, 400);

  const { data, error } = await supabase.from("promo_codes").insert([parsed.data]).select().single();
  if (error) return dbError(error);
  return json(data, 201);
};

const patchSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean(),
});

// PATCH - Activa o desactiva un código (admin)
export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!(await verifyAdmin(cookies))) return json({ message: "No autenticado" }, 401);
  const parsed = patchSchema.safeParse(await readJson(request));
  if (!parsed.success) return json({ message: "Datos inválidos" }, 400);

  const { data, error } = await supabase
    .from("promo_codes")
    .update({ is_active: parsed.data.is_active })
    .eq("id", parsed.data.id)
    .select()
    .single();
  if (error) return dbError(error);
  return json(data, 200);
};

// DELETE - Elimina un código (admin). Los pedidos conservan el texto del código usado.
export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!(await verifyAdmin(cookies))) return json({ message: "No autenticado" }, 401);
  const parsed = z.object({ id: z.string().uuid() }).safeParse(await readJson(request));
  if (!parsed.success) return json({ message: "Datos inválidos" }, 400);

  const { error } = await supabase.from("promo_codes").delete().eq("id", parsed.data.id);
  if (error) return dbError(error);
  return json({ success: true }, 200);
};
