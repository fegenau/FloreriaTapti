import type { APIRoute } from 'astro';
import { AwsClient } from 'aws4fetch';
import { supabase } from '../../../lib/supabase';
import { slugify } from '../../../utils/slugify.js';

const S3_ENDPOINT = (import.meta.env.SUPABASE_S3_ENDPOINT || '').replace(/\/+$/, '');
const S3_REGION = import.meta.env.SUPABASE_S3_REGION || 'us-west-2';
const S3_ACCESS_KEY_ID = import.meta.env.SUPABASE_S3_ACCESS_KEY_ID || '';
const S3_SECRET_ACCESS_KEY = import.meta.env.SUPABASE_S3_SECRET_ACCESS_KEY || '';
const BUCKET = import.meta.env.SUPABASE_STORAGE_BUCKET || 'catalog-images';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function s3Client(): AwsClient {
  return new AwsClient({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_REGION,
    service: 's3',
  });
}

function objectUrl(storagePath: string): string {
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
  return `${S3_ENDPOINT}/${BUCKET}/${encodedPath}`;
}

async function verifyAuth(cookies: import('astro').AstroCookies): Promise<boolean> {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return false;

  const { data, error } = await supabase.auth.getUser(token);
  return !error && !!data.user;
}

// POST - Subir una imagen a Supabase Storage (bucket catalog-images/Flores) vía protocolo S3
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!(await verifyAuth(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
      return new Response(
        JSON.stringify({ message: 'Configuración de almacenamiento incompleta en el servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const productName = String(formData.get('productName') || 'producto');

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ message: 'Archivo requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ message: 'Formato de imagen no permitido. Usa JPG, PNG, WEBP o AVIF' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (file.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ message: 'La imagen no debe superar 5MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const slug = slugify(productName) || 'producto';
    const relativePath = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const storagePath = `Flores/${relativePath}`;

    const body = await file.arrayBuffer();
    const uploadRes = await s3Client().fetch(objectUrl(storagePath), {
      method: 'PUT',
      body,
      headers: { 'Content-Type': file.type },
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text().catch(() => '');
      return new Response(
        JSON.stringify({ message: 'Error al subir la imagen', error: errorText || uploadRes.statusText }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const publicUrl = `${(import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.EXPO_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')}/storage/v1/object/public/${BUCKET}/${storagePath.split('/').map(encodeURIComponent).join('/')}`;

    return new Response(
      JSON.stringify({
        message: 'Imagen subida exitosamente',
        path: relativePath,
        url: publicUrl,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en POST upload-image:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE - Eliminar una imagen del bucket (?path=slug/archivo.ext)
export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    if (!(await verifyAuth(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const relativePath = url.searchParams.get('path');
    if (!relativePath) {
      return new Response(
        JSON.stringify({ message: 'Ruta de imagen requerida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deleteRes = await s3Client().fetch(objectUrl(`Flores/${relativePath}`), {
      method: 'DELETE',
    });

    if (!deleteRes.ok && deleteRes.status !== 404) {
      const errorText = await deleteRes.text().catch(() => '');
      return new Response(
        JSON.stringify({ message: 'Error al eliminar la imagen', error: errorText || deleteRes.statusText }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Imagen eliminada exitosamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en DELETE upload-image:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
