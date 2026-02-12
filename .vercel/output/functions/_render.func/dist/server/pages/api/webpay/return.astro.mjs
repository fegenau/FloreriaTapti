import { f as finishOneclick, s as supabase, b as authorizeOneclick, c as confirmTransaction } from '../../../chunks/webpay_CGIi10RO.mjs';
export { renderers } from '../../../renderers.mjs';

const processRequest = async (request, redirect) => {
  try {
    let tokenWs = null;
    let tbkToken = null;
    let tbkOrdenCompra = null;
    let tbkIdSesion = null;
    let orderIdParam = null;
    const method = request.method.toUpperCase();
    const urlObj = new URL(request.url);
    orderIdParam = urlObj.searchParams.get("orderId");
    if (method === "POST") {
      const formData = await request.formData();
      tokenWs = formData.get("token_ws");
      tbkToken = formData.get("TBK_TOKEN");
      tbkOrdenCompra = formData.get("TBK_ORDEN_COMPRA");
      tbkIdSesion = formData.get("TBK_ID_SESION");
    } else {
      tokenWs = urlObj.searchParams.get("token_ws");
      tbkToken = urlObj.searchParams.get("TBK_TOKEN");
      tbkOrdenCompra = urlObj.searchParams.get("TBK_ORDEN_COMPRA");
      tbkIdSesion = urlObj.searchParams.get("TBK_ID_SESION");
    }
    if (orderIdParam) {
      const token = tbkToken || tokenWs;
      if (!token) return redirect("/webpay/return?status=error&message=No+token+received+for+subscription");
      const finishResponse = await finishOneclick(token);
      if (finishResponse.response_code !== 0) {
        return redirect(`/webpay/return?status=failed&message=Inscripción+rechazada`);
      }
      const tbkUser = finishResponse.tbk_user;
      await supabase.from("subscriptions").update({ tbk_user: tbkUser, is_active: true }).eq("order_id", orderIdParam);
      const { data: order } = await supabase.from("orders").select("*").eq("id", orderIdParam).single();
      if (!order) return redirect("/webpay/return?status=error&message=Orden+no+encontrada");
      const amount = order.total_amount;
      const buyOrder = `CHARGE-INIT-${orderIdParam}-${Date.now()}`;
      const username = `user-${orderIdParam}`;
      const authResponse = await authorizeOneclick(username, tbkUser, buyOrder, amount);
      const detail = authResponse.details[0];
      if (detail.response_code === 0 && detail.status === "AUTHORIZED") {
        await supabase.from("orders").update({ status: "paid" }).eq("id", orderIdParam);
        return redirect(`/webpay/return?status=success&orderId=${orderIdParam}`);
      } else {
        await supabase.from("orders").update({ status: "rejected" }).eq("id", orderIdParam);
        return redirect(`/webpay/return?status=failed&message=Pago+rechazado`);
      }
    }
    if (!tokenWs && !tbkToken && tbkIdSesion) {
      return redirect(`/webpay/return?status=timeout&orderId=${tbkIdSesion}&message=El+tiempo+de+pago+ha+expirado`);
    }
    if (tbkToken && !tokenWs) {
      return redirect(`/webpay/return?status=aborted&orderId=${tbkIdSesion || ""}&message=Compra+anulada+por+usuario`);
    }
    if (!tokenWs) {
      return redirect("/webpay/return?status=error&message=Error+en+el+pago:+No+se+recibió+token");
    }
    const response = await confirmTransaction(tokenWs);
    const orderId = response.session_id;
    if (response.response_code === 0 && response.status === "AUTHORIZED") {
      const { error: updateError } = await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);
      if (updateError) {
        console.error("Error updating order:", updateError);
        return redirect(`/webpay/return?status=warning&message=Pago+exitoso+pero+error+actualizando+orden`);
      }
      return redirect(`/webpay/return?status=success&orderId=${orderId}`);
    } else {
      await supabase.from("orders").update({ status: "rejected" }).eq("id", orderId);
      return redirect(`/webpay/return?status=failed&message=${encodeURIComponent("Pago rechazado por el banco")}`);
    }
  } catch (error) {
    console.error("Webpay Process Error:", error);
    return redirect(`/webpay/return?status=error&message=${encodeURIComponent(error.message || "Error desconocido")}`);
  }
};
const POST = ({ request, redirect }) => processRequest(request, redirect);
const GET = ({ request, redirect }) => processRequest(request, redirect);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
