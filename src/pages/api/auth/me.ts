import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Obtener el token de acceso de las cookies
    const accessToken = cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener la sesión actual
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: session.user?.id,
          email: session.user?.email,
          user_metadata: session.user?.user_metadata,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return new Response(
      JSON.stringify({ user: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
