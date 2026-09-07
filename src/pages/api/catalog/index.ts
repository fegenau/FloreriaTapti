import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdmin } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    const { data, error } = await supabase
      .from('catalog')
      .select('*, catalog_categories(category_id, categories(id, name))')
      .order('name', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ message: 'Error al obtener catálogo', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedData = (data || []).map(({ catalog_categories, ...row }) => ({
      ...row,
      id: row.id ?? row.name,
      categories: (catalog_categories || [])
        .map((cc: any) => cc.categories)
        .filter(Boolean),
    }));

    return new Response(
      JSON.stringify({ data: normalizedData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en GET catalog:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST - Crear nuevo producto
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!(await verifyAdmin(cookies))) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
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

    // Validar campos requeridos
    if (!name || !Array.isArray(category_ids) || category_ids.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Nombre y al menos una categoría son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('catalog')
      .insert([
        {
          name,
          Description: description,
          flowerType: flower_type || [],
          unit_price: unit_price || null,
          currency: currency || 'CLP',
          sizes: sizes || {},
          images: Array.isArray(images) ? images : [],
          hasForm: has_form || false,
          isQuote: is_quote || false,
          price_range: price_range || null,
          isAvailable: is_available !== false,
        },
      ])
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ message: 'Error al crear producto', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const created = data[0];

    const { error: linkError } = await supabase
      .from('catalog_categories')
      .insert(category_ids.map((categoryId: string) => ({ catalog_id: created.id, category_id: categoryId })));

    if (linkError) {
      await supabase.from('catalog').delete().eq('id', created.id);
      return new Response(
        JSON.stringify({ message: 'Error al asociar categorías al producto', error: linkError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Producto creado exitosamente', data: created }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en POST catalog:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
