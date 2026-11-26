import type { APIRoute } from "astro";
import { PromoError, findValidPromo } from "../../../lib/promoCodes";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// POST - Valida un código promocional desde el carrito (público).
// Solo informa el porcentaje; el descuento real se recalcula en el checkout.
export const POST: APIRoute = async ({ request }) => {
  let code: unknown;
  try {
    ({ code } = await request.json());
  } catch {
    return json({ error: "Solicitud inválida" }, 400);
  }
  if (typeof code !== "string" || code.length > 50) {
    return json({ error: "Ingresa un código." }, 400);
  }

  try {
    const promo = await findValidPromo(code);
    return json({ code: promo.code, percent: promo.percent }, 200);
  } catch (e) {
    if (e instanceof PromoError) return json({ error: e.message }, 400);
    console.error("Error validando código promocional:", e);
    return json({ error: "No pudimos validar el código. Intenta de nuevo." }, 500);
  }
};
