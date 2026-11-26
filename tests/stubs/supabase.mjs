// Cliente Supabase falso. Cada prueba fija globalThis.__db con:
//   { promo: <fila|null>, promoError: <error|null>, insertError: <error|null> }
// y lee globalThis.__calls para ver qué se habría escrito.
globalThis.__calls = globalThis.__calls ?? [];
const state = () => (globalThis.__db ??= {});

function builder(table) {
  const call = { table, ops: [] };
  globalThis.__calls.push(call);
  const b = {
    select(...a) { call.ops.push(["select", ...a]); return b; },
    eq(...a) { call.ops.push(["eq", ...a]); return b; },
    order(...a) { call.ops.push(["order", ...a]); return b; },
    insert(rows) { call.ops.push(["insert", rows]); return b; },
    update(v) { call.ops.push(["update", v]); return b; },
    delete() { call.ops.push(["delete"]); return b; },
    async maybeSingle() {
      if (table === "promo_codes") return { data: state().promo ?? null, error: state().promoError ?? null };
      return { data: null, error: null };
    },
    async single() {
      if (state().insertError) return { data: null, error: state().insertError };
      return { data: { id: "order-test-1" }, error: null };
    },
    then(res, rej) { return Promise.resolve({ data: null, error: null }).then(res, rej); },
  };
  return b;
}

export const supabase = { from: builder, auth: { getUser: async () => ({ data: { user: null }, error: null }) } };
export function createAuthClient() { return supabase; }
