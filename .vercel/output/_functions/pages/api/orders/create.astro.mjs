import { s as supabase, a as startOneclick } from '../../../chunks/webpay_CGIi10RO.mjs';
import { z } from 'zod';
import { v as validateRut } from '../../../chunks/rutValidator_CFmsqFmV.mjs';
export { renderers } from '../../../renderers.mjs';

const bodySchema = z.object({
  name: z.string().min(2),
  rut: z.string().refine(validateRut, "RUT inválido"),
  address: z.string().min(5),
  email: z.string().email(),
  phone: z.string().min(8),
  commune: z.string().min(3),
  duration: z.string().refine((val) => ["15", "30"].includes(val))
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, rut, address, email, phone, commune, duration } = bodySchema.parse(body);
    const price = duration === "15" ? 2e4 : 15e3;
    const buyOrder = `SUB-${Date.now()}`;
    const sessionId = `s-${Math.random().toString(36).substring(7)}`;
    const { data: order, error: orderError } = await supabase.from("orders").insert([{
      customer_name: name,
      customer_rut: rut,
      customer_email: email,
      customer_phone: phone,
      shipping_address: address,
      shipping_commune: commune,
      total_amount: price,
      status: "draft"
    }]).select().single();
    if (orderError) throw new Error(`Error creating order: ${orderError.message}`);
    const startDate = /* @__PURE__ */ new Date();
    const endDate = /* @__PURE__ */ new Date();
    const durationDays = parseInt(duration);
    endDate.setDate(startDate.getDate() + durationDays);
    const { error: subError } = await supabase.from("subscriptions").insert([{
      order_id: order.id,
      duration_days: durationDays,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: false
    }]);
    if (subError) throw new Error(`Error creating subscription: ${subError.message}`);
    const returnUrl = `http://${request.headers.get("host")}/api/webpay/return?orderId=${order.id}`;
    const username = `user-${order.id}`;
    const { token, url_webpay } = await startOneclick(username, email, returnUrl);
    await supabase.from("orders").update({ status: "pending_payment" }).eq("id", order.id);
    return new Response(JSON.stringify({ url: url_webpay, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("Error in orders/create:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: "Server error: " + errorMessage }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
