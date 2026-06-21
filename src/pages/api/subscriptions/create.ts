import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { startOneclick } from '../../../lib/webpay';
import { z } from 'zod';
import { validateRut } from '../../../lib/rutValidator';

const PLAN_PRICES: Record<string, Record<string, number>> = {
  s: { monthly: 25000, biweekly: 46000, weekly: 84000 },
  m: { monthly: 33000, biweekly: 62000, weekly: 116000 },
  l: { monthly: 42000, biweekly: 78000, weekly: 148000 },
};

const bodySchema = z.object({
  plan: z.enum(['s', 'm', 'l']),
  frequency: z.enum(['monthly', 'biweekly', 'weekly']),
  name: z.string().min(2),
  rut: z.string().refine(validateRut, "RUT inválido"),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
  commune: z.string().min(3),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { plan, frequency, name, rut, email, phone, address, commune } = bodySchema.parse(body);

    const monthlyAmount = PLAN_PRICES[plan][frequency];

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
        total_amount: monthlyAmount,
        status: 'draft'
      }])
      .select()
      .single();

    if (orderError) throw new Error(`Error creating order: ${orderError.message}`);

    // 2. Create Subscription Request (Inactive)
    const { error: subError } = await supabase
      .from('subscription_requests')
      .insert([{
        order_id: order.id,
        plan,
        frequency,
        monthly_amount: monthlyAmount,
        start_date: new Date().toISOString().slice(0, 10),
        is_active: false
      }]);

    if (subError) throw new Error(`Error creating subscription request: ${subError.message}`);

    // 3. Start Oneclick Enrollment
    // orderId is passed in the return URL so /api/webpay/return can identify the order on return.
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const returnUrl = `${protocol}://${host}/api/webpay/return?orderId=${order.id}`;

    const username = `user-${order.id}`;
    const { token, url_webpay } = await startOneclick(username, email, returnUrl);

    await supabase
      .from('orders')
      .update({ status: 'pending_payment' })
      .eq('id', order.id);

    return new Response(JSON.stringify({ url: url_webpay, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error('Error in subscriptions/create:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: 'Server error: ' + errorMessage }), { status: 500 });
  }
}
