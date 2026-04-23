import type { APIRoute } from "astro";
import { sendGeneralContactEmail } from "../../lib/email";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, message, subject, weddingDate } = data;

    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({
          error: "Faltan campos obligatorios",
        }),
        { status: 400 }
      );
    }

    const result = await sendGeneralContactEmail({
      name,
      email,
      phone,
      message,
      subject,
      weddingDate,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "No se pudo enviar el correo",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Correo enviado correctamente",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en API de contacto:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor",
      }),
      { status: 500 }
    );
  }
};
