import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.SUPABASE_URL ||
  import.meta.env.PUBLIC_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.EXPO_PUBLIC_SUPABASE_URL ||
  "";
  

// Este cliente corre exclusivamente en el servidor (rutas API / SSR de Astro),
// por eso usa la secret/service_role key: ignora RLS y evita depender de la
// anon key para operaciones de admin. Nunca importar este módulo en código
// que se ejecute en el navegador.
//
// A propósito NO hay fallback a keys públicas (anon/publishable): si la
// secret key falta, las tablas con RLS (orders, categories, catalog, etc.)
// devuelven 200 con arrays vacíos en silencio, lo que hace pasar por "no hay
// datos" lo que en realidad es una variable de entorno faltante en el deploy.
const supabaseKey =
  import.meta.env.SUPABASE_SECRET_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  "";

if (!supabaseUrl) {
  throw new Error("Supabase config error: falta SUPABASE_URL (o su equivalente) en el entorno");
}
if (!supabaseKey) {
  throw new Error(
    "Supabase config error: falta SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor. " +
    "Este cliente no debe usar la anon/publishable key porque RLS bloquea el acceso de admin en silencio."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Key pública (anon/publishable) para operaciones de auth (signIn/signUp/signOut).
// Nunca reutilizar el cliente `supabase` de arriba para esto: en supabase-js, en
// cuanto un cliente tiene una sesión activa (p. ej. tras signInWithPassword), ese
// cliente empieza a usar el JWT del usuario como Authorization header en sus
// queries .from(...) en vez de la key con la que fue creado. Como `supabase` es
// un singleton compartido por todo el proceso del servidor, eso pisaría la
// secret key para TODAS las requests concurrentes de TODOS los usuarios,
// haciendo que las tablas con RLS (catalog, categories, etc.) empiecen a
// devolver arrays vacíos apenas alguien inicia sesión.
const supabaseAnonKey =
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.EXPO_PUBLIC_SUPABASE_KEY ||
  "";

if (!supabaseAnonKey) {
  throw new Error(
    "Supabase config error: falta la anon/publishable key en el entorno (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY / EXPO_PUBLIC_SUPABASE_KEY / etc.), necesaria para las operaciones de auth."
  );
}

// Devuelve un cliente nuevo en cada llamada: las operaciones de auth
// (signIn/signUp/signOut) son por request, nunca deben compartir estado de
// sesión entre requests ni con el cliente de datos `supabase`.
export function createAuthClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
