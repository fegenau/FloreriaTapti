import { s as supabase, i as initTransaction } from '../../../chunks/webpay_BAl_En9i.mjs';
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
    const returnUrl = `http://${request.headers.get("host")}/api/webpay/return`;
    const { url, token } = await initTransaction(price, buyOrder, sessionId, returnUrl);
    const { url: urlFinal, token: tokenFinal } = await initTransaction(price, buyOrder, order.id, returnUrl);
    await supabase.from("orders").update({ status: "pending_payment" }).eq("id", order.id);
    return new Response(JSON.stringify({ url: urlFinal, token: tokenFinal }), {
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
