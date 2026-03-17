export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const apiKey = "AIzaSyCBpc6b9TL8TAvlWCFtHD3el8rKGCWz7Rc";
  try {
    const { address } = await request.json();
    if (!address) {
      return new Response(JSON.stringify({ error: "Address is required" }), {
        status: 400
      });
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:CL&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      const formattedAddress = data.results[0].formatted_address;
      const location = data.results[0].geometry.location;
      return new Response(JSON.stringify({
        isValid: true,
        formattedAddress,
        location
      }), {
        status: 200
      });
    } else {
      return new Response(JSON.stringify({
        isValid: false,
        error: "No se encontró la dirección."
      }), {
        status: 200
        // Return 200 but with isValid: false
      });
    }
  } catch (error) {
    console.error("Google Maps API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to validate address" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
