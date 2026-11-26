// Hooks de resolución para poder importar el código real de src/ en node:test
// sin tocar producción:
//  - Agrega la extensión .ts a imports relativos sin extensión (Astro/Vite los resuelve; Node no).
//  - Redirige los módulos con efectos externos (supabase, webpay, checkoutPricing, auth)
//    a stubs en memoria: ninguna prueba toca Supabase ni Webpay.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const STUBS = {
  supabase: "./stubs/supabase.mjs",
  webpay: "./stubs/webpay.mjs",
  checkoutPricing: "./stubs/checkoutPricing.mjs",
  auth: "./stubs/auth.mjs",
};

export async function resolve(specifier, context, next) {
  const parent = context.parentURL ?? "";
  if (specifier.startsWith(".") && parent.includes("/src/")) {
    const base = specifier.split("/").pop();
    if (STUBS[base]) {
      return { url: new URL(STUBS[base], import.meta.url).href, shortCircuit: true };
    }
    if (!/\.[a-z]+$/i.test(specifier)) {
      const candidate = new URL(specifier + ".ts", parent);
      if (existsSync(fileURLToPath(candidate))) return { url: candidate.href, shortCircuit: true };
    }
  }
  return next(specifier, context);
}
