import { Resend } from 'resend';

// Inicializamos Resend con la variable de entorno
const resend = new Resend(import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY);

interface OrderEmailInfo {
  email: string;
  orderId: string;
  address?: string;
  errorReason?: string;
  type: 'success' | 'payment_error';
}

export const sendOrderNotification = async (info: OrderEmailInfo) => {
  try {
    let subject = '';
    let htmlContent = '';

    if (info.type === 'success') {
      subject = 'Tu pedido ha sido generado con éxito';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50;">¡Gracias por tu compra!</h2>
          <p>Tu pedido ha sido generado con éxito.</p>
          <p><strong>N° de orden:</strong> ${info.orderId}</p>
          <p><strong>Dirección de destino:</strong> ${info.address ? info.address : 'No especificada (Retiro o similar)'}</p>
          <br/>
          <p>Pronto nos pondremos en contacto contigo para más detalles. ¡Que tengas un excelente día!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Este es un correo automático. Por favor, no respondas a este mensaje.</p>
        </div>
      `;
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
      from: 'Florería Tapti <onboarding@resend.dev>', 
      to: [info.email],
      subject: subject,
      html: htmlContent,
    });

    if (response.error) {
      console.error('Error enviando email con Resend:', response.error);
    } else {
      console.log('Email enviado exitosamente. ID:', response.data?.id);
    }

  } catch (error) {
    console.error('Excepción al intentar enviar correo con Resend:', error);
  }
};
