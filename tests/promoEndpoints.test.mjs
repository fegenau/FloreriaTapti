// Pruebas de los handlers reales de las rutas API, llamados como funciones con
// Supabase, Webpay, auth y checkoutPricing reemplazados por stubs en memoria
// (tests/hooks.mjs). Ninguna prueba hace red ni escribe en Supabase/Webpay.
// Ejecutar: node --import ./tests/register.mjs --test tests/
import { test, describe, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import { POST as validatePOST } from "../src/pages/api/promo/validate.ts";
import * as adminApi from "../src/pages/api/promo-codes/index.ts";
import { POST as checkoutPOST } from "../src/pages/api/orders/checkout.ts";
import { getMinDeliveryDate } from "../src/utils/deliveryDate.ts";

const req = (body, raw = false) =>
  new Request("http://localhost:4321/api/x", {
    method: "POST",
    headers: { "Content-Type": "application/json", host: "localhost:4321" },
    body: raw ? body : JSON.stringify(body),
  });
const call = async (handler, body, raw) => {
  const res = await handler({ request: req(body, raw), cookies: {} });
  return { status: res.status, body: await res.json() };
};
const row = (o = {}) => ({ id: "1", code: "TAPTI10", percent: 10, expires_at: null, is_active: true, created_at: "", ...o });

beforeEach(() => {
  globalThis.__db = {};
  globalThis.__calls.length = 0;
  globalThis.__webpay = undefined;
  globalThis.__isAdmin = false;
});

describe("POST /api/promo/validate", () => {
  test("codigo valido devuelve solo code y percent", async () => {
    globalThis.__db = { promo: row() };
    const r = await call(validatePOST, { code: " tapti10 " });
    assert.equal(r.status, 200);
    assert.deepEqual(r.body, { code: "TAPTI10", percent: 10 });
  });
  test("inexistente -> 400 con mensaje", async () => {
    const r = await call(validatePOST, { code: "NOEXISTE" });
    assert.deepEqual(r, { status: 400, body: { error: "El código no es válido." } });
  });
  test("vacio / no string / >50 / JSON roto -> 400", async () => {
    assert.equal((await call(validatePOST, { code: "  " })).status, 400);
    assert.equal((await call(validatePOST, { code: 123 })).status, 400);
    assert.equal((await call(validatePOST, {})).status, 400);
    assert.equal((await call(validatePOST, { code: "A".repeat(51) })).status, 400);
    assert.equal((await call(validatePOST, "{no json", true)).status, 400);
  });
  test("body JSON null -> deberia ser 400, no excepcion", async () => {
    // ({ code } = null) lanza TypeError fuera del try/catch del parseo.
    const r = await call(validatePOST, "null", true).catch((e) => ({ status: "throw", body: e.message }));
    assert.equal(r.status, 400, `obtenido: ${JSON.stringify(r)}`);
  });
  test("error de BD (p. ej. tabla inexistente) -> 500 con mensaje generico", async () => {
    globalThis.__db = { promoError: { code: "42P01", message: "relation promo_codes does not exist" } };
    const r = await call(validatePOST, { code: "TAPTI10" });
    assert.equal(r.status, 500);
    assert.equal(r.body.error, "No pudimos validar el código. Intenta de nuevo.");
  });
});

describe("/api/promo-codes (admin)", () => {
  test("sin sesion admin -> 401 en todos los metodos, sin tocar la BD", async () => {
    for (const m of ["GET", "POST", "PATCH", "DELETE"]) {
      const r = await call(adminApi[m], { code: "X" });
      assert.equal(r.status, 401, m);
    }
    assert.equal(globalThis.__calls.length, 0);
  });
  test("POST admin: inserta datos normalizados (stub)", async () => {
    globalThis.__isAdmin = true;
    const r = await call(adminApi.POST, { code: "verano", percent: "20", expires_at: null });
    assert.equal(r.status, 201);
    const ins = globalThis.__calls[0].ops.find((o) => o[0] === "insert")[1][0];
    assert.deepEqual(ins, { code: "VERANO", percent: 20, expires_at: null, is_active: true });
  });
  test("POST admin: invalido -> 400 con el mensaje del schema", async () => {
    globalThis.__isAdmin = true;
    const r = await call(adminApi.POST, { code: "ab", percent: 10 });
    assert.equal(r.status, 400);
    assert.match(r.body.message, /3 a 30/);
    assert.equal((await call(adminApi.POST, "xx", true)).status, 400);
  });
  test("POST admin: duplicado (23505) -> 409", async () => {
    globalThis.__isAdmin = true;
    globalThis.__db = { insertError: { code: "23505", message: 'duplicate key value violates unique constraint "promo_codes_code_key"' } };
    const r = await call(adminApi.POST, { code: "VERANO", percent: 20 });
    assert.equal(r.status, 409);
  });
  test("POST admin: violacion de CHECK no debe reportarse como 'falta crear la tabla'", async () => {
    globalThis.__isAdmin = true;
    globalThis.__db = { insertError: { code: "23514", message: 'new row for relation "promo_codes" violates check constraint "promo_codes_percent_check"' } };
    const r = await call(adminApi.POST, { code: "VERANO", percent: 20 });
    assert.equal(r.status, 500);
    assert.doesNotMatch(r.body.message, /Falta crear la tabla/, `mensaje: ${r.body.message}`);
  });
  test("PATCH/DELETE admin: id no uuid -> 400", async () => {
    globalThis.__isAdmin = true;
    assert.equal((await call(adminApi.PATCH, { id: "1", is_active: true })).status, 400);
    assert.equal((await call(adminApi.PATCH, { id: "6f1c1b7e-8a3f-4f5e-9d1a-2b3c4d5e6f70" })).status, 400);
    assert.equal((await call(adminApi.DELETE, { id: "nope" })).status, 400);
  });
});

describe("POST /api/orders/checkout (todo simulado: sin Supabase ni Webpay reales)", () => {
  const base = () => ({
    name: "Cliente Prueba",
    rut: "12.345.678-5",
    email: "test@example.com",
    phone: "+56911111111",
    address: "Av. Siempre Viva 123",
    commune: "Las Condes", // despacho $1.990
    delivery_type: "normal",
    delivery_date: getMinDeliveryDate(),
    items: [
      { id: "a", name: "Ramo A", quantity: 2, price: 15990 },
      { id: "b", name: "Ramo B", quantity: 1, price: 9990 },
    ], // subtotal 41.970
  });
  const orderInsert = () =>
    globalThis.__calls.find((c) => c.table === "orders" && c.ops.some((o) => o[0] === "insert"))
      ?.ops.find((o) => o[0] === "insert")[1][0];

  test("sin codigo: total = subtotal + envio y NO envia columnas promo_code/discount_amount", async () => {
    const r = await call(checkoutPOST, { ...base(), promo_code: null });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(globalThis.__webpay.amount, 41970 + 1990);
    const o = orderInsert();
    assert.equal(o.total_amount, 43960);
    assert.ok(!("promo_code" in o) && !("discount_amount" in o));
    assert.ok(!globalThis.__calls.some((c) => c.table === "promo_codes"), "no debe consultar promo_codes");
  });
  test("promo_code vacio / solo espacios se trata como sin codigo", async () => {
    for (const promo_code of ["", "   ", undefined]) {
      globalThis.__calls.length = 0;
      const r = await call(checkoutPOST, { ...base(), promo_code });
      assert.equal(r.status, 200);
      assert.ok(!globalThis.__calls.some((c) => c.table === "promo_codes"));
    }
  });
  test("con 15%: descuento solo sobre productos, envio intacto, se guarda codigo y monto", async () => {
    globalThis.__db = { promo: row({ code: "TAPTI15", percent: 15 }) };
    const r = await call(checkoutPOST, { ...base(), promo_code: "tapti15" });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const discount = Math.round(41970 * 0.15); // 6296 (6295.5)
    const o = orderInsert();
    assert.equal(o.discount_amount, discount);
    assert.equal(o.promo_code, "TAPTI15");
    assert.equal(o.shipping_cost, 1990);
    assert.equal(o.total_amount, 41970 - discount + 1990);
    assert.equal(globalThis.__webpay.amount, o.total_amount);
  });
  test("con 100%: se paga solo el envio", async () => {
    globalThis.__db = { promo: row({ percent: 100 }) };
    const r = await call(checkoutPOST, { ...base(), promo_code: "TAPTI10" });
    assert.equal(r.status, 200);
    assert.equal(globalThis.__webpay.amount, 1990);
  });
  test("codigo vencido/inexistente -> 400 promoError y no se crea pedido ni transaccion", async () => {
    globalThis.__db = { promo: null };
    const r = await call(checkoutPOST, { ...base(), promo_code: "FALSO" });
    assert.deepEqual(r, { status: 400, body: { error: "El código no es válido.", promoError: true } });
    assert.equal(orderInsert(), undefined);
    assert.equal(globalThis.__webpay, undefined);
  });
  test("error de BD al validar codigo -> 500 sin crear pedido", async () => {
    globalThis.__db = { promoError: { code: "42P01", message: 'relation "promo_codes" does not exist' } };
    const r = await call(checkoutPOST, { ...base(), promo_code: "TAPTI10" });
    assert.equal(r.status, 500);
    assert.equal(orderInsert(), undefined);
  });
  test("promo_code > 50 caracteres -> 400 de validacion", async () => {
    const r = await call(checkoutPOST, { ...base(), promo_code: "A".repeat(51) });
    assert.equal(r.status, 400);
    assert.ok(r.body.fieldErrors?.promo_code);
  });
});
