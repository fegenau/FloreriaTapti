import type { APIRoute } from 'astro';
import { verifyAdmin } from '../../../lib/auth';
import { configPendientes, type Ddb7Payload } from '../../../lib/ddb7';

// URL de la API (QA o producción según el entorno).
const DDB7_API_URL = import.meta.env.DDB7_API_URL;

// Token entregado por DDB7 (manual, sección 4.2). Solo en variables de entorno, nunca en el repo.
const DDB7_API_TOKEN = import.meta.env.DDB7_API_TOKEN;

// Límite por request para no exceder el timeout de las funciones de Netlify;
// el cliente envía en lotes de este tamaño.
const MAX_PER_REQUEST = 10;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await verifyAdmin(cookies))) return json({ error: 'No autorizado' }, 401);
  if (!DDB7_API_URL) return json({ error: 'Falta configurar DDB7_API_URL' }, 500);
  if (!DDB7_API_TOKEN) return json({ error: 'Falta configurar DDB7_API_TOKEN' }, 500);

  const pendientes = configPendientes();
  if (pendientes.length) return json({ error: `Campos PENDIENTES en CONFIG: ${pendientes.join(', ')}` }, 400);

  let payloads: Ddb7Payload[];
  try {
    ({ payloads } = await request.json());
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }
  if (!Array.isArray(payloads) || !payloads.length || payloads.length > MAX_PER_REQUEST) {
    return json({ error: `Se esperan entre 1 y ${MAX_PER_REQUEST} transacciones` }, 400);
  }

  const results = [];
  for (const payload of payloads) {
    const n_transaccion = payload?.transaction?.n_transaccion;
    try {
      const res = await fetch(DDB7_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DDB7_API_TOKEN}` },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let respuesta: unknown;
      try {
        respuesta = JSON.parse(text);
      } catch {
        respuesta = { raw: text.slice(0, 500) };
      }
      // id = 0 correcto, id = 1 error
      const ok = res.status === 200 && (respuesta as { id?: unknown })?.id === 0;
      results.push({ n_transaccion, ok, http: res.status, respuesta });
    } catch (err) {
      results.push({ n_transaccion, ok: false, http: null, respuesta: { error: String(err) } });
    }
  }

  return json({ results });
};
