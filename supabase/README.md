# Activación de Supabase — Circular Business Challenge 2

La conexión al proyecto Supabase está integrada en `sync.js` y en los
portales `index.html` y `profesor.html`, pero **no funciona hasta que
ejecutes el esquema SQL**. No se han migrado las decisiones previas de
los navegadores locales.

## Activación (una sola vez)

1. Abre [Supabase](https://supabase.com/dashboard) y entra en tu proyecto.
2. En **Authentication → Users**, crea una cuenta para el profesor con
   email y contraseña (o utiliza una cuenta ya existente y confirmada).
3. Abre [supabase/setup.sql](./setup.sql) y copia su contenido.
4. **Antes de ejecutarlo**, reemplaza en el SQL esta cadena:
   `profesor@TU-DOMINIO.es` por el correo real de la cuenta docente.
5. En **SQL Editor → New query**, pega el SQL y pulsa **Run**. No hace falta
   ningún cambio en las claves de GitHub.
6. Entra en
   [Panel del profesor](https://pericoff.github.io/circular-business-uja-2/profesor.html)
   e inicia sesión con la cuenta del profesor.
7. En el panel encontrarás los **nuevos códigos privados** generados
   aleatoriamente para los equipos. Reparte un código a cada equipo.
8. Los alumnos entran en
   [Portal del alumno](https://pericoff.github.io/circular-business-uja-2/)
   e introducen el código correspondiente.

## Funcionamiento

- Los equipos guardan el Canvas y envían las decisiones a Supabase.
- El profesor ve los equipos entregados; el panel se actualiza periódicamente.
- **Calcular y publicar resultados** requiere todas las entregas activas.
- **Cerrar ronda con pendientes** permite resolver aunque falten equipos;
  a los pendientes se les asigna producción e inversión cero, manteniendo los
  costes fijos del simulador. El profesor debe confirmar la acción.
- **Abrir siguiente ronda** publica el nuevo periodo para todos.
- La partida y su historial se conservan en Supabase. Reiniciar la partida
  borra los datos compartidos y genera códigos nuevos.

## Protección

- La `publishable key` es pública, no sustituye la autorización.
- El profesor inicia sesión mediante Supabase Authentication.
- El permiso docente se comprueba contra `cbc_teachers`.
- Los alumnos operan mediante funciones SQL que verifican su código privado.
- Las tablas tienen RLS activo, sin acceso directo desde el cliente.
- No se ha utilizado ni se debe publicar ninguna `service_role` o clave
  secreta del proyecto.

## Comprobación práctica

Usa dos navegadores independientes. Inicia sesión como profesor en uno y como
alumno en otro. Completa el Canvas, entrega decisiones y comprueba que aparece
**Entregado** en el panel docente. Prueba a cerrar una ronda y abrir la siguiente.

Si aparece «Configuración de Supabase pendiente», el SQL todavía no se ha
ejecutado o ha producido un error. Si el profesor recibe «Acceso denegado»,
comprueba que su correo de Authentication coincida con el registrado en
`cbc_teachers`.

**Nota:** las entregas hechas antes desde distintas copias locales no se
transfieren automáticamente. Para empezar una partida compartida, todos
los equipos deben usar los nuevos códigos del panel.
