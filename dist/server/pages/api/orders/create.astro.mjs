import { createClient } from '@supabase/supabase-js';
import { IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';
import { z } from 'zod';
export { renderers } from '../../../renderers.mjs';

const supabaseUrl = "https://hmpeohszbimivcyguwte.supabase.co";
const supabaseKey = "sb_publishable_N-kiGR-t8iSXERVt7trodw_Fy-x-v6V";
const supabase = createClient(supabaseUrl, supabaseKey);

const OrderSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  rut: z.string().min(8, "RUT inválido"),
  address: z.string().min(5, "Dirección inválida"),
  duration: z.string().refine((val) => ["15", "30"].includes(val), {
    message: "Duración inválida (debe ser 15 o 30 días)"
  })
});
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const validation = OrderSchema.safeParse(data);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: "Datos inválidos",
        details: validation.error.flatten()
      }), { status: 400 });
    }
    const { name, rut, address, duration } = validation.data;
    const amount = duration === "15" ? 2e4 : 15e3;
    const commerceCode = undefined                          || IntegrationCommerceCodes.WEBPAY_PLUS;
    const apiKey = undefined                           || IntegrationApiKeys.WEBPAY;
    const environment = true ? Environment.Production : Environment.Integration;
    const { data: orderData, error: orderError } = await supabase.from("orders").insert([{
      customer_name: name,
      customer_rut: rut,
      shipping_address: address,
      total_amount: amount,
      status: "pending"
    }]).select().single();
    if (orderError) {
      console.error("Supabase Order Error:", orderError);
      return new Response(JSON.stringify({ error: "Error al crear orden en BD" }), { status: 500 });
    }
    const { error: subError } = await supabase.from("subscriptions").insert([{
      order_id: orderData.id,
      duration_days: parseInt(duration),
      start_date: (/* @__PURE__ */ new Date()).toISOString()
    }]);
    if (subError) console.error("Supabase Sub Error:", subError);
    return new Response(JSON.stringify({
      success: true,
      id: orderData.id,
      // url: createResponse.url,
      // token: createResponse.token,
      message: "Orden creada (Pago desactivado temporalmente)"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Server error: " + String(e) }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
