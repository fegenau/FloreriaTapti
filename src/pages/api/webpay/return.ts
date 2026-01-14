import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { confirmTransaction } from '../../../lib/webpay';

const processRequest = async (request: Request, redirect: any) => {
  try {
    let token, tbkToken, tbkOrdenCompra, tbkIdSesion;

    const method = request.method.toUpperCase();
    
    if (method === 'POST') {
        const formData = await request.formData();
        token = formData.get('token_ws') as string | null;
        tbkToken = formData.get('TBK_TOKEN') as string | null;
        tbkOrdenCompra = formData.get('TBK_ORDEN_COMPRA') as string | null;
        tbkIdSesion = formData.get('TBK_ID_SESION') as string | null;
    } else {
        const url = new URL(request.url);
        token = url.searchParams.get('token_ws');
        tbkToken = url.searchParams.get('TBK_TOKEN');
        tbkOrdenCompra = url.searchParams.get('TBK_ORDEN_COMPRA');
        tbkIdSesion = url.searchParams.get('TBK_ID_SESION');
    }

    // Case 1: Timeout (No token_ws, No TBK_TOKEN, but has TBK_ID_SESION)
    if (!token && !tbkToken && tbkIdSesion) {
        return redirect(`/webpay/return?status=timeout&orderId=${tbkIdSesion}&message=El+tiempo+de+pago+ha+expirado`);
    }

    // Case 2: User aborted (TBK_TOKEN present)
    if (tbkToken && !token) {
       return redirect(`/webpay/return?status=aborted&orderId=${tbkIdSesion || ''}&message=Compra+anulada+por+usuario`);
    }

    // Case 3: Error / Invalid (No token at all)
    // Some flows might send token_ws in POST but query params in GET? Usually consistent.
    if (!token) {
      return redirect('/webpay/return?status=error&message=Error+en+el+pago:+No+se+recibió+token');
    }

    const response = await confirmTransaction(token);
    const orderId = response.session_id;
    
    if (response.response_code === 0 && response.status === 'AUTHORIZED') {
        
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId);

        if (updateError) {
            console.error('Error updating order:', updateError);
            return redirect(`/webpay/return?status=warning&message=Pago+exitoso+pero+error+actualizando+orden`);
        }
        
        await supabase
            .from('subscriptions') 
            .update({ is_active: true })
            .eq('order_id', orderId);

        return redirect(`/webpay/return?status=success&orderId=${orderId}`);
    } else {
        // Payment rejected by bank
        await supabase.from('orders').update({ status: 'rejected' }).eq('id', orderId);
        return redirect(`/webpay/return?status=failed&message=${encodeURIComponent('Pago rechazado por el banco')}`);
    }

  } catch (error: any) {
    console.error('Webpay Commit Error:', error);
    return redirect(`/webpay/return?status=error&message=${encodeURIComponent(error.message || 'Error desconocido')}`);
  }
};

export const POST: APIRoute = ({ request, redirect }) => processRequest(request, redirect);
export const GET: APIRoute = ({ request, redirect }) => processRequest(request, redirect);
