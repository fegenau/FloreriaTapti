import type { APIRoute } from "astro";
import { getAuthUser, isAdminEmail } from "../../../lib/auth";
import { bannerConfigSchema, getBannerConfig, saveBannerConfig } from "../../../lib/banner";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// GET - Configuración actual del banner (admin)
export const GET: APIRoute = async ({ cookies }) => {
  const user = await getAuthUser(cookies);
  if (!isAdminEmail(user?.email)) return json({ message: "No autenticado" }, 401);
  return json(await getBannerConfig(), 200);
};

// PUT - Guarda la configuración del banner (admin)
export const PUT: APIRoute = async ({ request, cookies }) => {
  const user = await getAuthUser(cookies);
  if (!isAdminEmail(user?.email)) return json({ message: "No autenticado" }, 401);

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return json({ message: "Solicitud inválida" }, 400);
  }

  const parsed = bannerConfigSchema.safeParse(data);
  if (!parsed.success) {
    return json({ message: parsed.error.issues[0]?.message ?? "Datos inválidos" }, 400);
  }

  const { error } = await saveBannerConfig(parsed.data, user?.email ?? null);
  if (error) {
    console.error("Error guardando configuración del banner:", error);
    const missingTable = error.code === "42P01" || /site_settings/.test(error.message);
    return json(
      {
        message: missingTable
          ? "Falta crear la tabla site_settings en Supabase (ver db_site_settings.sql)."
          : "No se pudo guardar la configuración",
      },
      500,
    );
  }

  return json({ success: true, config: parsed.data }, 200);
};
