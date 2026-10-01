// Mapeo de los exports de Vending (Micron) y Transbank al formato de la API de Recepción
// de Transacciones NPU (DDB7). Replica la lógica de generar_payloads.py.
// Módulo puro (sin dependencias de servidor): se usa en el navegador y en el endpoint.
//
// Tipos según Manual API NPU v3.1 (12-01-2026) y respuestas de DDB7 (25-09-2026):
// montos y campos numéricos del detalle como integer, IVA 19%,
// neto = round(total / 1.19), iva = total - neto.
//
// Regla de cruce: mismo monto total y diferencia de hora <= VENTANA_MIN minutos
// (Transbank entrega la hora sin segundos; vending la entrega completa).
// Las anulaciones no se envían: se listan como aviso para revisión manual.

export const DDB7_CONFIG = {
  local: '1',
  terminal: '2', // 1 = Nacional, 2 = Internacional (string, como el ejemplo del manual)
  bupla: 118,
  tvorg: '2015',
  vkont: '4239',
  zsect: '0',
  mwskz: 'C1',
  waers: 'CLP',
  rutemisor: '78030009-4', // RUT sin puntos, con guion y dígito verificador
  rznsocemisor: 'TAPTI SPA',
  giroemisor: 'TAPTI SPA', // VERIFICAR: debería ser la actividad económica
  cdgsiisucur: '1',
  dirorigen: 'PASAJE BELLATRIX 1767',
  cmnaorigen: 'LAS CONDES',
  ciudadorigen: 'SANTIAGO',
  rutrecep: '66666666',
} as const;

const TASA_IVA = 19;
const VENTANA_MIN = 3;
const ZARRI_MULTIPLE = 'Venta flores maquina expendedora';

// Catálogo opcional nombre de producto -> código. Si un producto no está,
// se usa el número de carril como código (p. ej. "0-A02").
const CATALOGO: Record<string, string> = {
  // 'Ramo mediano': 'RM001',
};

// Campos de CONFIG sin completar; mientras existan no se permite enviar.
export function configPendientes(): string[] {
  return Object.entries(DDB7_CONFIG)
    .filter(([, v]) => v === null || v === 'PENDIENTE')
    .map(([k]) => k);
}

export interface Ddb7Detalle {
  nrolindet: number;
  zcant: number;
  zcodp: string;
  zcate: string;
  zsubc: number;
  zsegm: number;
  zsubs: number;
  betrw: number;
  descuentomonto: number;
  zimad: number;
  mntneto: number;
  tasaiva: number;
  iva: number;
  mnttotal: number;
}

export interface Ddb7Transaction {
  fecha_hora: string;
  local: string;
  terminal: string;
  n_transaccion: number;
  blart: 'BO' | 'NC';
  znumd: number | string;
  zarri: string;
  waers: string;
  bldat: string;
  zhora: string;
  budat: string;
  bupla: number;
  tvorg: string;
  zsect: string;
  mwskz: string;
  vkont: string;
  rutemisor: string;
  rznsocemisor: string;
  giroemisor: string;
  cdgsiisucur: string;
  dirorigen: string;
  cmnaorigen: string;
  ciudadorigen: string;
  rutrecep: string;
  rznsocrecep: string;
  contacto: string;
  dirrecep: string;
  cmnarecep: string;
  ciudadrecep: string;
  Detalle: Ddb7Detalle[];
  nrolindr: string;
  tpomov: string;
  glosadr: string;
  tpovalor: number;
  valordr: string;
  monto_escrito: string;
  refer: string;
  neto: number;
}

export interface Ddb7Payload {
  transaction: Ddb7Transaction;
}

export interface MappingResult {
  payloads: Ddb7Payload[];
  sinCruceTbk: string[];
  sinCruceVending: string[];
  avisos: string[];
  errores: string[];
}

type Row = Record<string, unknown>;

// Columnas esperadas (normalizadas con normalizeKey).
const V = {
  serie: 'numero de serie de transaccion interna',
  estado: 'estado de envio',
  fin: 'tiempo de finalizacion del envio',
  pago: 'monto del pago',
  precio: 'precio de venta real',
  deduccion: 'monto de la deduccion',
  cantidad: 'cantidad de producto',
  carril: 'numero de carril de carga',
  producto: 'nombre del producto',
};

const T = {
  unico: 'numero unico',
  tipo: 'tipo de movimiento',
  boleta: 'n de boleta',
  monto: 'monto original de la venta',
  fecha: 'fecha de movimiento',
};

const T_CAMPOS_CERO: [string, string][] = [
  ['propina', 'Propina'],
  ['monto vuelto', 'Monto vuelto'],
  ['monto exento', 'Monto exento'],
];

export const VENDING_KEY_COLUMN = V.serie;
export const TBK_KEY_COLUMN = T.unico;

