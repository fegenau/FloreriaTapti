import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { initTransaction } from '../../../lib/webpay';
import { z } from 'zod';
import { validateRut } from '../../../lib/rutValidator';

// Define Zod schema for input validation
const bodySchema = z.object({
  name: z.string().min(2),
  rut: z.string().refine(validateRut, "RUT inválido"),
  address: z.string().min(5),
  email: z.string().email(),
  phone: z.string().min(8),
  commune: z.string().min(3),
  duration: z.string().refine((val) => ["15", "30"].includes(val)),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, rut, address, email, phone, commune, duration } = bodySchema.parse(body);
    
    // ... price calculation ...
    const price = duration === "15" ? 20000 : 15000;
    const buyOrder = `SUB-${Date.now()}`;
    const sessionId = `s-${Math.random().toString(36).substring(7)}`;

    // 1. Create Order in DRAFT
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: name,
        customer_rut: rut,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        shipping_commune: commune,
        total_amount: price,
        status: 'draft' 
      }])
      .select()
      .single();

    if (orderError) throw new Error(`Error creating order: ${orderError.message}`);

    // 2. Create Subscription (Inactive)
    // ... subscription creation ...

    // 3. Init Webpay
    const returnUrl = `http://${request.headers.get('host')}/api/webpay/return`;
    const { url, token } = await initTransaction(price, buyOrder, sessionId, returnUrl);

    // 4. Update Order to PENDING_PAYMENT (using sessionId as link if needed, or by ID)
    // IMPORTANT: Webpay return uses session_id to identify order. We stored order.id in session_id concept previously or need to link them.
    // In previous code, we didn't explicitly link sessionId to orderId in DB, but return.ts uses "session_id" from Webpay response as orderId.
    // So distinct from "sessionId" var here? 
    // Let's ensure we send order.id as session_id to Webpay so return.ts works.
    
    // Re-init transaction with order.id as session_id for consistency with return logic
    const { url: urlFinal, token: tokenFinal } = await initTransaction(price, buyOrder, order.id, returnUrl);

    await supabase
        .from('orders')
        .update({ status: 'pending_payment' })
        .eq('id', order.id);

    return new Response(JSON.stringify({ url: urlFinal, token: tokenFinal }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error: ' + String(e) }), { status: 500 });
  }
}
