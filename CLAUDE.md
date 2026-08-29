# CLAUDE.md — Driver Incident Evidence

Instrucciones de trabajo para cualquier sesión de Claude en este repo. Léelo completo antes de tocar código.

Repo: ferchabetancourt-jpg/Driver_Incident_Evidence — Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres, Auth, Storage, RLS)
Deploy: Vercel, despliegue automático a producción con cada push a `main`

---

## A) Metodología general

1. Antes de tocar código: diagnostica leyendo el código real (no asumas), compáralo contra la documentación del proyecto si existe, y da un diagnóstico concreto con causa raíz — no una opinión vaga.
2. Agrupa las mejoras en una lista numerada antes de empezar a programar, para que Fercha vea el alcance completo y pueda priorizar u ordenar.
3. Si hay una decisión de diseño, UX, nombre o contenido que es subjetiva (no tiene una respuesta técnica correcta), pregunta con 2-4 opciones concretas en vez de adivinar o implementar una preferencia propia sin confirmar.
4. Espera un "GO" explícito antes de tocar código, correr un comando, o ejecutar cualquier acción no 100% reversible con un simple deshacer — esto incluye: `git push`, merge de PR, cambios de configuración fuera del código (hosting, dominios, variables de entorno, base de datos). Dile primero qué vas a hacer.
5. Si mientras se implementa algo se traba, o aparece ambigüedad real, o un fork de diseño — para y pregunta. No improvises sola.
6. Cuando la configuración es externa (no código): un paso a la vez, esperando confirmación de que se hizo antes de dar el siguiente.
7. Verifica que el proyecto funcione de verdad antes de subir cualquier cambio (build/compile si aplica, pruebas visuales si aplica) — nunca subas algo sin probarlo primero.
8. Explica en español simple, sin jerga técnica, qué cambió y por qué — Fercha no es programadora.
9. Sé honesta si algo falla o no tienes acceso/control sobre una herramienta externa — nunca inventes que "ya quedó" sin confirmarlo. Da pasos claros para resolverlo del otro lado si hace falta.
10. Con PRs de GitHub: abre el PR, da el link del preview para probar, y espera confirmación antes de mergear a producción — nunca mergees sin que se pida explícitamente. Al mergear, no borres la rama salvo que se pida.
11. Mantén viva la lista de pendientes a lo largo del proyecto (en `PENDIENTES_DRIVER_INCIDENT_EVIDENCE.md`, ver sección B) — cosas identificadas pero pospuestas, deuda técnica, ideas que surgieron pero no eran prioridad. Sácalas a relucir cuando tenga sentido retomarlas, no dejes que se pierdan en el chat.
12. Sugiere optimizaciones de forma proactiva cuando veas algo que puede ayudar (patrón repetido, fricción de UX, riesgo a futuro) aunque no se haya pedido — coméntalo breve, no lo implementes sin que se pida.
13. El contenido final (copy, textos de marca, mensajes a usuarios/clientes) siempre lo aprueba Fercha. Puedes proponer y redactar borradores, pero no lo des por publicado sin su visto bueno explícito.
14. Nunca commitees `.env`, API keys ni credenciales. Si algo las necesita, avisa y pide que se agreguen directo en el hosting/donde corresponda — nunca las pidas por chat ni las escribas en el código.

---

## B) Los 3 documentos obligatorios del repo

**Esta sección es escalable según el proyecto.** Para una app personal simple, sin marca ni identidad visual propia, sin gente externa involucrada (ej. una herramienta de uso personal): puedes saltarte esta sección salvo que Fercha pida explícitamente crear estos documentos. Para un proyecto con marca, contenido, o más de una persona involucrada (ej. un producto que se vende o se comparte con un equipo): sí aplica completa.

Este proyecto sí aplica la sección completa (tiene marca, identidad visual propia, y se distribuirá a otros drivers). Los 3 documentos, con sus nombres reales en este repo:

1. **`Driver_Incident_Evidence_App_Master_Spec_v1.0.docx`** — qué hace la app, cómo funciona, la lógica core, el flujo de usuario. Es la referencia técnica/funcional. (Sigue en `.docx`, no se ha convertido a `.md` todavía.)

