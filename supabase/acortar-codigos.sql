-- Circular Business Challenge 2: acortar códigos de acceso sin reiniciar la partida.
-- Ejecutar UNA SOLA VEZ desde el SQL Editor de Supabase.
-- Atención: los códigos antiguos dejarán de funcionar.
-- Se conservan Canvas, decisiones, resultados, rondas y datos económicos.
begin;
update public.cbc_game
set state = jsonb_set(
  state,
  '{teams}',
  (
    select jsonb_agg(
      jsonb_set(team, '{code}', to_jsonb(upper(substr(md5(gen_random_uuid()::text),1,8))))
      order by ordinality
    )
    from jsonb_array_elements(state->'teams') with ordinality as teams(team, ordinality)
  )
),
version = version + 1,
updated_at = now()
where id=1;
commit;

-- Comprueba los códigos nuevos:
select team->>'name' as equipo, team->>'code' as codigo
from public.cbc_game,
lateral jsonb_array_elements(state->'teams') team;
