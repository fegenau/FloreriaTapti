import type { APIRoute } from "astro";
import * as XLSX from "xlsx";
import { getAuthUser, isAdminEmail } from "../../lib/auth";
import {
  formatChileDateTime,
  formatPlainDate,
  isValidPeriod,
  listContestEntries,
  periodLabel,
} from "../../lib/contestEntries";

// GET /api/contest-entries?period=YYYY-MM  -> descarga Excel con los participantes del mes (admin).
export const GET: APIRoute = async ({ url, cookies }) => {
  const user = await getAuthUser(cookies);
  if (!isAdminEmail(user?.email)) {
    return new Response("No autorizado", { status: 401 });
  }

  const period = url.searchParams.get("period");
  if (!isValidPeriod(period)) {
    return new Response("Periodo inválido (formato YYYY-MM)", { status: 400 });
  }

  let entries;
  try {
    entries = await listContestEntries(period);
  } catch (error) {
    console.error("Concurso: error leyendo participaciones para Excel:", error);
    return new Response("No se pudieron leer las participaciones", { status: 500 });
  }

  const rows = entries.map((e, i) => ({
    "N°": i + 1,
    "Fecha inscripción": formatChileDateTime(e.created_at),
    Nombre: e.name,
    Email: e.email,
    Teléfono: e.phone,
    Instagram: e.instagram ? `@${e.instagram}` : "",
    "Fecha importante": formatPlainDate(e.important_date),
    Motivo: e.motive,
    "¿Por qué debería ganar?": e.reason,
  }));

  const sheet = XLSX.utils.json_to_sheet(rows, {
    header: [
      "N°",
      "Fecha inscripción",
      "Nombre",
      "Email",
      "Teléfono",
      "Instagram",
      "Fecha importante",
      "Motivo",
      "¿Por qué debería ganar?",
    ],
  });
  sheet["!cols"] = [
    { wch: 5 },
    { wch: 18 },
    { wch: 26 },
    { wch: 30 },
    { wch: 16 },
    { wch: 20 },
    { wch: 16 },
    { wch: 22 },
    { wch: 70 },
  ];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, periodLabel(period).slice(0, 31));
  const buffer = XLSX.write(book, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Concurso_Tapti_${period}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
};
