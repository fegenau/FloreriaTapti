
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, rut, address, duration } = data;

    // Basic Validation
    if (!name || !rut || !address || !duration) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
        status: 400,
      });
    }

    // Insert Order
    // Status 'pending' is default in DB
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          customer_name: name,
          customer_rut: rut,
          shipping_address: address,
          total_amount: duration === '15' ? 20000 : 15000, // Example pricing logic
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Supabase Order Error:', orderError);
      return new Response(JSON.stringify({ error: 'Error al crear la orden en BD' }), {
        status: 500,
      });
    }

    // Insert Subscription
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([
        {
          order_id: orderData.id,
          duration_days: parseInt(duration),
          start_date: new Date().toISOString(), // Starts now
        }
      ]);

    if (subError) {
       console.error('Supabase Subscription Error:', subError);
       // Note: In a real app we might want to rollback the order here
    }

    return new Response(JSON.stringify({ 
      success: true, 
      id: orderData.id,
      message: 'Orden creada exitosamente' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}
