const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = {};
for (const rawLine of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
}

const url = env.NEXT_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || env.EXPO_PUBLIC_SUPABASE_KEY || env.PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

console.log('URL ok:', Boolean(url));
console.log('KEY ok:', Boolean(key));

if (!url || !key) {
  console.error('Faltan variables de entorno');
  process.exit(1);
}

(async () => {
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('catalog').select('*').limit(1);
  console.log('rows:', data ? data.length : 0);
  console.log('error:', error ? error.message : 'none');
  if (error) {
    console.log(JSON.stringify(error, null, 2));
    process.exitCode = 1;
  }
})();
