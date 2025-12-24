
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error: Missing Google Maps API Key' }), {
      status: 500,
    });
  }

  try {
    const { address } = await request.json();

    if (!address) {
      return new Response(JSON.stringify({ error: 'Address is required' }), {
        status: 400,
      });
    }

    // Geocoding API to check if address exists
    // Restricting to Chile (cl) components
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:CL&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      // Valid address
      const formattedAddress = data.results[0].formatted_address;
      const location = data.results[0].geometry.location;
      
      return new Response(JSON.stringify({ 
        isValid: true, 
        formattedAddress,
        location
      }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ 
        isValid: false, 
        error: 'No se encontró la dirección.' 
      }), {
        status: 200, // Return 200 but with isValid: false
      });
    }

  } catch (error) {
    console.error('Google Maps API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to validate address' }), {
      status: 500,
    });
  }
}
