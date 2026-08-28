# CLAUDE.md — [NOMBRE DEL PROYECTO]

Instrucciones de trabajo para cualquier sesión de Claude en este repo. Léelo completo antes de tocar código.

Repo: [owner/repo] — Stack: [ej. HTML/CSS/JS estático | Lovable + Supabase | Next.js | etc.]
Deploy: [ej. Vercel | Lovable | otro]

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
11. Mantén viva la lista de pendientes a lo largo del proyecto (en PENDIENTES_<APP>.md, ver sección B) — cosas identificadas pero pospuestas, deuda técnica, ideas que surgieron pero no eran prioridad. Sácalas a relucir cuando tenga sentido retomarlas, no dejes que se pierdan en el chat.
12. Sugiere optimizaciones de forma proactiva cuando veas algo que puede ayudar (patrón repetido, fricción de UX, riesgo a futuro) aunque no se haya pedido — coméntalo breve, no lo implementes sin que se pida.
13. El contenido final (copy, textos de marca, mensajes a usuarios/clientes) siempre lo aprueba Fercha. Puedes proponer y redactar borradores, pero no lo des por publicado sin su visto bueno explícito.
14. Nunca commitees `.env`, API keys ni credenciales. Si algo las necesita, avisa y pide que se agreguen directo en el hosting/donde corresponda — nunca las pidas por chat ni las escribas en el código.

---

## B) Los 3 documentos obligatorios del repo

**Esta sección es escalable según el proyecto.** Para una app personal simple, sin marca ni identidad visual propia, sin gente externa involucrada (ej. una herramienta de uso personal): puedes saltarte esta sección salvo que Fercha pida explícitamente crear estos documentos. Para un proyecto con marca, contenido, o más de una persona involucrada (ej. un producto que se vende o se comparte con un equipo): sí aplica completa.

Cuando aplique, todo repo debe tener estos 3 archivos en la raíz (nombrados `<DOC>_<NOMBRE_APP>.md`). Léelos siempre al empezar una sesión nueva. Si alguno no existe todavía, dilo — no asumas que no hace falta, y no lo crees sin que te lo pida.

1. **SPEC_<APP>.md** (o FLUJO_<APP>.md) — qué hace la app, cómo funciona, la lógica core, el flujo de usuario. Es la referencia técnica/funcional.

2. **IDENTIDAD_VISUAL_<APP>.md** — paleta de colores, tipografía, tono de voz, reglas de marca. Ningún color, fuente o patrón visual nuevo se agrega sin anotarlo aquí primero. Antes de aplicar cualquier estilo nuevo, consúltalo — no asumas un default genérico ("moderno", "minimalista", etc.) sin verificar qué pide este proyecto en particular.

3. **PENDIENTES_<APP>.md** — fuente de verdad de qué está hecho y qué falta, viva a lo largo de todo el proyecto (no solo de una sesión). Debe llevar fecha de "Última actualización" (y "Meta de entrega" si existe) visible arriba. Organízalo por **dueño y tipo**, no solo por bloque/feature — por ejemplo:
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

- Trabaja siempre en una rama `claude/<descripción-corta>`, nunca directo en `main`.
- Default: una rama nueva por bloque/tarea (más fácil de rastrear qué PR trajo qué). Para un feature grande que necesita muchas rondas de ajuste seguidas, reutilizar una sola rama a través de varios PRs chicos es válido — pero confírmalo con Fercha antes de adoptar ese patrón en vez del default.
- [Completar según el hosting: cómo se genera el link de preview — ej. "Vercel: hay que abrir PR para que el bot comente la URL" / "Lovable: el preview vive en la URL del proyecto directamente" / etc.]
- Cuando Fercha dé "Aprobado / GO" final sobre un bloque: mergear el PR sin borrar la rama (salvo que pida lo contrario), y marcar el bloque como completado en PENDIENTES_<APP>.md.

---

*Nota: esta es la plantilla maestra. Al usarla en un proyecto nuevo, copia este archivo completo, rellena los `[corchetes]`, y decide si la Sección B aplica completa, o si el proyecto es simple y se puede omitir.*

