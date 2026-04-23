import { Resend } from 'resend';

// Inicializamos Resend con la variable de entorno
const resend = new Resend(import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY);

interface OrderEmailInfo {
  email: string;
  orderId: string;
  address?: string;
  errorReason?: string;
  customerName?: string;
  customerPhone?: string;
  items?: any[];
  shippingCost?: number;
  deliveryType?: string;
  deliveryDate?: string;
  type: 'success' | 'payment_error';
}

export const sendOrderNotification = async (info: OrderEmailInfo) => {
  try {
    let subject = '';
    let htmlContent = '';

    if (info.type === 'success') {
      subject = 'Tu pedido ha sido generado con éxito';
      let parsedItems: any[] = [];
      if (Array.isArray(info.items)) {
        parsedItems = info.items;
      } else if (typeof info.items === 'string') {
        try {
          parsedItems = JSON.parse(info.items);
        } catch (e) {
          console.error("Failed to parse info.items", e);
        }
      }

      const itemsListHtml = parsedItems.length > 0 
        ? '<ul>' + parsedItems.map(item => `<li>${item.quantity}x ${item.name || 'Producto'} - $${item.price}</li>`).join('') + '</ul>'
        : '<p>Ver detalles en la plataforma.</p>';

      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50;">¡Gracias por tu compra!</h2>
          <p>Tu pedido ha sido generado con éxito.</p>
          <p><strong>N° de orden:</strong> ${info.orderId}</p>
          <p><strong>Dirección de entrega:</strong> ${info.address ? info.address : 'No especificada'} ${info.deliveryDate ? `<br/><small>Fecha Programada: ${info.deliveryDate}</small>` : ''} ${info.deliveryType === 'express' ? `<br/><small><b>(DELIVERY EXPRESS PARA HOY)</b></small>` : ''}</p>
          <br/>
          <p>Pronto nos pondremos en contacto contigo para más detalles. ¡Que tengas un excelente día!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Este es un correo automático. Por favor, no respondas a este mensaje.</p>
        </div>
      `;

      // Email to the Owner
      const ownerSubject = `Nuevo pedido recibido - Orden ${info.orderId}`;
      const ownerHtmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50;">¡Nuevo pedido web!</h2>
          <p>Se ha recibido una nueva compra exitosa.</p>
          <p><strong>N° de orden:</strong> ${info.orderId}</p>
          <h3>Detalles del Cliente</h3>
          <p><strong>Nombre:</strong> ${info.customerName || 'No especificado'}</p>
          <p><strong>Teléfono:</strong> ${info.customerPhone || 'No especificado'}</p>
          <p><strong>Email:</strong> ${info.email}</p>
          <p><strong>Dirección de entrega:</strong> ${info.address || 'No especificada'} 
             ${info.deliveryDate ? `<br/><b>Fecha Programada:</b> ${info.deliveryDate}` : ''}
             ${info.deliveryType === 'express' ? `<br/><b>¡ATENCIÓN! DELIVERY EXPRESS SOLICITADO PARA HOY</b>` : ''}
          </p>
          <h3>Productos:</h3>
          ${itemsListHtml}
          ${info.shippingCost !== undefined ? `<p><strong>Despacho cobrado:</strong> $${info.shippingCost}</p>` : ''}
        </div>
      `;

      try {
        const ownerEmail = process.env.OWNER_EMAIL || 'tapti.contacto@gmail.com'; // Change to actual owner email
        await resend.emails.send({
          from: 'Florería Tapti <noreply@tapti.cl>',
          to: [ownerEmail],
          subject: ownerSubject,
          html: ownerHtmlContent,
        });
      } catch (ownerErr) {
        console.error('Error enviando email a dueña:', ownerErr);
      }
    } else {
      subject = 'Aviso sobre tu intento de compra';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f44336;">Aviso sobre tu pedido</h2>
          <p>Tu intento de compra para la orden <strong>${info.orderId}</strong> no se ha podido procesar correctamente.</p>
          <p><strong>Motivo:</strong> ${info.errorReason || 'Problemas en el pago, conexión o tiempo de espera expirado'}</p>
          <br/>
          <p>No te preocupes, puedes volver a intentar tu compra desde nuestra tienda.</p>
          <p>Si el problema persiste, contáctanos para ayudarte.</p>
        </div>
      `;
    }

    // Nota: Por defecto Resend (sin dominio verificado) solo permite enviar 
    // al correo del propietario de la cuenta, o desde 'onboarding@resend.dev'.
    // Si configuras un dominio, cámbialo en el "from".
    const response = await resend.emails.send({
      from: 'Florería Tapti <noreply@tapti.cl>', 
      to: [info.email],
      subject: subject,
      html: htmlContent,
    });

    if (response.error) {
      console.error('Error enviando email con Resend:', response.error);
    }
  } catch (error) {
    console.error('Excepción al intentar enviar correo con Resend:', error);
  }
};

interface ContactEmailInfo {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  weddingDate?: string;
}

export const sendGeneralContactEmail = async (info: ContactEmailInfo) => {
  try {
    const ownerEmail = process.env.OWNER_EMAIL || 'tapti.contacto@gmail.com';
    const subject = info.subject || 'Nueva consulta desde la web';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #D4AF37;">${subject}</h2>
        <p>Has recibido un nuevo mensaje desde el sitio web:</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Nombre:</strong> ${info.name}</p>
        <p><strong>Email:</strong> ${info.email}</p>
        <p><strong>Teléfono:</strong> ${info.phone}</p>
        ${info.weddingDate ? `<p><strong>Fecha de Matrimonio:</strong> ${info.weddingDate}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
          ${info.message}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Este es un aviso automático generado por el sitio web de Tapti.</p>
      </div>
    `;

    const response = await resend.emails.send({
      from: 'Florería Tapti <noreply@tapti.cl>',
      to: [ownerEmail],
      subject: subject,
      html: htmlContent,
    });

    if (response.error) {
      console.error('Error enviando email de contacto con Resend:', response.error);
      return { success: false, error: response.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Excepción al enviar email de contacto:', error);
    return { success: false, error };
  }
};
