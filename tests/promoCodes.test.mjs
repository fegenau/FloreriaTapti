// Pruebas de src/lib/promoCodes.ts (código real, con Supabase simulado vía tests/hooks.mjs).
// Ejecutar: node --import ./tests/register.mjs --test tests/
import { test, describe, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCode, promoCodeSchema, todayInChile, isExpired, findValidPromo, discountFor, PromoError,
} from "../src/lib/promoCodes.ts";

const issue = (r) => (r.success ? null : r.error.issues[0].message);
const valid = { code: "TAPTI10", percent: 10 };

describe("discountFor", () => {
  test("porcentajes exactos", () => {
    assert.equal(discountFor(10000, 10), 1000);
    assert.equal(discountFor(25990, 15), 3899); // 3898.5 -> 3899
    assert.equal(discountFor(19990, 33), 6597); // 6596.7 -> 6597
  });
  test("redondeo .5 hacia arriba", () => {
    assert.equal(discountFor(15, 10), 2); // 1.5 -> 2
    assert.equal(discountFor(5, 10), 1); // 0.5 -> 1
    assert.equal(discountFor(4, 10), 0); // 0.4 -> 0
  });
  test("100% = subtotal completo, nunca mayor", () => {
    assert.equal(discountFor(19990, 100), 19990);
    assert.equal(discountFor(1, 100), 1);
    assert.equal(discountFor(19990, 150), 19990); // tope aunque el % fuera inválido
  });
  test("subtotal 0", () => assert.equal(discountFor(0, 50), 0));
  test("siempre entero, >= 0 y <= subtotal en un barrido amplio", () => {
    for (let s = 0; s <= 200000; s += 997) {
      for (let p = 1; p <= 100; p++) {
        const d = discountFor(s, p);
        assert.ok(Number.isInteger(d) && d >= 0 && d <= s, `s=${s} p=${p} d=${d}`);
      }
    }
  });
  test("formula del carrito (carrito.astro:588-591, copiada) coincide con la del servidor", () => {
    const client = (subtotalGlobal, percent) =>
      Math.min(subtotalGlobal, Math.round((subtotalGlobal * percent) / 100));
    for (let s = 0; s <= 300000; s += 331) for (let p = 1; p <= 100; p++)
      assert.equal(client(s, p), discountFor(s, p));
  });
});

describe("todayInChile / isExpired", () => {
  afterEach(() => mock.timers.reset());
  const at = (iso) => {
    mock.timers.reset();
    mock.timers.enable({ apis: ["Date"], now: new Date(iso) });
  };

  test("todayInChile devuelve YYYY-MM-DD", () => {
    assert.match(todayInChile(), /^\d{4}-\d{2}-\d{2}$/);
  });
  test("null nunca vence", () => assert.equal(isExpired({ expires_at: null }), false));
  test("hoy (Chile) sigue valido, ayer vencido, manana valido", () => {
    at("2026-11-25T15:00:00Z"); // 12:00 en Chile (UTC-3, horario de verano)
    assert.equal(todayInChile(), "2026-11-25");
    assert.equal(isExpired({ expires_at: "2026-11-25" }), false);
    assert.equal(isExpired({ expires_at: "2026-11-24" }), true);
    assert.equal(isExpired({ expires_at: "2026-11-26" }), false);
  });
  test("borde verano (UTC-3): 23:59 Chile sigue siendo el dia anterior aunque en UTC ya sea el siguiente", () => {
    at("2026-11-26T02:59:59Z"); // 25-nov 23:59:59 en Chile
    assert.equal(todayInChile(), "2026-11-25");
    assert.equal(isExpired({ expires_at: "2026-11-25" }), false);
    at("2026-11-26T03:00:00Z"); // 26-nov 00:00 en Chile
    assert.equal(todayInChile(), "2026-11-26");
    assert.equal(isExpired({ expires_at: "2026-11-25" }), true);
  });
  test("borde invierno (UTC-4)", () => {
    at("2026-07-16T03:59:59Z"); // 15-jul 23:59:59 Chile
    assert.equal(todayInChile(), "2026-07-15");
    at("2026-07-16T04:00:00Z");
    assert.equal(todayInChile(), "2026-07-16");
  });
  test("cambio de anio", () => {
    at("2027-01-01T02:30:00Z"); // 31-dic 23:30 Chile
    assert.equal(isExpired({ expires_at: "2026-12-31" }), false);
    at("2027-01-01T03:30:00Z");
    assert.equal(isExpired({ expires_at: "2026-12-31" }), true);
  });
});

