import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { initTransaction } from '../../../lib/webpay';
import { z } from 'zod';
import { validateRut } from '../../../lib/rutValidator';
import { getCommunePrice, EXPRESS_DELIVERY_PRICE } from '../../../utils/communes';

const CheckoutSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  rut: z.string().refine(validateRut, "RUT inválido (Formato 12.345.678-9)"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono inválido"),
  address: z.string().trim().min(4, "Dirección inválida o muy corta (mínimo 4 caracteres)"),
  commune: z.string().min(1, "Debe seleccionar una comuna"),
  delivery_type: z.string().optional(),
  delivery_date: z.string().optional(),
  important_date: z.string().optional(),
  reason: z.string().optional(),
  receiver_name: z.string().optional(),
  receiver_phone: z.string().optional(),
  dedication: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string().optional(),
    size: z.string().optional(),
    image: z.string().optional(),
    quantity: z.number().min(1).max(100, "Cantidad sospechosa"),
    price: z.number()
  }).passthrough()).min(1, "El carrito está vacío").max(50, "Límite de ítems excedido")
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, rut, address, email, phone, commune, delivery_type, delivery_date, important_date, reason, items, receiver_name, receiver_phone, dedication } = CheckoutSchema.parse(body);

    let shippingCost = 0;
    if (delivery_type === 'express') {
      // Validate hour in Santiago
      const santiagoTime = new Date().toLocaleString("en-US", { timeZone: "America/Santiago" });
      const currentHour = new Date(santiagoTime).getHours();
      
      if (currentHour >= 13) {
        throw new Error("El Delivery Express no está disponible después de las 13:00 hrs");
      }
      shippingCost = EXPRESS_DELIVERY_PRICE;
    } else {
      try {
        shippingCost = getCommunePrice(commune);
      } catch (err) {
        shippingCost = 0; // fallback in case of missing commune
      }
    }

    // Calculate total incl. shipping
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCost;
    const buyOrder = `CART-${Date.now()}`;

    // Format the final shipping address including receiver details
    let finalAddress = address;
    if (receiver_name || receiver_phone || dedication) {
      finalAddress += `\n\n>> DETALLES DESTINATARIO:`;
      if (receiver_name) finalAddress += `\n- Recibe: ${receiver_name}`;
      if (receiver_phone) finalAddress += `\n- Teléfono: ${receiver_phone}`;
      if (dedication) finalAddress += `\n- Mensaje: "${dedication}"`;
    }

    // 1. Save Order (Draft)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
          customer_name: name,
          customer_rut: rut,
          customer_email: email,
          customer_phone: phone,
          shipping_address: finalAddress,
          shipping_commune: commune,
          shipping_cost: shippingCost,
          delivery_type: delivery_type || 'normal',
          delivery_date: delivery_type === 'express' ? 'HOY' : (delivery_date || null),
          total_amount: totalAmount,
          items: items,
          status: 'draft'
      }])
      .select()
      .single();

    if (orderError) {
        console.error('Supabase Order Error:', orderError);
        throw new Error(`DB Error: ${orderError.message}`);
    }

    // 1.5 Save Customer Event (Optional)
    if (important_date && reason) {
      const { error: eventError } = await supabase
        .from('customer_events')
        .insert([{
            customer_name: name,
            customer_rut: rut,
            customer_email: email,
            important_date: important_date,
            reason: reason
        }]);

      if (eventError) {
          console.error('Supabase Customer Event Error:', eventError);
      }
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
