import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

async function verifyAuth(cookies: import('astro').AstroCookies): Promise<boolean> {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return false;

  const { data, error } = await supabase.auth.getUser(token);
  return !error && !!data.user;
}

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return new Response(
        JSON.stringify({ message: 'Error al obtener categorías', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data: data || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en GET categories:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!(await verifyAuth(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return new Response(
        JSON.stringify({ message: 'El nombre de la categoría es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select();

    if (error) {
      const status = error.code === '23505' ? 409 : 500;
      const message = error.code === '23505' ? 'Ya existe una categoría con ese nombre' : 'Error al crear categoría';
      return new Response(
        JSON.stringify({ message, error: error.message }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Categoría creada exitosamente', data: data[0] }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en POST categories:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
