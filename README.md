# Driver Incident Evidence

Bitácora de incidentes para conductores de Amazon Flex — captura rápida (voz/texto),
evidencia en la nube, búsqueda por fecha/estación/TBA. La idea: cuando Amazon
reclama algo días después, el driver tiene un registro de lo que pasó, no solo
su memoria.

## Documentos del proyecto

- **[`CLAUDE.md`](./CLAUDE.md)** — metodología de trabajo para cualquier sesión
  de Claude en este repo (ramas, cuándo pedir GO, flujo técnico). Léelo antes
  de tocar código.
- **[`Driver_Incident_Evidence_App_Master_Spec_v1.0.docx`](./Driver_Incident_Evidence_App_Master_Spec_v1.0.docx)**
  — spec funcional completo (visión, modelo de datos propuesto, flujos, criterios
  de aceptación).
- **[`IDENTIDAD_VISUAL_DRIVER_INCIDENT_EVIDENCE.md`](./IDENTIDAD_VISUAL_DRIVER_INCIDENT_EVIDENCE.md)**
  — paleta de colores, tipografía, tono de marca.
- **[`PENDIENTES_DRIVER_INCIDENT_EVIDENCE.md`](./PENDIENTES_DRIVER_INCIDENT_EVIDENCE.md)**
  — fuente de verdad de qué está hecho y qué falta frente al spec. Es la
  referencia más actualizada de "qué falta para Fase 1", más confiable que
  cualquier lista fija en este README.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + Auth + Storage), con Row Level Security en todas las tablas
- Deploy en **Vercel** — cada push a `main` despliega directo a producción

## Modelo de datos (Fase 0)

`profiles → stations → blocks → (packages | incidentes de bloque) → incidents → incident_packages / communications / evidence`

Un incidente siempre pertenece a un `block`. Puede además estar vinculado a
cero, uno o varios `packages` (TBA) mediante la tabla intermedia
`incident_packages` — así se distinguen incidentes de paquete (falta código
de acceso) de incidentes de bloque completo (se rompió el carro, mal tiempo,
no alcanzó el tiempo). El incidente también separa **categoría** (la causa:
qué pasó) de **acción tomada** (qué hizo el driver al respecto) — son
conceptos distintos, no se mezclan en el mismo campo.

El esquema vive en `supabase/migrations/`, aplicado en orden
(`0001_init.sql` → `0005_block_closed_at.sql`). **Ninguna migración por sí
sola representa el estado actual** — para ver el schema completo hay que
leerlas todas en orden; `0001_init.sql` en particular ya no refleja la
realidad por sí solo (por ejemplo, la categoría `support_instruction` que
tenía se renombró y luego se movió a un campo distinto en migraciones
posteriores).

## Estructura de carpetas

```
src/
  app/
    blocks/        Crear/editar/cerrar bloques, detalle del bloque
    dashboard/      Home: bloque activo + incidentes recientes
    incidents/[id]/ Detalle del incidente, editar, comunicaciones
    login/          Inicio de sesión y registro (email + contraseña)
    search/         Búsqueda de incidentes
    stations/       Gestión de estaciones
  components/       Componentes compartidos (AudioRecorder, Nav, formularios)
  lib/
    i18n/           Diccionario ES/EN y contexto de idioma
    supabase/       Clientes de Supabase (browser y server)
    types.ts        Tipos y helpers compartidos (formato de hora, moneda, etc.)
supabase/
  migrations/       Historial de cambios al schema, en orden
```

## Setup local

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el SQL Editor del proyecto, ejecuta **en orden** todos los archivos de
   `supabase/migrations/` (0001 → 0005).
3. Copia `.env.example` a `.env.local` y completa con los valores de tu
   proyecto (Settings → API):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Instala dependencias y levanta el servidor de desarrollo:
   ```
   npm install
   npm run dev
   ```
5. Abre `http://localhost:3000`, crea una cuenta (`/signup`) e inicia sesión.

## Deploy en Vercel

1. Importa el repo en Vercel.
2. Define las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en Vercel → Settings → Environment
   Variables.
3. Deploy. No requiere configuración adicional (usa el runtime por defecto
   de Next.js).

## Simplificaciones deliberadas de esta Fase 0

- **Auth:** email + contraseña vía Supabase Auth (no el PIN de 4 dígitos del
  spec) — decisión aún abierta, ver punto 7 de `PENDIENTES_DRIVER_INCIDENT_EVIDENCE.md`.
- **Sin transcripción ni IA todavía:** el audio se graba y se guarda como
  evidencia, pero no se transcribe ni se estructura automáticamente.
- **"Bloque activo"** en el dashboard depende de un campo explícito
  (`closed_at`): el driver lo marca como terminado con el botón "Finalizar
  bloque" — no se infiere por hora ni se cierra solo.

## Qué falta

Ver **`PENDIENTES_DRIVER_INCIDENT_EVIDENCE.md`** — se mantiene vivo a lo
largo del proyecto y es la fuente de verdad, no esta sección.
