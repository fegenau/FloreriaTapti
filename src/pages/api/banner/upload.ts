import type { APIRoute } from "astro";
import { verifyAdmin } from "../../../lib/auth";
import {
  IMAGE_EXTENSIONS,
  isStorageConfigured,
  publicStorageUrl,
  uploadToStorage,
} from "../../../lib/storage";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const SLOTS = new Set(["hero", "concurso", "ramo"]);

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// POST - Sube una imagen del banner a catalog-images/Banner/<slot>/
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await verifyAdmin(cookies))) return json({ message: "No autenticado" }, 401);
  if (!isStorageConfigured()) {
    return json({ message: "Configuración de almacenamiento incompleta en el servidor" }, 500);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const slot = String(formData.get("slot") || "");

    if (!SLOTS.has(slot)) return json({ message: "Tipo de imagen inválido" }, 400);
    if (!(file instanceof File)) return json({ message: "Archivo requerido" }, 400);

    const extension = IMAGE_EXTENSIONS[file.type];
    if (!extension) return json({ message: "Formato no permitido. Usa JPG, PNG, WEBP o AVIF" }, 400);
    if (file.size > MAX_SIZE) return json({ message: "La imagen no debe superar 5MB" }, 400);

    const storagePath = `Banner/${slot}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const result = await uploadToStorage(storagePath, await file.arrayBuffer(), file.type);
    if (!result.ok) {
      console.error("Error subiendo imagen del banner:", result.error);
      return json({ message: "Error al subir la imagen" }, 500);
    }

    return json({ path: storagePath, url: publicStorageUrl(storagePath) }, 201);
  } catch (error) {
    console.error("Error en POST /api/banner/upload:", error);
    return json({ message: "Error interno del servidor" }, 500);
  }
};
