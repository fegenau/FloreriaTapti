# 🌸 Florería Tapti

![Status](https://img.shields.io/badge/Status-Development-blue)
![CI](https://github.com/floreriatapti/workflows/ci/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green)

Bienvenido a **Florería Tapti**, una plataforma de comercio electrónico moderna diseñada para la venta de arreglos florales y suscripciones. Construida con un enfoque en rendimiento, seguridad y experiencia de usuario.

## 🚀 Tecnologías

Este proyecto utiliza un stack tecnológico moderno y optimizado:

- **Framework**: [Astro](https://astro.build/) (v4) - Para un rendimiento estático superior y SSR selectivo.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) - Diseño responsivo y personalizable.
- **Base de Datos**: [Supabase](https://supabase.com/) - Postgres Database & Auth.
- **Pagos**: [Transbank Webpay Plus](https://www.transbankdevelopers.cl/) - Integración segura para pagos en Chile.
- **Infraestructura**:
  - **Runtime**: Node.js (Adapter SSR)
  - **CI/CD**: GitHub Actions
  - **Seguridad**: Zod (Validación), Helmet (Headers), Middleware

## ✨ Características Principales

- **Catálogo Interactivo**: Exploración de productos con filtrado rápido.
- **Carrito de Compras**: Gestión de estado persistente (Nanostores).
- **Checkout Seguro**: Integración completa con Webpay Plus.
- **Suscripciones**: Módulo para planes de suscripción floral (Quincenal/Mensual).
- **Panel de Administración**: (En desarrollo) Gestión de órdenes y clientes.

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
    Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

    ```env
    # Supabase
    SUPABASE_URL=tu_url_supabase
    SUPABASE_ANON_KEY=tu_anon_key

    # Transbank (Opcional en Dev - Usa credenciales de integración por defecto)
    WEBPAY_CC=tu_codigo_comercio
    WEBPAY_KEY=tu_llave_secreta

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
- **HTTP Headers**: Middleware configurado con headers de seguridad (X-Content-Type-Options, X-Frame-Options, etc.).
- **Protección de Rutas**: Sistema de middleware para rutas protegidas.

## 📂 Estructura del Proyecto

```
/
├── public/          # Archivos estáticos
├── src/
│   ├── components/  # Componentes UI reutilizables
│   ├── layouts/     # Plantillas de páginas
│   ├── lib/         # Utilidades y clientes (Supabase)
│   ├── middleware/  # Lógica de interceptación de peticiones
│   ├── pages/       # Rutas y Endpoints API
│   └── store/       # Estado global (Nanostores)
├── astro.config.mjs # Configuración de Astro
└── package.json     # Dependencias y scripts
```

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
