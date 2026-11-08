// Subida de archivos a Supabase Storage vía protocolo S3 (solo servidor).
import { AwsClient } from "aws4fetch";

const S3_ENDPOINT = (import.meta.env.SUPABASE_S3_ENDPOINT || "").replace(/\/+$/, "");
const S3_REGION = import.meta.env.SUPABASE_S3_REGION || "us-west-2";
const S3_ACCESS_KEY_ID = import.meta.env.SUPABASE_S3_ACCESS_KEY_ID || "";
const S3_SECRET_ACCESS_KEY = import.meta.env.SUPABASE_S3_SECRET_ACCESS_KEY || "";
export const STORAGE_BUCKET = import.meta.env.SUPABASE_STORAGE_BUCKET || "catalog-images";

const SUPABASE_URL = (
  import.meta.env.SUPABASE_URL ||
  import.meta.env.PUBLIC_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.EXPO_PUBLIC_SUPABASE_URL ||
  ""
).replace(/\/+$/, "");

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

export function isStorageConfigured(): boolean {
  return Boolean(S3_ENDPOINT && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY);
}

export function publicStorageUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodePath(storagePath)}`;
}

/** Sube un archivo al bucket en storagePath (ej: "Banner/hero/123.avif"). */
export async function uploadToStorage(storagePath: string, body: ArrayBuffer, contentType: string) {
  const client = new AwsClient({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_REGION,
    service: "s3",
  });
  const res = await client.fetch(`${S3_ENDPOINT}/${STORAGE_BUCKET}/${encodePath(storagePath)}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { ok: false as const, error: detail || res.statusText };
  }
  return { ok: true as const };
}
