import type { APIRoute } from "astro";
import { getCatalogData } from "../../lib/catalog";

export const GET: APIRoute = async () => {
  const catalog = await getCatalogData();

  return new Response(JSON.stringify(catalog), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
