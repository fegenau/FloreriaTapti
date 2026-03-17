export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const payload = await request.json();
    console.log("MP webhook:", JSON.stringify(payload));
    return new Response("ok", { status: 200 });
  } catch {
    return new Response("bad request", { status: 400 });
  }
};
const GET = async () => new Response("ok");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
