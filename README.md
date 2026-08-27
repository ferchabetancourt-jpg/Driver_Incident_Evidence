# Driver_Incident_Evidence

Bitácora de incidentes para Amazon Flex — captura rápida, evidencia en la nube, búsqueda por fecha/estación/TBA.

Este repo contiene la **Fase 0**: captura manual/estructurada (categoría por tap, audio grabado, foto opcional) con persistencia en Supabase, sin transcripción ni IA todavía. Ver el spec completo en `Driver_Incident_Evidence_App_Master_Spec_v1.0.docx`.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + Auth + Storage), con Row Level Security en todas las tablas
- Deploy en **Vercel**

## Modelo de datos (Fase 0)

`profiles → stations → blocks → (packages | incidentes de bloque) → incidents → incident_packages / communications / evidence`

Un incidente siempre pertenece a un `block`. Puede además estar vinculado a cero, uno o varios `packages` (TBA) mediante la tabla intermedia `incident_packages` — así se distinguen incidentes de paquete (falta código de acceso) de incidentes de bloque completo (se rompió el carro, mal tiempo, no alcanzó el tiempo).

Ver el esquema completo en `supabase/migrations/0001_init.sql`.

## Setup local

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el SQL Editor del proyecto, ejecuta el contenido de `supabase/migrations/0001_init.sql`.
3. Copia `.env.example` a `.env.local` y completa con los valores de tu proyecto (Settings → API):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Instala dependencias y levanta el servidor de desarrollo:
   ```
   npm install
   npm run dev
   ```
5. Abre `http://localhost:3000`, crea una cuenta (`/signup`), confirma el correo, e inicia sesión.

## Deploy en Vercel

1. Importa el repo en Vercel.
2. Define las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en Vercel → Settings → Environment Variables.
3. Deploy. No requiere configuración adicional (usa el runtime por defecto de Next.js).

## Simplificaciones deliberadas de esta Fase 0

- **Auth:** email + contraseña vía Supabase Auth (no el PIN de 4 dígitos del spec). Resuelve el requisito de "cloud-first, multi-dispositivo" más rápido; el PIN puede añadirse después como acceso rápido sobre esta base.
- **Sin transcripción ni IA todavía:** el audio se graba y se guarda como evidencia, pero no se transcribe ni se estructura automáticamente. La categoría y el TBA se capturan por tap, no por voz.
- **"Bloque activo"** en el dashboard es simplemente el bloque más reciente del usuario — no hay lógica de cierre/apertura de bloque todavía.

## Qué falta para Fase 1

Transcripción de audio, extracción de entidades, OCR de screenshots de bloque, generador de respuesta a Amazon, PIN de acceso rápido, cola offline.
