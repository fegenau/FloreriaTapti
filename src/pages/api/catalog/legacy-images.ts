import type { APIRoute } from 'astro';
import { getLegacyImagePaths } from '../../../lib/catalog';
import { supabase } from '../../../lib/supabase';

async function verifyAuth(cookies: import('astro').AstroCookies): Promise<boolean> {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return false;

  const { data, error } = await supabase.auth.getUser(token);
  return !error && !!data.user;
}

// GET - Imágenes del mapeo estático (catalog.json) para un producto, usadas como
// punto de partida al editar productos que aún no tienen `images` en la base de datos.
export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    if (!(await verifyAuth(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const name = url.searchParams.get('name') || '';
    const images = getLegacyImagePaths(name);

    return new Response(
      JSON.stringify({ images }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en GET legacy-images:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
