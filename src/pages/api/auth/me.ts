import type { APIRoute } from 'astro';
import { getAuthUser } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const user = await getAuthUser(cookies);

    if (!user) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
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
