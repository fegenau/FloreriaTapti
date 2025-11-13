
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const items = (body?.items || []).map((i: any) => ({
      title: i.name + (i.size ? ` (${i.size})` : ''),
      quantity: 1,
      currency_id: 'CLP',
      unit_price: Number(i.price) || 0
    }));

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer TEST-7730205910513996-111221-691b751c86e6e9d240b249be2b10b9b4-116369376`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items,
        back_urls: {
          success: `${new URL('/confirmacion', request.url).origin}/confirmacion`, 
          failure: `${new URL('/carrito', request.url).origin}/carrito`, 
          pending: `${new URL('/confirmacion', request.url).origin}/confirmacion`
        },
        auto_return: 'approved',
        notification_url: process.env.MP_WEBHOOK_URL || `${new URL('/api/mp/webhook', request.url).origin}/api/mp/webhook`
      })
    });

    const data = await res.json();
    return new Response(JSON.stringify({ init_point: data.init_point || data.sandbox_init_point }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'error' }), { status: 500 });
  }
};
