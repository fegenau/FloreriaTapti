import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
// @ts-ignore
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { z } from 'zod';

// Define Zod schema for input validation
const OrderSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  rut: z.string().min(8, "RUT inválido"), 
  address: z.string().min(5, "Dirección inválida"),
  duration: z.string().refine((val) => ['15', '30'].includes(val), {
    message: "Duración inválida (debe ser 15 o 30 días)",
  }),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // 1. Zod Validation
    const validation = OrderSchema.safeParse(data);
    if (!validation.success) {
      return new Response(JSON.stringify({ 
        error: 'Datos inválidos', 
        details: validation.error.flatten() 
      }), { status: 400 });
    }

    const { name, rut, address, duration } = validation.data;

    // 2. Calculate amount
    const amount = duration === '15' ? 20000 : 15000;
    
    // 3. Transbank Configuration (Env Vars -> Fallback to Integration)
    // Use WEBPAY_CC and WEBPAY_KEY from .env if available, otherwise default to SDK Integration keys
    const commerceCode = import.meta.env.WEBPAY_CC || IntegrationCommerceCodes.WEBPAY_PLUS;
    const apiKey = import.meta.env.WEBPAY_KEY || IntegrationApiKeys.WEBPAY;
    const environment = import.meta.env.PROD 
      ? Environment.Production 
      : Environment.Integration;

    /*
    const tx = new WebpayPlus.Transaction(new Options(
      commerceCode,
      apiKey,
      environment
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
      return new Response(JSON.stringify({ error: 'Error al crear orden en BD' }), { status: 500 });
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
    // 4. Init Transbank Transaction
    const buyOrder = "O-" + Math.floor(Math.random() * 100000); 
    const sessionId = orderData.id; 
    const returnUrl = new URL(request.url).origin + '/webpay/return';

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
