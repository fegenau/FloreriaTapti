import { s as supabase, i as initTransaction } from '../../../chunks/webpay_BAl_En9i.mjs';
import { z } from 'zod';
import { v as validateRut } from '../../../chunks/rutValidator_CFmsqFmV.mjs';
export { renderers } from '../../../renderers.mjs';

const CheckoutSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  rut: z.string().refine(validateRut, "RUT inválido (Formato 12.345.678-9)"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono inválido"),
  address: z.string().min(5, "Dirección inválida"),
  commune: z.string().min(3, "Comuna inválida"),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1),
    price: z.number()
  })).min(1, "El carrito está vacío")
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, rut, address, email, phone, commune, items } = CheckoutSchema.parse(body);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const buyOrder = `CART-${Date.now()}`;
    const { data: order, error: orderError } = await supabase.from("orders").insert([{
      customer_name: name,
      customer_rut: rut,
      customer_email: email,
      customer_phone: phone,
      shipping_address: address,
      shipping_commune: commune,
      total_amount: totalAmount,
      status: "draft"
    }]).select().single();
    if (orderError) {
      console.error("Supabase Order Error:", orderError);
      throw new Error(`DB Error: ${orderError.message}`);
    }
    const returnUrl = `http://${request.headers.get("host")}/api/webpay/return`;
    const { url, token } = await initTransaction(totalAmount, buyOrder, order.id, returnUrl);
    await supabase.from("orders").update({ status: "pending_payment" }).eq("id", order.id);
    return new Response(JSON.stringify({ url, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("Checkout Error (Safe Log):");
    console.error(e?.message || String(e));
    if (e?.stack) console.error(e.stack);
    return new Response(JSON.stringify({ error: "Server error: " + (e?.message || String(e)) }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
