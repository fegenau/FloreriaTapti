import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdmin } from '../../../lib/auth';

// PUT - Actualizar producto
export const PUT: APIRoute = async ({ request, params, cookies }) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!(await verifyAdmin(cookies))) {
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
    const {
      name,
      description,
      category_ids,
      flower_type,
      unit_price,
      currency,
      sizes,
      images,
      has_form,
      is_quote,
      price_range,
      is_available,
    } = body;

    let updateQuery = supabase
      .from('catalog')
      .update({
        ...(name && { name }),
        ...(description !== undefined && { Description: description }),
        ...(flower_type && { flowerType: flower_type }),
        ...(unit_price !== undefined && { unit_price }),
        ...(currency && { currency }),
        ...(sizes && { sizes }),
        ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
        ...(has_form !== undefined && { hasForm: has_form }),
        ...(is_quote !== undefined && { isQuote: is_quote }),
        ...(price_range !== undefined && { price_range }),
        ...(is_available !== undefined && { isAvailable: is_available }),
      })
      .select();

    let { data, error } = await updateQuery.eq('id', id);

    if ((!data || data.length === 0) && name) {
      const fallback = await supabase
        .from('catalog')
        .update({
          ...(name && { name }),
          ...(description !== undefined && { Description: description }),
          ...(flower_type && { flowerType: flower_type }),
          ...(unit_price !== undefined && { unit_price }),
          ...(currency && { currency }),
          ...(sizes && { sizes }),
          ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
          ...(has_form !== undefined && { hasForm: has_form }),
          ...(is_quote !== undefined && { isQuote: is_quote }),
          ...(price_range !== undefined && { price_range }),
          ...(is_available !== undefined && { isAvailable: is_available }),
        })
        .eq('name', id)
        .select();

      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return new Response(
        JSON.stringify({ message: 'Error al actualizar producto', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Producto no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updated = data[0];

    if (Array.isArray(category_ids)) {
      const { error: deleteLinksError } = await supabase
        .from('catalog_categories')
        .delete()
        .eq('catalog_id', updated.id);

      if (deleteLinksError) {
        return new Response(
          JSON.stringify({ message: 'Error al actualizar categorías del producto', error: deleteLinksError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (category_ids.length > 0) {
        const { error: linkError } = await supabase
          .from('catalog_categories')
          .insert(category_ids.map((categoryId: string) => ({ catalog_id: updated.id, category_id: categoryId })));

        if (linkError) {
          return new Response(
            JSON.stringify({ message: 'Error al actualizar categorías del producto', error: linkError.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Producto actualizado exitosamente', data: updated }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en PUT catalog:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE - Eliminar producto
export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!(await verifyAdmin(cookies))) {
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

    let result = await supabase.from('catalog').delete().eq('id', id);

    if (result.error && result.error.code === 'PGRST116') {
      result = await supabase.from('catalog').delete().eq('name', id);
    }

    if (result.error) {
      return new Response(
        JSON.stringify({ message: 'Error al eliminar producto', error: result.error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Producto eliminado exitosamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en DELETE catalog:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
