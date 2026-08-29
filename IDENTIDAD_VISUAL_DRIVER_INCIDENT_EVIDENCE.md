# Identidad Visual — Driver Incident Evidence

**Última actualización:** 29 agosto 2026 (convertido desde `VISUAL IDENTITY.docx`, subido el 27 agosto 2026)

> Nota: el contenido original está en inglés (así se definió en el spec). Se
> mantiene tal cual para no perder matices; ver la nota de implementación al
> final para cómo se ajustó en código.

## Brand Feel

The app should communicate:

- Trust
- Protection
- Simplicity
- Evidence
- Calm under pressure
- Professionalism
- Modern technology

The emotional message should be:

> "Something happened. Don't worry. I have a record."

The app should **NOT** feel:

- Corporate
- Complicated
- Legalistic
- Like an Amazon-branded product
- Like another generic delivery-driver app
- Alarmist or stressful

## Color Palette

### Primary — Deep Navy
`#162B3A`

Use for: main navigation, headers, primary brand elements, important text areas.
Meaning: trust, security, professionalism.

### Primary Light — Blue Petroleum
`#28566B`

Use for: secondary UI elements, supporting backgrounds, selected states, secondary buttons.

### Primary CTA — Energetic Teal
`#16A6A1`

Use for: main CTA buttons, "Record Incident", "Save", active controls, important
interactive elements. This is the main **ACTION** color.

### CTA Hover / Pressed — Dark Teal
`#0E817D`

### Success / Evidence Complete — Green
`#3BAA72`

Use for: successfully saved incidents, evidence synchronized, completed records,
successful uploads, confirmation states.

### Warning / Incident — Warm Amber
`#E9A23B`

Use for: incident indicators, warnings, missing information, attention-required
states. Amber should attract attention without making the entire interface feel
dangerous.

### Error / Critical Attention — Coral Red
`#D95C5C`

Use sparingly for: errors, failed uploads, destructive actions, critical warnings.
**Red must not be the dominant brand color.**

### Background — Soft Off-White
`#F7F8F6`

Primary app background. Softer than pure white, reduces visual fatigue, feels
calm and premium. *(Ver nota de implementación — este valor se oscureció
levemente en código.)*

### Card / Surface — White
`#FFFFFF`

Use for: incident cards, block cards, forms, evidence cards, modal surfaces.

### Primary Text — Charcoal
`#172026`

### Secondary Text — Slate
`#64727A`

*(Ver nota de implementación — este valor y los grises de apoyo se
oscurecieron en código.)*

## Color Philosophy

Visual hierarchy:

- **Navy** → Trust
- **Teal** → Action
- **Amber** → Incident / Attention
- **Green** → Evidence / Success
- **Coral** → Error

Do **not** use Amazon's exact orange, blue, branding, logos, or visual identity.
The app must have its own independent brand identity.

## Typography

**Primary font:** Inter — usar en toda la interfaz.

| Peso | Uso |
|---|---|
| Inter Regular | Body text, descripciones, información de soporte |
| Inter Medium | Labels, metadata, navegación secundaria |
| Inter SemiBold | Botones, labels importantes, títulos de tarjeta |
| Inter Bold | Encabezados principales, números importantes, información primaria |

**Optional display font:** Manrope — uso selectivo para hero headlines, títulos
de landing page de marketing, brand statements (ej. "Your delivery. Your
evidence."). Manrope le da personalidad a la marca mientras Inter mantiene la
aplicación extremadamente legible.

## Mobile-First Typography

El driver puede estar mirando el teléfono bajo presión de tiempo significativa.
Priorizar:

- Texto grande y legible
- Contraste fuerte
- Labels cortos
- Touch targets grandes
- Mínimo desorden visual

Nunca hacer que el usuario lea instrucciones largas durante un bloque activo.

## Primary CTA

La acción más importante de la aplicación es **🎙️ RECORD INCIDENT**. Debe ser
visualmente dominante.

Recomendado: botón teal (`#16A6A1`), texto blanco, touch target grande, ícono
de micrófono, esquinas redondeadas, fuerte jerarquía visual.

El driver debe entender inmediatamente:

Algo pasó → toca "Registrar Incidente" → habla → guarda.

## Core UX Principle

El driver NO debe pensar: *"¿Dónde creo un incidente?"*

El driver debe pensar: *"Algo pasó → toco esto → hablo → listo."*

## Brand Positioning

El producto debe sentirse como: **"Tu memoria digital durante tus rutas de
entrega."**

NO como: *"Un sistema de reporte de incidentes."*

El producto protege la capacidad del driver de reconstruir qué pasó después.
La promesa emocional: *"No dependas de tu memoria. Documéntalo cuando pasa."*

## Design Keywords

Modern · Calm · Trustworthy · Protective · Fast · Human · Clean · Professional
· Accessible · Evidence-driven · Voice-first · Mobile-first

## Overall Visual Direction

- Fondo navy profundo
- Teal para acción
- Fondos off-white suaves
- Tarjetas blancas
- Bordes sutiles
- Radio de esquina moderado
- Íconos de línea limpia
- Espaciado generoso
- Touch targets grandes
- Sombras mínimas
- Sin gradientes innecesarios
- Sin desorden visual

La interfaz debe sentirse premium pero simple. El driver debe poder entender
la interfaz en segundos.

## Core Brand Formula

**Trust + Protection + Speed + Evidence + Simplicity = Driver Incident Evidence App**

---

## Nota de implementación (29 agosto 2026)

Durante la primera prueba en vivo manejando un bloque, el fondo muy claro y el
tamaño de letra pequeño dificultaban la lectura rápida con sol/manejando. Se
ajustó en `tailwind.config.ts` y `globals.css`:

- **Fondo:** de `#F7F8F6` a `#EDEFE9` (un poco más oscuro, más separación
  visual contra las tarjetas blancas).
- **Grises de texto secundario** (`text-gray-400/500/600/700`, usados en toda
  la app para labels y texto de apoyo): oscurecidos respecto al default de
  Tailwind para mejor contraste bajo luz solar.
- **Tamaño de fuente:** la escala de tamaños de texto (`text-xs` a `text-2xl`)
  se subió entre 1-2px en cada nivel.

El resto de la paleta (navy, teal, verde, ámbar, coral, tipografía Inter/Manrope)
se mantiene igual a lo definido arriba.
