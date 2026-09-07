import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

async function verifyAuth(cookies: import('astro').AstroCookies): Promise<boolean> {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return false;

  const { data, error } = await supabase.auth.getUser(token);
  return !error && !!data.user;
}

// PUT - Renombrar categoría (y actualizar los productos que la usan)
export const PUT: APIRoute = async ({ request, params, cookies }) => {
  try {
    if (!(await verifyAuth(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'ID requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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

    const { data: existing, error: fetchError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return new Response(
        JSON.stringify({ message: 'Categoría no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select();

    if (error) {
      const status = error.code === '23505' ? 409 : 500;
      const message = error.code === '23505' ? 'Ya existe una categoría con ese nombre' : 'Error al actualizar categoría';
      return new Response(
        JSON.stringify({ message, error: error.message }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (existing.name !== name) {
      const { error: cascadeError } = await supabase
        .from('catalog')
        .update({ category: name })
        .eq('category', existing.name);

      if (cascadeError) {
        return new Response(
          JSON.stringify({ message: 'Categoría renombrada, pero no se pudieron actualizar los productos asociados', error: cascadeError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ message: 'Categoría actualizada exitosamente', data: data[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en PUT categories:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE - Eliminar categoría (bloqueado si hay productos usándola)
export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    if (!(await verifyAuth(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'ID requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return new Response(
        JSON.stringify({ message: 'Categoría no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { count, error: countError } = await supabase
      .from('catalog')
      .select('id', { count: 'exact', head: true })
      .eq('category', existing.name);

    if (countError) {
      return new Response(
        JSON.stringify({ message: 'Error al verificar productos asociados', error: countError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (count && count > 0) {
      return new Response(
        JSON.stringify({ message: `No se puede eliminar: ${count} producto(s) usan esta categoría. Reasígnalos primero.` }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ message: 'Error al eliminar categoría', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Categoría eliminada exitosamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en DELETE categories:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
