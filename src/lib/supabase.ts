import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || import.meta.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase Config Error:");
  if (!supabaseUrl) console.error("   -> Missing SUPABASE_URL in .env");
  if (!supabaseKey) console.error("   -> Missing SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
