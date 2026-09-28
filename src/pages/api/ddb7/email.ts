import type { APIRoute } from 'astro';
import { getAuthUser, isAdminEmail } from '../../../lib/auth';
import { sendDdb7PayloadsEmail } from '../../../lib/email';

// Destinatario del JSON generado (pruebas en dev).
const DDB7_REPORT_EMAIL = import.meta.env.DDB7_REPORT_EMAIL;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getAuthUser(cookies);
  if (!user || !isAdminEmail(user.email)) return json({ error: 'No autorizado' }, 401);
  if (!DDB7_REPORT_EMAIL) return json({ error: 'Falta configurar DDB7_REPORT_EMAIL' }, 500);

  let payloads: unknown[];
  try {
    ({ payloads } = await request.json());
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }
  if (!Array.isArray(payloads) || !payloads.length) return json({ error: 'No hay transacciones' }, 400);

  const result = await sendDdb7PayloadsEmail({ to: DDB7_REPORT_EMAIL, payloads, sentBy: user.email });
  if (!result.success) return json({ error: 'No se pudo enviar el correo' }, 502);
  return json({ ok: true, to: DDB7_REPORT_EMAIL });
};
