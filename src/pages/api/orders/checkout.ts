import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { initTransaction } from '../../../lib/webpay';
import { z } from 'zod';
import { validateRut } from '../../../lib/rutValidator';

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, rut, address, email, phone, commune, items } = CheckoutSchema.parse(body);

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const buyOrder = `CART-${Date.now()}`;

    // 1. Save Order (Draft)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
          customer_name: name,
          customer_rut: rut,
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          shipping_commune: commune,
          total_amount: totalAmount,
          status: 'draft'
      }])
      .select()
      .single();

    if (orderError) {
        console.error('Supabase Order Error:', orderError);
        throw new Error(`DB Error: ${orderError.message}`);
    }

    // 2. Initiate Webpay
    const returnUrl = `http://${request.headers.get('host')}/api/webpay/return`;
    const { url, token } = await initTransaction(totalAmount, buyOrder, order.id, returnUrl);

    // 3. Update to Pending Payment
    await supabase
        .from('orders')
        .update({ status: 'pending_payment' })
        .eq('id', order.id);

    return new Response(JSON.stringify({ url, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e: any) {
    console.error("Checkout Error (Safe Log):");
    
    if (e instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      e.errors.forEach((err) => {
        if (err.path) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      return new Response(JSON.stringify({ 
        error: "Error de validación", 
        fieldErrors 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.error(e?.message || String(e));
    if (e?.stack) console.error(e.stack);
    
    return new Response(JSON.stringify({ error: 'Server error: ' + (e?.message || String(e)) }), { status: 500 });
  }
}