export function normalizeKey(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[°º.:#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Nombres alternativos de columnas según la versión del export -> nombre usado en el código.
const HEADER_ALIASES: Record<string, string> = {
  'numero de orden interno y externo, numero de serie de la transaccion': V.serie,
};

const headerKey = (value: unknown) => {
  const key = normalizeKey(value);
  return HEADER_ALIASES[key] ?? key;
};

// Convierte una hoja (matriz de celdas) en filas con claves normalizadas.
// Los exports pueden traer títulos antes de la cabecera, así que se busca la
// primera fila que contenga la columna clave.
export function rowsFromMatrix(matrix: unknown[][], keyColumn: string): Row[] {
  const headerIndex = matrix.findIndex((row) => row.some((cell) => headerKey(cell) === keyColumn));
  if (headerIndex === -1) return [];
  const headers = matrix[headerIndex].map(headerKey);
  return matrix
    .slice(headerIndex + 1)
    .filter((row) => row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== ''))
    .map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
}

// '$33.000' -> 33000 ; '33000.0' -> 33000
function montoClp(value: unknown): number {
  if (typeof value === 'number') return Math.round(value);
  const v = String(value ?? '').trim().replace(/[$\s]/g, '');
  if (!v || v === '-') return 0;
  if (/^-?\d{1,3}(\.\d{3})+$/.test(v)) return Number(v.replace(/\./g, ''));
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function toText(value: unknown): string {
  return String(value ?? '').trim();
}

const netoDe = (bruto: number) => Math.round(bruto / (1 + TASA_IVA / 100));

const MESES: Record<string, number> = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8,
  septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

function mesDe(nombre: string): number | undefined {
  const n = normalizeKey(nombre);
  if (MESES[n]) return MESES[n];
  // Abreviaturas: "sep", "sept", "dic"...
  const match = Object.entries(MESES).find(([mes]) => n.length >= 3 && mes.startsWith(n));
  return match?.[1];
}

// Fechas "naive" (sin zona horaria): se representan en UTC para no depender del
// huso horario del navegador. Acepta serial de Excel, ISO, dd/mm/yyyy y el formato
// de Transbank "18 septiembre 2026 07:21 AM".
function toDate(value: unknown): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') return new Date(Math.round((value - 25569) * 86400) * 1000);
  const s = String(value ?? '').trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0)));
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]\.?M\.?)?/i);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], hora24(+m[4], m[7]), +m[5], +(m[6] ?? 0)));
  m = s.match(/^(\d{1,2})\s+(?:de\s+)?([a-záéíóú]+)\.?\s+(?:de\s+)?(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]\.?M\.?)?/i);
  if (m) {
    const mes = mesDe(m[2]);
    if (!mes) return null;
    return new Date(Date.UTC(+m[3], mes - 1, +m[1], hora24(+m[4], m[7]), +m[5], +(m[6] ?? 0)));
  }
  return null;
}

function hora24(h: number, ampm?: string): number {
  const p = ampm?.replace(/\./g, '').toUpperCase();
  if (p === 'PM' && h !== 12) return h + 12;
  if (p === 'AM' && h === 12) return 0;
  return h;
}