describe("normalizeCode", () => {
  test("trim + mayusculas", () => {
    assert.equal(normalizeCode("  tapti10 "), "TAPTI10");
    assert.equal(normalizeCode("Verano-2026_x"), "VERANO-2026_X");
    assert.equal(normalizeCode("   "), "");
    assert.equal(normalizeCode("\tabc\n"), "ABC");
  });
});

describe("promoCodeSchema", () => {
  test("valido minimo: defaults is_active=true, expires_at=null", () => {
    const r = promoCodeSchema.safeParse(valid);
    assert.ok(r.success);
    assert.deepEqual(r.data, { code: "TAPTI10", percent: 10, expires_at: null, is_active: true });
  });
  test("minusculas y espacios -> mayusculas", () => {
    assert.equal(promoCodeSchema.parse({ ...valid, code: "  verano_26-a " }).code, "VERANO_26-A");
  });
  test("longitudes 3 y 30 validas, 2 y 31 invalidas", () => {
    assert.ok(promoCodeSchema.safeParse({ ...valid, code: "ABC" }).success);
    assert.ok(promoCodeSchema.safeParse({ ...valid, code: "A".repeat(30) }).success);
    assert.ok(!promoCodeSchema.safeParse({ ...valid, code: "AB" }).success);
    assert.ok(!promoCodeSchema.safeParse({ ...valid, code: "A".repeat(31) }).success);
  });
  test("caracteres invalidos", () => {
    for (const code of ["TAPTI 10", "DESCUEÑO", "ÁRBOL", "A.B.C", "A/BC", "<script>", "", "   "]) {
      assert.ok(!promoCodeSchema.safeParse({ ...valid, code }).success, code);
    }
  });
  test("code no string o ausente", () => {
    assert.ok(!promoCodeSchema.safeParse({ ...valid, code: 123 }).success);
    assert.ok(!promoCodeSchema.safeParse({ percent: 10 }).success);
    assert.ok(!promoCodeSchema.safeParse(null).success);
  });
  test("percent limites 0/1/100/101/decimal/negativo/NaN", () => {
    assert.equal(issue(promoCodeSchema.safeParse({ ...valid, percent: 0 })), "El porcentaje mínimo es 1%");
    assert.ok(promoCodeSchema.safeParse({ ...valid, percent: 1 }).success);
    assert.ok(promoCodeSchema.safeParse({ ...valid, percent: 100 }).success);
    assert.equal(issue(promoCodeSchema.safeParse({ ...valid, percent: 101 })), "El porcentaje máximo es 100%");
    assert.equal(issue(promoCodeSchema.safeParse({ ...valid, percent: 10.5 })), "El porcentaje debe ser un número entero");
    assert.ok(!promoCodeSchema.safeParse({ ...valid, percent: -5 }).success);
    assert.ok(!promoCodeSchema.safeParse({ ...valid, percent: NaN }).success);
  });
  test("percent string numerico se convierte", () => {
    assert.equal(promoCodeSchema.parse({ ...valid, percent: "25" }).percent, 25);
    assert.ok(!promoCodeSchema.safeParse({ ...valid, percent: "abc" }).success);
    assert.ok(!promoCodeSchema.safeParse({ ...valid, percent: "" }).success); // "" -> 0
    assert.ok(!promoCodeSchema.safeParse({ ...valid, percent: null }).success); // null -> 0
  });
  test("[hallazgo menor] z.coerce acepta valores no numericos: true -> 1, [50] -> 50", () => {
    // Documenta el comportamiento actual (riesgo bajo: el endpoint exige admin).
    assert.equal(promoCodeSchema.parse({ ...valid, percent: true }).percent, 1);
    assert.equal(promoCodeSchema.parse({ ...valid, percent: [50] }).percent, 50);
  });
  test("expires_at null / ausente -> null", () => {
    assert.equal(promoCodeSchema.parse({ ...valid, expires_at: null }).expires_at, null);
    assert.equal(promoCodeSchema.parse({ ...valid, expires_at: undefined }).expires_at, null);
  });
  test("expires_at vacio ('') -> null", () => {
    const r = promoCodeSchema.safeParse({ ...valid, expires_at: "" });
    assert.ok(r.success, `fallo con: ${issue(r)}`);
    assert.equal(r.data.expires_at, null);
  });
  test("expires_at valido se conserva", () => {
    assert.equal(promoCodeSchema.parse({ ...valid, expires_at: "2026-12-31" }).expires_at, "2026-12-31");
  });
  test("expires_at formato invalido", () => {
    for (const d of ["31-12-2026", "2026/12/31", "2026-1-5", "manana", "2026-12-31T00:00", " 2026-12-31"]) {
      assert.equal(issue(promoCodeSchema.safeParse({ ...valid, expires_at: d })), "Fecha de vencimiento inválida", d);
    }
  });
  test("[hallazgo menor] fecha imposible pasa el schema (2026-13-45, 2026-02-30)", () => {
    // El regex solo valida forma; Postgres la rechazaria y el admin veria "No se pudo guardar el código".
    assert.ok(promoCodeSchema.safeParse({ ...valid, expires_at: "2026-13-45" }).success);
    assert.ok(promoCodeSchema.safeParse({ ...valid, expires_at: "2026-02-30" }).success);
  });
  test("is_active no booleano se rechaza", () => {
    assert.ok(!promoCodeSchema.safeParse({ ...valid, is_active: "true" }).success);
    assert.equal(promoCodeSchema.parse({ ...valid, is_active: false }).is_active, false);
  });
  test("campos extra se descartan (no llegan al insert)", () => {
    const r = promoCodeSchema.parse({ ...valid, id: "x", created_at: "y" });
    assert.ok(!("id" in r) && !("created_at" in r));
  });
});

