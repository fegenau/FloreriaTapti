
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { reason, amount, frequency, back_url } = await request.json();
    const res = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: reason || 'Membresía Tapti',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'days',
          billing_day: 1,
          billing_day_proportional: true,
          transaction_amount: Number(amount) || 24990,
          currency_id: 'CLP',
          frequency_type_detail: frequency === 15 ? '15' : '30'
        },
        back_url: back_url || `${new URL('/confirmacion', request.url).origin}/confirmacion`
      } as any)
    });
    const data = await res.json();
    return new Response(JSON.stringify({ init_point: data.init_point || data.redirect_url }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'error' }), { status: 500 });
  }
};
