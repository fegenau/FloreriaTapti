// Llena la plantilla oficial "Formato único de respaldo de declaración jurada"
// (public/plantillas/FormatDJ_TAPTI.xlsx) con los payloads ya cruzados.
// Se editan solo los valores del XML de la hoja "Formato": logos, estilos, tabla,
// listas desplegables y protección de la plantilla quedan intactos.
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { DDB7_CONFIG, type Ddb7Payload } from './ddb7';

const PLANTILLA = '/plantillas/FormatDJ_TAPTI.xlsx';
const HOJA = 'xl/worksheets/sheet1.xml'; // hoja "Formato"
const PRIMERA_FILA = 7;
const ULTIMA_FILA = 1006; // la tabla de la plantilla llega hasta aquí (1000 filas)

// Textos exactos de las listas de la plantilla (pestañas Leyenda y Categorias).
const CATEGORIA = 'Regalo ';
const TIPO_DOCUMENTO = { BO: 'BO: Boleta', NC: 'NC: Nota de Crédito' } as const;

type Valor = number | string | null;

const escapeXml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// Fecha -> número de serie de Excel (días desde 1899-12-30).
const serialExcel = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / 86_400_000 + 25569;

// 'dd.mm.yyyy' -> serie de Excel
function serialDeBldat(bldat: string): number {
  const [d, m, y] = bldat.split('.').map(Number);
  return serialExcel(y, m, d);
}

// Reemplaza el valor de una celda conservando su estilo (atributo s).
function celda(ref: string, attrs: string, valor: Valor): string {
  const estilo = attrs.match(/\ss="\d+"/)?.[0] ?? '';
  if (valor === null || valor === '') return `<c r="${ref}"${estilo}/>`;
  if (typeof valor === 'number') return `<c r="${ref}"${estilo}><v>${valor}</v></c>`;
  return `<c r="${ref}"${estilo} t="inlineStr"><is><t xml:space="preserve">${escapeXml(valor)}</t></is></c>`;
}

// Aplica valores a celdas de una fila; las celdas que no están en `valores` no se tocan.
function llenarFila(filaXml: string, valores: Record<string, Valor>): string {
  return filaXml.replace(/<c r="([A-Z]+)(\d+)"([^>]*?)(?:\/>|>[\s\S]*?<\/c>)/g, (original, col, num, attrs) =>
    col in valores ? celda(col + num, attrs, valores[col]) : original,
  );
}

export async function generarDeclaracionJurada(payloads: Ddb7Payload[]): Promise<Blob> {
  const capacidad = ULTIMA_FILA - PRIMERA_FILA + 1;
  if (payloads.length > capacidad) {
    throw new Error(`La plantilla admite ${capacidad} filas y hay ${payloads.length} transacciones.`);
  }

  const res = await fetch(PLANTILLA);
  if (!res.ok) throw new Error(`No se encontró la plantilla ${PLANTILLA} (HTTP ${res.status}).`);
  const archivos = unzipSync(new Uint8Array(await res.arrayBuffer()));
  let xml = strFromU8(archivos[HOJA]);

  const hoy = new Date();
  // Las filas vacías vienen como <row .../>: se reconocen para no mezclarlas con la siguiente.
  xml = xml.replace(/<row r="(\d+)"[^>]*?(?:\/>|>[\s\S]*?<\/row>)/g, (fila, numero) => {
    const r = Number(numero);
    if (r === 2) return llenarFila(fila, { H: serialExcel(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate()) });
    if (r === 4) return llenarFila(fila, { H: DDB7_CONFIG.rznsocemisor });
    if (r < PRIMERA_FILA || r > ULTIMA_FILA) return fila;

    // La columna A (correlativo) es fórmula de la plantilla: no se toca.
    const p = payloads[r - PRIMERA_FILA]?.transaction;
    if (!p) return llenarFila(fila, { B: null, C: null, D: null, E: null, F: null, G: null, H: null, I: null });
    return llenarFila(fila, {
      B: serialDeBldat(p.bldat),
      C: `Terminal ${p.terminal}`,
      D: p.bupla,
      E: Number(p.vkont),
      F: TIPO_DOCUMENTO[p.blart],
      G: CATEGORIA,
      H: p.n_transaccion,
      I: p.Detalle.reduce((s, d) => s + d.mntneto, 0),
    });
  });

  archivos[HOJA] = strToU8(xml);
  return new Blob([zipSync(archivos)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// Nombre con el mes y año en curso: FormatDJ_TAPTI_OCTUBRE_2026.xlsx
export function nombreArchivoDJ(): string {
  const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const hoy = new Date();
  return `FormatDJ_TAPTI_${meses[hoy.getMonth()]}_${hoy.getFullYear()}.xlsx`;
}
