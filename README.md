
# Tapti Flores y Regalos — MVP e‑commerce (Astro + Tailwind)

## Requisitos
- Node 18+
- Cuenta de **Mercado Pago** (credenciales de producción/sandbox)

## Pasos
1. `cp .env.example .env` y completa `MP_ACCESS_TOKEN`.
2. `npm i`
3. `npm run dev` (http://localhost:4321)
4. Para build: `npm run build`

## Deploy recomendado
- **Vercel** (simple) o **Netlify**.
- En **Vercel**, agrega Variables de Entorno (`MP_ACCESS_TOKEN`, `MP_WEBHOOK_URL`).
- Configura el **Webhook** en Mercado Pago -> Notificaciones Web.

## Estructura
- `src/pages/` páginas públicas.
- `src/pages/api/mp/` endpoints serverless (create-preference, webhook, create-preapproval).
- `src/components/` componentes UI.
- `src/data/products.json` catálogo de ejemplo.

## Membresías
- Página `/membresias` crea **preapproval** (suscripciones) con MP (quincenal/mensual).
