# Pendientes — Driver Incident Evidence

**Última actualización:** 29 agosto 2026

Checklist vivo de las brechas entre `Driver_Incident_Evidence_App_Master_Spec_v1.0.docx`
y lo construido hasta ahora. Se actualiza a medida que cerramos puntos o
descubrimos nuevos durante las pruebas en vivo.

Estados: ⬜ Pendiente · 🟡 Parcial · ✅ Hecho

## 1. Speech-to-text (spec §13, §23)
⬜ Pendiente

El audio del incidente se graba y se guarda como evidencia, pero nunca se
transcribe automáticamente. Hoy el `transcript` solo existe si el driver
escribe a mano en el modo "Texto".

## 2. Generador de respuesta a Amazon (spec §20)
⬜ Pendiente

No existe ninguna pantalla ni lógica para generar un borrador de respuesta
factual a una reclamación de Amazon a partir del incidente registrado. Es
"must have" del MVP en el spec.

## 3. Timeline cronológico del incidente (spec §19)
⬜ Pendiente

El detalle del incidente muestra secciones fijas (categoría, acción,
evidencia, comunicaciones) pero no una línea de tiempo real con cada
evento (foto tomada, audio grabado, llamada a soporte, email recibido,
etc.) y su hora exacta.

## 4. Importar/adjuntar email de Amazon como evidencia (spec §16)
⬜ Pendiente

Hoy solo se puede registrar una comunicación de tipo email con texto
libre + referencia manual. No hay forma de reenviar/adjuntar el email
real ni de extraer datos de él.

## 5. Screenshot Intelligence / OCR (spec §24)
⬜ Pendiente

El campo `blocks.source = "screenshot"` existe en el modelo de datos pero
no hay extracción automática (OCR/vision) de fecha, hora, estación desde
una captura del calendario de Flex.

## 6. Búsqueda de texto libre en transcripción/resumen (spec §18)
⬜ Pendiente

La búsqueda actual filtra por fecha, estación, TBA y categoría, pero no
permite buscar por palabras dentro del relato/transcripción del incidente.

## 7. Login por PIN vs. email/contraseña (spec §6)
🟡 Decisión pendiente de confirmar

El spec propone acceso por PIN. En Fase 0 implementamos auth por
email/contraseña (Supabase Auth) por rapidez de build. Confirmar con
Fercha si el PIN sigue siendo un requisito o si email/contraseña se
queda como decisión final.

---

## Ya resuelto (Fase 0 + ronda de pruebas en vivo)

- PIN-based access → implementado como email/contraseña (ver punto 7)
- Persistencia en la nube (Supabase) ✅
- Cambio de idioma ES/EN ✅
- Gestión de estaciones ✅
- Gestión de bloques (crear/editar/cerrar/borrar), múltiples bloques por
  fecha, monto a pagar visible ✅
- Múltiples TBAs por bloque, múltiples incidentes por TBA ✅
- Captura de incidente: categoría (causa) separada de acción tomada,
  narrativa por audio o texto ✅
- Evidencia: foto y audio adjuntos al incidente ✅
- Registro de comunicaciones (llamada a soporte / email) ✅
- Búsqueda por fecha, estación, TBA, categoría ✅
- Aislamiento de datos por usuario (RLS) ✅
- Formato de hora 12h en toda la app, incidentes agrupados por bloque
  (fecha · hora · estación) en Inicio/Bloque/Buscar ✅
- Identidad visual: mayor tamaño de letra y contraste en toda la app,
  para lectura rápida con sol/manejando (detectado en bloque de prueba
  del 29 agosto 2026) ✅
