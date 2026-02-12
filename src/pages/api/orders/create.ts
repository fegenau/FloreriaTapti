import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { initTransaction, startOneclick } from '../../../lib/webpay';
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
    const startDate = new Date();
    const endDate = new Date();
    const durationDays = parseInt(duration);
    endDate.setDate(startDate.getDate() + durationDays);

    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        order_id: order.id,
        duration_days: durationDays,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: false
      }]);

    if (subError) throw new Error(`Error creating subscription: ${subError.message}`);

    // 3. Start Oneclick Enrollment
    // We pass orderId in the URL to identify the order on return, as Oneclick finish only returns the token
    const returnUrl = `http://${request.headers.get('host')}/api/webpay/return?orderId=${order.id}`;
    
    // Oneclick requires a unique username per user. We use user-{order.id} to map 1-to-1 with the subscription attempt.
    const username = `user-${order.id}`;
    
    // Switch to Oneclick Enrollment
    const { token, url_webpay } = await startOneclick(username, email, returnUrl);

    // Update order status to indicate pending enrollment (optional, or keep pending_payment)
    await supabase
        .from('orders')
        .update({ status: 'pending_payment' }) // Or 'pending_enrollment'
        .eq('id', order.id);

    // Frontend expects { url, token }. Oneclick returns url_webpay.
    return new Response(JSON.stringify({ url: url_webpay, token: token }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error('Error in orders/create:', e);
    // Safer error message conversion
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: 'Server error: ' + errorMessage }), { status: 500 });
  }
}
