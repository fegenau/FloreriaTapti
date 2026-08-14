import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Solo aceptar POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Método no permitido' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Obtener datos del request
    const { email, password } = await request.json();

    // Validar que los datos estén presentes
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email y contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Iniciar sesión con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ 
          message: error.message || 'Error al iniciar sesión. Verifica tu email y contraseña.' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data.session) {
      return new Response(
        JSON.stringify({ message: 'No se pudo crear la sesión' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Guardar tokens en cookies. En localhost, secure=true hace que el navegador ignore la cookie,
    // por lo que la sesión no queda persistida y el admin no puede validar el token.
    const isSecureCookie = import.meta.env.PROD;

    cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: 'lax',
      maxAge: data.session.expires_in,
      path: '/',
    });

    if (data.session.refresh_token) {
      cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: isSecureCookie,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }

    return new Response(
      JSON.stringify({
        message: 'Sesión iniciada correctamente',
        redirectTo: '/dashboard',
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
