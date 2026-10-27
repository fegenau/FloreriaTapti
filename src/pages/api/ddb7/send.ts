import type { APIRoute } from 'astro';
import { getAuthUser, isAdminEmail } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { configPendientes, type Ddb7Payload } from '../../../lib/ddb7';

// URL de la API (QA o producción según el entorno).
const DDB7_API_URL = import.meta.env.DDB7_API_URL;

// Token entregado por DDB7 (manual, sección 4.2). Solo en variables de entorno, nunca en el repo.
const DDB7_API_TOKEN = import.meta.env.DDB7_API_TOKEN;

// Límite por request para no exceder el timeout de las funciones de Netlify;
// el cliente envía en lotes de este tamaño.
const MAX_PER_REQUEST = 10;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Datos del lote que envía el cliente para el historial (ddb7_envios).
interface LoteMeta {
  envio_id?: string;
  lote?: number;
  lotes_total?: number;
  archivo_vending?: string;
  archivo_tbk?: string;
}

interface Resultado {
  n_transaccion: number;
  ok: boolean;
  http: number | null;
  respuesta: unknown;
}

const texto = (v: unknown, max = 200) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const entero = (v: unknown) => (Number.isInteger(v) && (v as number) > 0 ? (v as number) : null);

// Registra el lote en ddb7_envios. Nunca lanza: si falla, devuelve el error para avisar en pantalla.
async function registrarLote(
  meta: LoteMeta,
  admin: { id: string; email?: string },
  payloads: Ddb7Payload[],
  results: Resultado[],
): Promise<{ ok: boolean; error?: string }> {
  try {
    const exitosos = results.filter((r) => r.ok && Number.isFinite(r.n_transaccion)).map((r) => r.n_transaccion);
    const fallidos = results
      .filter((r) => !r.ok)
      .map((r) => ({
        n_transaccion: r.n_transaccion,
        http: r.http,
        mensaje: (typeof r.respuesta === 'string' ? r.respuesta : JSON.stringify(r.respuesta) ?? '').slice(0, 500),
      }));
    const fechas = payloads
      .map((p) => p?.transaction?.fecha_hora)
      .filter((f): f is string => typeof f === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(f))
      .sort();
    const ids = results.map((r) => r.n_transaccion).filter(Number.isFinite);

    // Reintento: alguna transacción del lote ya había sido aceptada en un envío anterior.
    let reintento = false;
    if (ids.length) {
      const { data, error } = await supabase.from('ddb7_envios').select('id').overlaps('exitosos', ids).limit(1);
      if (error) throw error;
      reintento = (data?.length ?? 0) > 0;
    }

    const lote = entero(meta.lote) ?? 1;
    const { error } = await supabase.from('ddb7_envios').insert({
      envio_id: typeof meta.envio_id === 'string' && UUID_RE.test(meta.envio_id) ? meta.envio_id : crypto.randomUUID(),
      lote,
      lotes_total: Math.max(entero(meta.lotes_total) ?? 1, lote),
      admin_id: admin.id,
      admin_email: admin.email ?? null,
      archivo_vending: texto(meta.archivo_vending),
      archivo_tbk: texto(meta.archivo_tbk),
      fecha_venta_desde: fechas[0] ?? null,
      fecha_venta_hasta: fechas[fechas.length - 1] ?? null,
      total_enviadas: results.length,
      total_ok: exitosos.length,
      total_fallidas: fallidos.length,
      exitosos,
      fallidos,
      reintento,
    });
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : (err as { message?: string })?.message ?? String(err);
    console.error('DDB7: no se pudo registrar el lote en ddb7_envios:', mensaje);
    return { ok: false, error: mensaje };
  }
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getAuthUser(cookies);
  if (!user || !isAdminEmail(user.email)) return json({ error: 'No autorizado' }, 401);
  if (!DDB7_API_URL) return json({ error: 'Falta configurar DDB7_API_URL' }, 500);
  if (!DDB7_API_TOKEN) return json({ error: 'Falta configurar DDB7_API_TOKEN' }, 500);

  const pendientes = configPendientes();
  if (pendientes.length) return json({ error: `Campos PENDIENTES en CONFIG: ${pendientes.join(', ')}` }, 400);

  let payloads: Ddb7Payload[];
  let meta: LoteMeta;
  try {
    ({ payloads, meta = {} } = await request.json());
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }
  if (!Array.isArray(payloads) || !payloads.length || payloads.length > MAX_PER_REQUEST) {
    return json({ error: `Se esperan entre 1 y ${MAX_PER_REQUEST} transacciones` }, 400);
  }

  const results: Resultado[] = [];
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

  const registro = await registrarLote(meta ?? {}, user, payloads, results);

  return json({ results, registro });
};