const pad = (n: number) => String(n).padStart(2, '0');
const fmtHora = (d: Date) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
const fmtDia = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const fmtFecha = (d: Date) => `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;

interface GrupoVending {
  serie: string;
  fecha: Date;
  total: number;
  filas: Row[];
}

function construirPayload(filas: Row[], mov: Row, fechaVenta: Date): Ddb7Payload {
  const c = DDB7_CONFIG;
  const esNc = normalizeKey(mov[T.tipo]).startsWith('anula');
  const signo = esNc ? -1 : 1;
  const numeroUnico = toText(mov[T.unico]);
  const folio = toText(mov[T.boleta]);
  const znumd = folio && !/^0+$/.test(folio) ? folio : numeroUnico;

  const Detalle: Ddb7Detalle[] = filas.map((f, i) => {
    const nombre = toText(f[V.producto]);
    const precio = montoClp(f[V.precio]);
    const deduccion = montoClp(f[V.deduccion]);
    const pagado = montoClp(f[V.pago]);
    const mntneto = netoDe(pagado);
    return {
      nrolindet: i + 1,
      zcant: montoClp(f[V.cantidad]) || 1,
      zcodp: (CATALOGO[nombre] ?? toText(f[V.carril])).slice(0, 20),
      zcate: nombre.slice(0, 35),
      zsubc: 1,
      zsegm: 1,
      zsubs: 1,
      betrw: signo * netoDe(precio),
      descuentomonto: deduccion ? -netoDe(deduccion) : 0,
      zimad: 0,
      mntneto: signo * mntneto,
      tasaiva: TASA_IVA,
      iva: signo * (pagado - mntneto),
      mnttotal: signo * pagado,
    };
  });

  const nombres = [...new Set(filas.map((f) => toText(f[V.producto])))];
  const zarri = nombres.length === 1 ? nombres[0] : ZARRI_MULTIPLE;

  return {
    transaction: {
      fecha_hora: fmtDia(fechaVenta), // solo fecha (YYYY-MM-DD), como el ejemplo del manual
      local: c.local,
      terminal: c.terminal,
      n_transaccion: Number(numeroUnico),
      blart: esNc ? 'NC' : 'BO',
      znumd: /^\d+$/.test(znumd) ? Number(znumd) : znumd.slice(0, 15),
      zarri: zarri.slice(0, 45),
      waers: c.waers,
      bldat: fmtFecha(fechaVenta),
      zhora: fmtHora(fechaVenta),
      budat: fmtFecha(fechaVenta),
      bupla: c.bupla,
      tvorg: c.tvorg,
      zsect: c.zsect,
      mwskz: c.mwskz,
      vkont: c.vkont,
      rutemisor: c.rutemisor,
      rznsocemisor: c.rznsocemisor,
      giroemisor: c.giroemisor,
      cdgsiisucur: c.cdgsiisucur,
      dirorigen: c.dirorigen,
      cmnaorigen: c.cmnaorigen,
      ciudadorigen: c.ciudadorigen,
      rutrecep: c.rutrecep,
      rznsocrecep: '',
      contacto: '',
      dirrecep: '',
      cmnarecep: '',
      ciudadrecep: '',
      Detalle,
      nrolindr: '',
      tpomov: '',
      glosadr: '',
      tpovalor: 0,
      valordr: '',
      monto_escrito: '',
      refer: '',
      neto: 0,
    },
  };
}

export function mapToDdb7(vendingRows: Row[], tbkRows: Row[]): MappingResult {
  const result: MappingResult = { payloads: [], sinCruceTbk: [], sinCruceVending: [], avisos: [], errores: [] };
  if (!vendingRows.length) result.errores.push('El archivo de vending no tiene filas o no se encontró la columna "Número de serie de transacción interna".');
  if (!tbkRows.length) result.errores.push('El archivo de Transbank no tiene filas o no se encontró la columna "Número único".');
  if (result.errores.length) return result;

  // Solo entregas exitosas, agrupadas por transacción interna (una venta puede tener varios productos).
  const grupos = new Map<string, GrupoVending>();
  for (const f of vendingRows) {
    if (normalizeKey(f[V.estado]) !== 'successful') continue;
    const serie = toText(f[V.serie]);
    const fecha = toDate(f[V.fin]);
    if (!serie || !fecha) {
      result.avisos.push(`Vending: fila sin número de serie o con fecha no reconocida (${toText(f[V.fin])}), se omite.`);
      continue;
    }
    const g = grupos.get(serie) ?? { serie, fecha, total: 0, filas: [] };
    g.filas.push(f);
    g.total += montoClp(f[V.pago]);
    if (fecha > g.fecha) g.fecha = fecha;
    grupos.set(serie, g);
  }

  const usados = new Set<string>();
  for (const mov of tbkRows) {
    const unico = toText(mov[T.unico]);
    const tipo = toText(mov[T.tipo]);
    if (normalizeKey(tipo) !== 'venta') {
      result.avisos.push(`Movimiento '${tipo}' #${unico} omitido: las anulaciones requieren revisión manual (NC).`);
      continue;
    }
    if (!/^\d+$/.test(unico)) {
      result.avisos.push(`Movimiento con número único no numérico (${unico || 'vacío'}), se omite.`);
      continue;
    }
    for (const [col, label] of T_CAMPOS_CERO) {
      if (montoClp(mov[col]) !== 0) result.avisos.push(`#${unico}: ${label} distinto de 0, revisar.`);
    }

    const tTbk = toDate(mov[T.fecha]);
    if (!tTbk) {
      result.avisos.push(`#${unico}: fecha de Transbank no reconocida (${toText(mov[T.fecha])}), se omite.`);
      result.sinCruceTbk.push(unico);
      continue;
    }
    const monto = montoClp(mov[T.monto]);
    const candidatos = [...grupos.values()]
      .filter((g) => !usados.has(g.serie) && g.total === monto)
      .map((g) => ({ g, diff: Math.abs(g.fecha.getTime() - tTbk.getTime()) }))
      .filter(({ diff }) => diff <= VENTANA_MIN * 60_000)
      .sort((a, b) => a.diff - b.diff);

    if (!candidatos.length) {
      result.sinCruceTbk.push(unico);
      continue;
    }
    if (candidatos.length > 1) {
      result.avisos.push(`#${unico}: ${candidatos.length} candidatos en vending, se tomó el más cercano en hora. Revisar.`);
    }
    const { g } = candidatos[0];
    usados.add(g.serie);
    // Se usa la hora de vending (trae segundos) como hora de la venta.
    result.payloads.push(construirPayload(g.filas, mov, g.fecha));
  }

  result.sinCruceVending = [...grupos.keys()].filter((k) => !usados.has(k));
  return result;
}
