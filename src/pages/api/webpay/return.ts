import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { finishOneclick, authorizeOneclick, confirmTransaction } from '../../../lib/webpay'; // keep confirmTransaction just in case, but usually we'd remove it if unused here.
// Actually, checkout.ts uses initTransaction which defaults to Webpay Plus, and that needs a return handler too?
// Wait. checkout.ts sets returnUrl to /api/webpay/return as well!
// This file needs to handle BOTH Webpay Plus (for cart) AND Oneclick (for subscription).
// We must distinguish them.
// Webpay Plus sends token_ws. Oneclick sends TBK_TOKEN (and we added orderId param).
// If token_ws is present -> Webpay Plus (confirmTransaction)
// If TBK_TOKEN is present ONLY -> Oneclick (finishOneclick) (or aborted Plus)
// But Plus aborted also sends TBK_TOKEN.
// How to distinguish? 
// Plus success: token_ws is present.
// Oneclick success: TBK_TOKEN is present.
// Plus aborted: TBK_TOKEN present, no token_ws.
// Oneclick aborted: ??? (Usually same)
// We can use the 'orderId' param in URL to distinguish? 
// I added ?orderId=... ONLY to create.ts (Oneclick). checkout.ts does NOT add it in query params (it relies on sessionId).
// So: if (url has orderId param) -> Oneclick logic. Else -> Webpay Plus logic.

// Let's rewrite the imports to include all.

const processRequest = async (request: Request, redirect: any) => {
  try {
    let tokenWs: string | null = null;
    let tbkToken: string | null = null;
    let tbkOrdenCompra: string | null = null;
    let tbkIdSesion: string | null = null;
    let orderIdParam: string | null = null;

    const method = request.method.toUpperCase();
    const urlObj = new URL(request.url);
    orderIdParam = urlObj.searchParams.get('orderId'); // Specific to Oneclick flow we implemented

    if (method === 'POST') {
        const formData = await request.formData();
        tokenWs = formData.get('token_ws') as string | null;
        tbkToken = formData.get('TBK_TOKEN') as string | null;
        tbkOrdenCompra = formData.get('TBK_ORDEN_COMPRA') as string | null;
        tbkIdSesion = formData.get('TBK_ID_SESION') as string | null;
    } else {
        tokenWs = urlObj.searchParams.get('token_ws'); // Variable naming changed from token to tokenWs to avoid conflict
        tbkToken = urlObj.searchParams.get('TBK_TOKEN');
        tbkOrdenCompra = urlObj.searchParams.get('TBK_ORDEN_COMPRA');
        tbkIdSesion = urlObj.searchParams.get('TBK_ID_SESION');
    }

    // === BRANCH: Oneclick Mall (Subscription) ===
    if (orderIdParam) {
        // We are in Oneclick flow because we explicitly added orderId to the URL in create.ts
        const token = tbkToken || tokenWs; // Usually TBK_TOKEN for Oneclick
        
        if (!token) return redirect('/webpay/return?status=error&message=No+token+received+for+subscription');

        // 1. Finish Enrollment
        const finishResponse = await finishOneclick(token);
        
        if (finishResponse.response_code !== 0) {
            return redirect(`/webpay/return?status=failed&message=Inscripción+rechazada`);
        }

        const tbkUser = finishResponse.tbk_user;

        // 2. Update Subscription
        await supabase.from('subscriptions').update({ tbk_user: tbkUser, is_active: true }).eq('order_id', orderIdParam);

        // 3. Authorize First Payment
        const { data: order } = await supabase.from('orders').select('*').eq('id', orderIdParam).single();
        if (!order) return redirect('/webpay/return?status=error&message=Orden+no+encontrada');

        const amount = order.total_amount;
        const buyOrder = `CHARGE-INIT-${orderIdParam}-${Date.now()}`; 
        const username = `user-${orderIdParam}`;

        const authResponse = await authorizeOneclick(username, tbkUser, buyOrder, amount);
        const detail = authResponse.details[0];

        if (detail.response_code === 0 && detail.status === 'AUTHORIZED') {
             await supabase.from('orders').update({ status: 'paid' }).eq('id', orderIdParam);
             return redirect(`/webpay/return?status=success&orderId=${orderIdParam}`);
        } else {
             await supabase.from('orders').update({ status: 'rejected' }).eq('id', orderIdParam);
             return redirect(`/webpay/return?status=failed&message=Pago+rechazado`);
        }
    }

    // === BRANCH: Webpay Plus (Cart) ===
    // This logic handles checkout.ts flow where no orderIdParam is passed

    // Case 1: Timeout (No token_ws, No TBK_TOKEN, but has TBK_ID_SESION)
    if (!tokenWs && !tbkToken && tbkIdSesion) {
        return redirect(`/webpay/return?status=timeout&orderId=${tbkIdSesion}&message=El+tiempo+de+pago+ha+expirado`);
    }

    // Case 2: User aborted (TBK_TOKEN present)
    if (tbkToken && !tokenWs) {
       return redirect(`/webpay/return?status=aborted&orderId=${tbkIdSesion || ''}&message=Compra+anulada+por+usuario`);
    }

    // Case 3: Error / Invalid (No token at all)
    if (!tokenWs) {
      return redirect('/webpay/return?status=error&message=Error+en+el+pago:+No+se+recibió+token');
    }

    // Confirm Webpay Transaction
    const response = await confirmTransaction(tokenWs);
    const orderId = response.session_id; // For Plus, session_id is orderId
    
    if (response.response_code === 0 && response.status === 'AUTHORIZED') {
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId);

        if (updateError) {
            console.error('Error updating order:', updateError);
            return redirect(`/webpay/return?status=warning&message=Pago+exitoso+pero+error+actualizando+orden`);
        }
        
        return redirect(`/webpay/return?status=success&orderId=${orderId}`); // No subscription update here, that is only for Oneclick branch
    } else {
        await supabase.from('orders').update({ status: 'rejected' }).eq('id', orderId);
        return redirect(`/webpay/return?status=failed&message=${encodeURIComponent('Pago rechazado por el banco')}`);
    }

  } catch (error: any) {
    console.error('Webpay Process Error:', error);
    return redirect(`/webpay/return?status=error&message=${encodeURIComponent(error.message || 'Error desconocido')}`);
  }
};

export const POST: APIRoute = ({ request, redirect }) => processRequest(request, redirect);
export const GET: APIRoute = ({ request, redirect }) => processRequest(request, redirect);
  