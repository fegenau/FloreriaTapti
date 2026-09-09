# 🌸 Florería Tapti

![Status](https://img.shields.io/badge/Status-Development-blue)
![CI](https://github.com/floreriatapti/workflows/ci/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green)

Bienvenido a **Florería Tapti**, una plataforma de comercio electrónico moderna diseñada para la venta de arreglos florales y suscripciones. Construida con un enfoque en rendimiento, seguridad y experiencia de usuario.

## 🚀 Tecnologías

Este proyecto utiliza un stack tecnológico moderno y optimizado:

- **Framework**: [Astro](https://astro.build/) (v5) - Para un rendimiento estático superior y SSR selectivo.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) - Diseño responsivo y personalizable.
- **Base de Datos y Auth**: [Supabase](https://supabase.com/) - Postgres Database, con autenticación basada en cookies de sesión.
- **Pagos**: [Transbank Webpay Plus](https://www.transbankdevelopers.cl/) y [Mercado Pago](https://www.mercadopago.cl/) (preferencias y suscripciones) - Integraciones seguras para pagos en Chile.
- **Infraestructura**:
  - **Adapter**: `@astrojs/netlify` (SSR)
  - **CI/CD**: GitHub Actions
  - **Seguridad**: Zod (Validación), Middleware de autenticación/autorización, bcrypt

## ✨ Características Principales

- **Catálogo Interactivo**: Exploración de productos con filtrado rápido y categorías.
- **Carrito de Compras**: Gestión de estado persistente (Nanostores).
- **Checkout Seguro**: Integración completa con Webpay Plus y Mercado Pago.
- **Suscripciones**: Módulo para planes de suscripción floral (Quincenal/Mensual) vía Mercado Pago.
- **Panel de Administración**: Gestión de catálogo, categorías y reportes, protegido por autenticación de sesión y lista blanca de correos admin (`ADMIN_EMAILS`).

## 🛠️ Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos

- Node.js v18.17.1 o superior.
- Cuenta en Supabase y Transbank (Developers).

### Pasos

1.  **Clonar el repositorio**

    ```bash
    git clone https://github.com/tu-usuario/floreriatapti.git
    cd floreriatapti
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz del proyecto con tus propias credenciales:

    ```env
    # Supabase (Postgres + Auth + Storage)
    NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tu_publishable_key
    SUPABASE_SECRET_KEY=tu_secret_key   # Solo servidor, ignora RLS. Nunca exponer al navegador.

    # Supabase Storage vía protocolo S3 (para imágenes de catálogo)
    SUPABASE_S3_ENDPOINT=tu_endpoint_s3
    SUPABASE_S3_REGION=tu_region
    SUPABASE_S3_ACCESS_KEY_ID=tu_access_key
    SUPABASE_S3_SECRET_ACCESS_KEY=tu_secret_key
    SUPABASE_STORAGE_BUCKET=catalog-images

    # Transbank Webpay Plus (Opcional en Dev - Usa credenciales de integración por defecto)
    WEBPAY_CC=tu_codigo_comercio
    WEBPAY_KEY=tu_llave_secreta
    WEBPAY_ENV=integration

    # Mercado Pago (preferencias y suscripciones)
    MP_ACCESS_TOKEN=tu_access_token

    # Emails con acceso de administrador (separados por coma), usados en /admin, /dashboard y sus APIs
    ADMIN_EMAILS=admin1@correo.com,admin2@correo.com

    # Envío de correos transaccionales
    RESEND_API_KEY=tu_resend_api_key

    # Google Maps (validación de direcciones)
    GOOGLE_MAPS_API_KEY=tu_google_maps_key

    # Control temporal de checkout (true/false)
    CHECKOUT_ENABLED=false
    PUBLIC_CHECKOUT_ENABLED=false
    ```

4.  **Ejecutar en desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:4321`.

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción (SSR).
- `npm run preview`: Vista previa de la build local.
- `npm run format`: Formatea el código con Prettier.

## 🔒 Seguridad

El proyecto implementa varias capas de seguridad:

- **Validación de Datos**: Schemas estrictos con `zod` en todos los endpoints de API.
- **Autenticación por Cookies**: Sesión basada en cookies (`sb-access-token`), verificada contra Supabase.
- **Autorización de Administración**: Las rutas y páginas de `/admin` y `/dashboard` exigen sesión válida y que el email pertenezca a la lista blanca `ADMIN_EMAILS`.
- **Protección de Rutas**: Middleware centralizado (`src/middleware`) y helpers reutilizables de verificación de auth (`src/lib/auth.ts`).

## 📂 Estructura del Proyecto

```
/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes UI reutilizables
│   ├── data/            # Datos estáticos/semilla
│   ├── layouts/         # Plantillas de páginas
│   ├── lib/             # Utilidades y clientes (Supabase, auth, catálogo, Webpay, email)
│   ├── middleware/       # Interceptación de peticiones (sesión, protección de rutas)
│   ├── pages/
│   │   ├── admin/       # Panel de administración (reportes, etc.)
│   │   ├── api/
│   │   │   ├── auth/          # Login, logout, signup, sesión actual
│   │   │   ├── catalog/       # CRUD de productos e imágenes
│   │   │   ├── categories/    # CRUD de categorías
│   │   │   ├── mp/            # Mercado Pago (preferencias, suscripciones, webhook)
│   │   │   ├── orders/        # Creación y checkout de órdenes
│   │   │   ├── reports/       # Reportes de administración
│   │   │   ├── subscriptions/ # Suscripciones florales
│   │   │   └── webpay/        # Retorno de pagos Webpay Plus
│   │   └── ...          # Páginas públicas (catálogo, carrito, login, dashboard, etc.)
│   ├── store/           # Estado global (Nanostores)
│   └── utils/           # Utilidades varias
├── astro.config.mjs     # Configuración de Astro (adapter Netlify)
└── package.json         # Dependencias y scripts
```

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
