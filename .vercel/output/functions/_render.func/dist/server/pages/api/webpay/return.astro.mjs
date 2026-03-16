import { f as finishOneclick, s as supabase, b as authorizeOneclick, c as confirmTransaction } from '../../../chunks/webpay_CGIi10RO.mjs';
import { Resend } from 'resend';
export { renderers } from '../../../renderers.mjs';

const resend = new Resend("re_NDMHZL1R_M4SbxFkRyWwgz7ZWEwFpuaeP");
const sendOrderNotification = async (info) => {
  try {
    let subject = "";
    let htmlContent = "";
    if (info.type === "success") {
      subject = "Tu pedido ha sido generado con éxito";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50;">¡Gracias por tu compra!</h2>
          <p>Tu pedido ha sido generado con éxito.</p>
          <p><strong>N° de orden:</strong> ${info.orderId}</p>
          <p><strong>Dirección de destino:</strong> ${info.address ? info.address : "No especificada (Retiro o similar)"}</p>
          <br/>
          <p>Pronto nos pondremos en contacto contigo para más detalles. ¡Que tengas un excelente día!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Este es un correo automático. Por favor, no respondas a este mensaje.</p>
        </div>
      `;
    } else {
      subject = "Aviso sobre tu intento de compra";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f44336;">Aviso sobre tu pedido</h2>
          <p>Tu intento de compra para la orden <strong>${info.orderId}</strong> no se ha podido procesar correctamente.</p>
          <p><strong>Motivo:</strong> ${info.errorReason || "Problemas en el pago, conexión o tiempo de espera expirado"}</p>
          <br/>
          <p>No te preocupes, puedes volver a intentar tu compra desde nuestra tienda.</p>
          <p>Si el problema persiste, contáctanos para ayudarte.</p>
        </div>
      `;
    }
    const response = await resend.emails.send({
      from: "Florería Tapti <onboarding@resend.dev>",
      to: [info.email],
      subject,
      html: htmlContent
    });
    if (response.error) {
      console.error("Error enviando email con Resend:", response.error);
    } else {
      console.log("Email enviado exitosamente. ID:", response.data?.id);
    }
  } catch (error) {
    console.error("Excepción al intentar enviar correo con Resend:", error);
  }
};

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
      const { data: order2 } = await supabase.from("orders").select("*").eq("id", orderIdParam).single();
      if (!order2) return redirect("/webpay/return?status=error&message=Orden+no+encontrada");
      const amount = order2.total_amount;
      const buyOrder = `CHARGE-INIT-${orderIdParam}-${Date.now()}`;
      const username = `user-${orderIdParam}`;
      const authResponse = await authorizeOneclick(username, tbkUser, buyOrder, amount);
      const detail = authResponse.details[0];
      if (detail.response_code === 0 && detail.status === "AUTHORIZED") {
        await supabase.from("orders").update({ status: "paid" }).eq("id", orderIdParam);
        await sendOrderNotification({
          email: order2.customer_email,
          orderId: orderIdParam,
          address: order2.shipping_address,
          type: "success"
        });
        return redirect(`/webpay/return?status=success&orderId=${orderIdParam}`);
      } else {
        await supabase.from("orders").update({ status: "rejected" }).eq("id", orderIdParam);
        await sendOrderNotification({
          email: order2.customer_email,
          orderId: orderIdParam,
          type: "payment_error",
          errorReason: "Pago rechazado por el banco (Suscripción)"
        });
        return redirect(`/webpay/return?status=failed&message=Pago+rechazado`);
      }
    }
    if (!tokenWs && !tbkToken && tbkIdSesion) {
      const { data: order2 } = await supabase.from("orders").select("*").eq("id", tbkIdSesion).single();
      if (order2) {
        await sendOrderNotification({ email: order2.customer_email, orderId: tbkIdSesion, type: "payment_error", errorReason: "El tiempo de pago ha expirado" });
      }
      return redirect(`/webpay/return?status=timeout&orderId=${tbkIdSesion}&message=El+tiempo+de+pago+ha+expirado`);
    }
    if (tbkToken && !tokenWs) {
      if (tbkIdSesion) {
        const { data: order2 } = await supabase.from("orders").select("*").eq("id", tbkIdSesion).single();
        if (order2) {
          await sendOrderNotification({ email: order2.customer_email, orderId: tbkIdSesion, type: "payment_error", errorReason: "Compra anulada por usuario" });
        }
      }
      return redirect(`/webpay/return?status=aborted&orderId=${tbkIdSesion || ""}&message=Compra+anulada+por+usuario`);
    }
    if (!tokenWs) {
      return redirect("/webpay/return?status=error&message=Error+en+el+pago:+No+se+recibió+token");
    }
    const response = await confirmTransaction(tokenWs);
    const orderId = response.session_id;
    const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (response.response_code === 0 && response.status === "AUTHORIZED") {
      const { error: updateError } = await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);
      if (updateError) {
        console.error("Error updating order:", updateError);
        return redirect(`/webpay/return?status=warning&message=Pago+exitoso+pero+error+actualizando+orden`);
      }
      if (order) {
        await sendOrderNotification({
          email: order.customer_email,
          orderId,
          address: order.shipping_address,
          type: "success"
        });
      }
      return redirect(`/webpay/return?status=success&orderId=${orderId}`);
    } else {
      await supabase.from("orders").update({ status: "rejected" }).eq("id", orderId);
      if (order) {
        await sendOrderNotification({
          email: order.customer_email,
          orderId,
          type: "payment_error",
          errorReason: "Pago rechazado por el banco"
        });
      }
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
