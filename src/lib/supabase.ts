import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key missing. Database operations will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
