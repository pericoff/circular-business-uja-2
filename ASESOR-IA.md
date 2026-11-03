# Activación del asesor IA — Circular Business Challenge 2

El frontend ya incluye **5 · Asesor IA**. Para responder con el modelo de OpenAI es imprescindible desplegar la Edge Function **circular-advisor** en el **Supabase de Circular Business Challenge 2**, cuyo URL en `sync.js` es:

`https://guqgjutsfxcfqkphvpse.supabase.co`

No se debe desplegar sobre el Supabase de STRATEGOS IA o de Strategy Lab. El asesor se comunica exclusivamente con `cbc_student_state`, validando el código de equipo en el servidor.

## Activación
1. Abre https://supabase.com/dashboard/project/guqgjutsfxcfqkphvpse/functions
2. **Deploy a new function → Via Editor**. Nombre exacto: `circular-advisor`.
3. Copia el código completo de `supabase/functions/circular-advisor/index.ts` en el editor y despliega.
4. En los ajustes de la función, desactiva **Verify JWT**. Esta implementación autentica al equipo mediante la llamada RPC `cbc_student_state` con su código privado y además valida el origen de la web.
5. En **Edge Functions → Secrets** configura `OPENAI_API_KEY` si todavía no existe en **este** proyecto. No copies ni publiques el secreto en GitHub ni en los archivos del navegador.
6. Entra como alumno con un código de equipo: https://pericoff.github.io/circular-business-uja-2/ y abre **5 · Asesor IA**.

## Datos y seguridad

El asesor no ve decisiones de equipos rivales: consulta el estado filtrado por `cbc_student_state` y prepara una instantánea del equipo solicitante. No puede editar la partida. El límite de cinco preguntas por cinco minutos se mantiene por instancia de ejecución; para uso intensivo se recomienda un limitador persistente.

Modelo OpenAI por defecto: `gpt-4.1-mini`. Opcionalmente configurar `CIRCULAR_OPENAI_MODEL`.

Si el portal muestra la pestaña pero el chat no responde, revisa el despliegue y los secretos del Supabase concreto de CBC-2. No ejecutes de nuevo `supabase/setup.sql`; no es necesario para activar el asesor. 