describe("findValidPromo (Supabase simulado)", () => {
  afterEach(() => { globalThis.__db = {}; globalThis.__calls.length = 0; mock.timers.reset(); });
  const row = (o = {}) => ({ id: "1", code: "TAPTI10", percent: 10, expires_at: null, is_active: true, created_at: "", ...o });

  test("normaliza antes de consultar", async () => {
    globalThis.__db = { promo: row() };
    const p = await findValidPromo("  tapti10 ");
    assert.equal(p.code, "TAPTI10");
    const eq = globalThis.__calls.at(-1).ops.find((o) => o[0] === "eq");
    assert.deepEqual(eq, ["eq", "code", "TAPTI10"]);
  });
  test("vacio -> PromoError sin consultar", async () => {
    await assert.rejects(findValidPromo("   "), (e) => e instanceof PromoError && e.message === "Ingresa un código.");
    assert.equal(globalThis.__calls.length, 0);
  });
  test("inexistente / inactivo / vencido / vence hoy", async () => {
    globalThis.__db = { promo: null };
    await assert.rejects(findValidPromo("X"), { message: "El código no es válido." });
    globalThis.__db = { promo: row({ is_active: false }) };
    await assert.rejects(findValidPromo("TAPTI10"), { message: "El código no es válido." });
    mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-25T15:00:00Z") });
    globalThis.__db = { promo: row({ expires_at: "2026-11-24" }) };
    await assert.rejects(findValidPromo("TAPTI10"), (e) => e instanceof PromoError && e.message === "El código ya venció.");
    globalThis.__db = { promo: row({ expires_at: "2026-11-25" }) };
    assert.equal((await findValidPromo("TAPTI10")).percent, 10);
  });
  test("error de BD -> Error generico (no PromoError)", async () => {
    globalThis.__db = { promoError: { code: "42P01", message: 'relation "public.promo_codes" does not exist' } };
    await assert.rejects(findValidPromo("TAPTI10"), (e) => !(e instanceof PromoError) && /DB Error/.test(e.message));
  });
});
