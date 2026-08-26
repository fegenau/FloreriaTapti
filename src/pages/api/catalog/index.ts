import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';


export const GET: APIRoute = async ({ request }) => {
  try {
    const { data, error } = await supabase
      .from('catalog')
      .select('*')
      .order('name', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ message: 'Error al obtener catálogo', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedData = (data || []).map((row) => ({
      ...row,
      id: row.id ?? row.name,
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
    const token = cookies.get('sb-access-token')?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      category, 
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
    if (!name || !category) {
      return new Response(
        JSON.stringify({ message: 'Nombre y categoría son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('catalog')
      .insert([
        {
          name,
          Description: description,
          category,
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

    return new Response(
      JSON.stringify({ message: 'Producto creado exitosamente', data: data[0] }),
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
