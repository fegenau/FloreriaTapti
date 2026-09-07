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
const supabaseKey =
  import.meta.env.SUPABASE_SECRET_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.EXPO_PUBLIC_SUPABASE_KEY ||
  "";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase Config Error:");
  if (!supabaseUrl) console.error("   -> Missing SUPABASE_URL in environment");
  if (!supabaseKey) console.error("   -> Missing SUPABASE_SECRET_KEY in environment");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