2. **`IDENTIDAD_VISUAL_DRIVER_INCIDENT_EVIDENCE.md`** — paleta de colores, tipografía, tono de voz, reglas de marca (convertido desde `VISUAL IDENTITY.docx` el 29 agosto 2026, con nota de implementación al final documentando el ajuste de contraste/tamaño de letra). Ningún color, fuente o patrón visual nuevo se agrega sin anotarlo aquí primero. Antes de aplicar cualquier estilo nuevo, consúltalo — no asumas un default genérico ("moderno", "minimalista", etc.) sin verificar qué pide este proyecto en particular.

3. **`PENDIENTES_DRIVER_INCIDENT_EVIDENCE.md`** — fuente de verdad de qué está hecho y qué falta, viva a lo largo de todo el proyecto (no solo de una sesión). Debe llevar fecha de "Última actualización" (y "Meta de entrega" si existe) visible arriba. Hoy está organizado por brecha de spec (pendiente/parcial/hecho) más una lista de lo ya resuelto; falta reorganizarlo por **dueño y tipo** como sugiere esta plantilla — por ejemplo:
   - Pendientes que dependen de otra persona (cliente, socio, proveedor), por nombre
   - Pendientes que dependen de Fercha
   - Bloques de trabajo técnico, numerados
   - Pendientes de contenido/cuentas que no son código

   Si algo está implementado en el código pero sin marcar en el doc (o viceversa), avisa en vez de asumir — y actualiza el doc cuando se cierre un bloque.

**Precisión en créditos:** cuando el crédito de código/diseño y el de contenido/idea son de personas distintas, sé precisa en cómo se redacta cualquier atribución/copyright — no dejes que el crédito de una persona insinúe autoría sobre lo que hizo la otra.

---

## C) Flujo técnico — verificar antes de pushear

- Corre el proyecto localmente (o el equivalente según el stack) y verifica visualmente antes de reportar algo como listo — con capturas en mobile y desktop si es una interfaz visual.
- Si hay texto/elementos superpuestos a una imagen o ilustración: no calcules posición "a ojo" desde una captura chica — verifica en zoom contra el asset real antes de fijar coordenadas.
- Prueba con datos reales antes de dar una feature por terminada, no solo con datos de ejemplo — bugs de deduplicación, cálculos o idioma a veces solo aparecen con datos reales.
- Audita cualquier `PLACEHOLDER` antes de dar algo por listo. Un placeholder dentro de un atributo vivo (`href`, `src`, config) no es una nota — es un bug real esperando a que alguien lo toque.
- Si el proyecto tiene base de datos real con datos de usuarios reales: trátalo con el mismo cuidado que producción — nunca corras una migración o cambio de esquema sin GO explícito, y prefiere cambios reversibles/aditivos sobre destructivos.
- Commits descriptivos explicando el "por qué", no solo el "qué".

---

## D) Ramas y PRs

**Excepción confirmada con Fercha para este proyecto:** en vez de PRs con preview, el flujo es push directo a `main`, así:

1. Trabaja en la rama `claude/project-diagnosis-q6ch5d` (rama única reutilizada para este proyecto, no una rama nueva por tarea).
2. Antes de tocar código: dile a Fercha qué vas a hacer y espera su "GO" explícito.
3. Después del cambio: corre `npm run typecheck` y `npm run build` (con un `.env.local` temporal si hace falta, bórralo después) — nunca subas algo sin validarlo.
4. Commit + push a `claude/project-diagnosis-q6ch5d`.
5. `git checkout main && git merge origin/main --ff-only && git merge claude/project-diagnosis-q6ch5d --ff-only && git push origin main`, luego vuelve a la rama de trabajo. Si `main` divergió (alguien más commiteó ahí directo), hacer merge normal en la rama de trabajo primero y luego el fast-forward a `main` — nunca forzar.
6. No se abren Pull Requests en este repo salvo que Fercha lo pida explícitamente para un caso puntual.
7. Marcar el bloque como completado en `PENDIENTES_DRIVER_INCIDENT_EVIDENCE.md` cuando corresponda.

---

*Nota: esta es la plantilla maestra. Al usarla en un proyecto nuevo, copia este archivo completo, rellena los `[corchetes]`, y decide si la Sección B aplica completa, o si el proyecto es simple y se puede omitir.*

