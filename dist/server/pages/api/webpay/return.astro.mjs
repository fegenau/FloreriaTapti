import { c as confirmTransaction, s as supabase } from '../../../chunks/webpay_BAl_En9i.mjs';
export { renderers } from '../../../renderers.mjs';

const processRequest = async (request, redirect) => {
  try {
    let token, tbkToken, tbkOrdenCompra, tbkIdSesion;
    const method = request.method.toUpperCase();
    if (method === "POST") {
      const formData = await request.formData();
      token = formData.get("token_ws");
      tbkToken = formData.get("TBK_TOKEN");
      tbkOrdenCompra = formData.get("TBK_ORDEN_COMPRA");
      tbkIdSesion = formData.get("TBK_ID_SESION");
    } else {
      const url = new URL(request.url);
      token = url.searchParams.get("token_ws");
      tbkToken = url.searchParams.get("TBK_TOKEN");
      tbkOrdenCompra = url.searchParams.get("TBK_ORDEN_COMPRA");
      tbkIdSesion = url.searchParams.get("TBK_ID_SESION");
    }
    if (!token && !tbkToken && tbkIdSesion) {
      return redirect(`/webpay/return?status=timeout&orderId=${tbkIdSesion}&message=El+tiempo+de+pago+ha+expirado`);
    }
    if (tbkToken && !token) {
      return redirect(`/webpay/return?status=aborted&orderId=${tbkIdSesion || ""}&message=Compra+anulada+por+usuario`);
    }
    if (!token) {
      return redirect("/webpay/return?status=error&message=Error+en+el+pago:+No+se+recibió+token");
    }
    const response = await confirmTransaction(token);
    const orderId = response.session_id;
    if (response.response_code === 0 && response.status === "AUTHORIZED") {
      const { error: updateError } = await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);
      if (updateError) {
        console.error("Error updating order:", updateError);
        return redirect(`/webpay/return?status=warning&message=Pago+exitoso+pero+error+actualizando+orden`);
      }
      await supabase.from("subscriptions").update({ is_active: true }).eq("order_id", orderId);
      return redirect(`/webpay/return?status=success&orderId=${orderId}`);
    } else {
      await supabase.from("orders").update({ status: "rejected" }).eq("id", orderId);
      return redirect(`/webpay/return?status=failed&message=${encodeURIComponent("Pago rechazado por el banco")}`);
    }
  } catch (error) {
    console.error("Webpay Commit Error:", error);
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
