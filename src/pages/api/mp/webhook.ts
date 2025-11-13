
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    console.log('MP webhook:', JSON.stringify(payload));
    return new Response('ok', { status: 200 });
  } catch {
    return new Response('bad request', { status: 400 });
  }
};

export const GET: APIRoute = async () => new Response('ok');
