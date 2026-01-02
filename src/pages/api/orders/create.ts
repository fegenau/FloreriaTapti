
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
// @ts-ignore
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, rut, address, duration } = data;

    if (!name || !rut || !address || !duration) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), { status: 400 });
    }

    // 1. Save local Order
    // Calculate amount: 20000 for 15 days, 15000 for 30 days (Example)
    const amount = duration === '15' ? 20000 : 15000;
    
    /* 
    // TRANSBANK IMPLEMENTATION (Commented out waiting for credentials)
    // Using explicit transaction keys for Development/Test
    // For Production, user should switch to production keys
    const tx = new WebpayPlus.Transaction(new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    ));
    */

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
          customer_name: name,
          customer_rut: rut,
          shipping_address: address,
          total_amount: amount,
          status: 'pending' 
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Supabase Order Error:', orderError);
      return new Response(JSON.stringify({ error: 'Error BD' }), { status: 500 });
    }

    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([{
          order_id: orderData.id,
          duration_days: parseInt(duration),
          start_date: new Date().toISOString(),
      }]);

    if (subError) console.error('Supabase Sub Error:', subError);

    /*
    // 2. Init Transbank Transaction
    const buyOrder = "O-" + Math.floor(Math.random() * 100000); // Unique ID for Transbank
    const sessionId = orderData.id; // We use our UUID as session ID to link back
    const returnUrl = new URL(request.url).origin + '/webpay/return'; // http://localhost:4321/webpay/return

    const createResponse = await tx.create(
      buyOrder, 
      sessionId, 
      amount, 
      returnUrl
    );
    */

    // MOCK RESPONSE
    return new Response(JSON.stringify({ 
      success: true, 
      id: orderData.id,
      // url: createResponse.url,
      // token: createResponse.token,
      message: 'Orden creada (Pago desactivado temporalmente)'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error: ' + String(e) }), { status: 500 });
  }
}

