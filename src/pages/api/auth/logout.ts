import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión:', error);
    }

    // Eliminar cookies
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });

    return new Response(
      JSON.stringify({
        message: 'Sesión cerrada correctamente',
        redirectTo: '/login',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en logout:', error);
    return new Response(
      JSON.stringify({ message: 'Error al cerrar sesión' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  try {
    // Cerrar sesión en Supabase
    await supabase.auth.signOut();

    // Limpiar cookies
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });

    // Redirigir al login
    return redirect('/login');
  } catch (error) {
    console.error('Error en logout:', error);
    return redirect('/login');
  }
};
